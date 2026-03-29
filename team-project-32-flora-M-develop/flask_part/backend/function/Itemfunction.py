from backend.entities.Item import *
from flask import jsonify, request
from flask_restful import Resource, reqparse
from bson import json_util, ObjectId
from db.Item_db import Item_db
from db.User_db import User_db
from backend.entities.Item import Item
import json
import boto3
import os
import string
import random
from exts import mail
from flask_mail import Message

from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


class CreateItem(Resource):

    """ createing a new item
    Mandatory input: name of the item, the price of the item
    Non-mandatory input: description of the item and the image of the item
    input format：json
    """
    @jwt_required()
    def post(self):
        req_dict = request.get_json()
        # Mandatory input
        name = req_dict.get("name")
        price = float(req_dict.get("price"))
        # poster = req_dict.get("poster")
        # Non-mandatory input
        description = req_dict.get("discription")
        picture = req_dict.get("picture")

        user_db = User_db()
        item_db = Item_db()
        current_user = get_jwt_identity().replace('"', '')
        poster = user_db.find_one({'username': current_user}).get('_id')

        if not all([name, price, poster]):
            return jsonify(errno="400", errmsg="please fill in everything")

        if not user_db.find_one_by_id(poster):
            return jsonify(errno="400", errmsg="cannot find user in db")

        new_item = Item(name, price, description, picture, poster)

        try:
            item_id = item_db.add_one(new_item)
            user_db.update_user_posting(poster, item_id)
        except Exception as e:
            print(e)
            return jsonify(errno="400", errmsg=e)

        return json.loads(json_util.dumps({"itemID": item_id}))

    """
    deleting an existing item
    Input: id of the item that want to delete
    This function deletes an item from our database
    """
    @jwt_required()
    def delete(self):
        itemID = request.args.get("itemID")
        user_db = User_db()
        item_db = Item_db()
        current_user = get_jwt_identity().replace('"', '')
        userID = user_db.find_one({'username': current_user}).get('_id')
        if not user_db.find_one_by_id(userID):
            return jsonify(errno="400", errmsg="cannot find user in db")
        if not item_db.find_one_by_id(itemID):
            return jsonify(errno="400", errmsg="cannot find item in db")
        if not ObjectId(itemID) in user_db.find_one_by_id(userID)["posting"]:
            return jsonify(errno="400", errmsg="not current user's posting")
        try:
            item_db.delete_one(itemID)
            user_db.remove_user_posting(userID, itemID)
        except Exception as e:
            return jsonify(errno="400", errmsg=e)

        return jsonify(errno="200", errmsg="delete success")


class LikeItem(Resource):
    """
    This function takes the item id of an item as input and add this item to the wishlist of the current user
    input: item id
    We also handle mulitple corner cases such as the user or the item id is not in our database or the item is already
    in the wishlist of the current user or some other exceptions. We return corresponding error message in each case
    """
    @jwt_required()
    def post(self):
        itemID = request.args.get("itemID")
        user_db = User_db()
        item_db = Item_db()
        current_user = get_jwt_identity().replace('"', '')
        userID = user_db.find_one({'username': current_user}).get('_id')
        if not user_db.find_one_by_id(userID):
            return jsonify(errno="400", errmsg="cannot find user in db")
        if not item_db.find_one_by_id(itemID):
            return jsonify(errno="400", errmsg="cannot find item in db")
        if (
            ObjectId(userID) in item_db.find_one_by_id(itemID)["wishlist_by"]
            and ObjectId(itemID) in user_db.find_one_by_id(userID)["wishlist"]
        ):
            return jsonify(errno="400", errmsg="already added this item to wishlist")
        try:
            user_db.update_user_add_wishlist(userID, itemID)
            item_db.update_item_add_wishlist(itemID, userID)
        except Exception as e:
            return jsonify(errno="400", errmsg="cannot like item")
        return jsonify(errno="200", errmsg="added to wishlist")

    """
    This function takes the item id of an item as input and remove this item from the wishlist of the current user
    input: item id
    This function also handles corner cases and unexpected exceptions
    """
    @jwt_required()
    def delete(self):
        itemID = request.args.get("itemID")
        user_db = User_db()
        item_db = Item_db()
        current_user = get_jwt_identity().replace('"', '')
        userID = user_db.find_one({'username': current_user}).get('_id')
        if not user_db.find_one_by_id(userID):
            return jsonify(errno="400", errmsg="cannot find user in db")
        if not item_db.find_one_by_id(itemID):
            return jsonify(errno="400", errmsg="cannot find item in db")
        if (
            ObjectId(userID) not in item_db.find_one_by_id(itemID)["wishlist_by"]
            and ObjectId(itemID) not in user_db.find_one_by_id(userID)["wishlist"]
        ):
            return jsonify(errno="400", errmsg="item not in wishlist")
        try:
            user_db.update_user_remove_wishlist(userID, itemID)
            item_db.update_item_remove_wishlist(itemID, userID)
        except Exception as e:
            return jsonify(errno="400", errmsg="cannot like item")
        return jsonify(errno="200", errmsg="removed from wishlist")


class BuyItem(Resource):
    """
    This function takes an item id as input and move this item to the list of bought items of the current user
    input: item id
    This function handles corner cases and unexpected exceptions and after the user buys the item, this function
    also sends an email to the user providing them with the seller's email asking the buyer to communicate with the seller
    directly
    """
    @jwt_required()
    def post(self):
        req_dict = request.get_json()
        itemID = req_dict.get("itemID")
        user_db = User_db()
        item_db = Item_db()
        current_user = get_jwt_identity().replace('"', '')
        userID = user_db.find_one({'username': current_user}).get('_id')
        if not user_db.find_one_by_id(userID):
            return jsonify(errno="400", errmsg="cannot find user in db")
        if not item_db.find_one_by_id(itemID):
            return jsonify(errno="400", errmsg="cannot find item in db")
        if (
            item_db.find_one_by_id(itemID)["sold"]
            or ObjectId(itemID) in user_db.find_one_by_id(userID)["boughtlist"]
        ):
            return jsonify(errno="400", errmsg="item already sold")
        try:
            user_db.update_user_history(userID, itemID)
            item_db.set_buyer(itemID, userID)
        except Exception as e:
            return jsonify(errno="400", errmsg="cannot buy item")

        user_email = user_db.find_one_by_id(userID).get("contact")
        item_poster = item_db.find_one_by_id(itemID).get("poster")
        item_name = item_db.find_one_by_id(itemID).get("name")
        seller_email = user_db.find_one_by_id(item_poster).get("contact")

        message = Message(subject="verification code", recipients=[user_email],
                          body="you have purchase the " + item_name + "\n"
                               + "the poster email is " + seller_email + "\n"
                               + "you may contact the seller with this email")
        mail.send(message)
        return jsonify(errno="200", errmsg="bought")


class DeletePicture(Resource):
    """
    This function deletes the picture associated with this item from our databse
    It also handles unexpected exceptions
    """
    def delete(self):
        picture_name = request.args.get("pictureName")
        s3 = boto3.resource(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.environ.get("AWS_SECERET_KEY"),
        )
        try:
            response = s3.Object("flora-bucket", "photos/" + picture_name).delete()
            # print(response)
            return jsonify(errno="200", errmsg="delete " + picture_name)
        except Exception as e:
            print(e)
            return jsonify(errno="400", errmsg="cannot delete picture")

