from bson import ObjectId
from flask import jsonify, request, Response
from flask_restful import Resource, reqparse, abort
from bson import json_util
from db.Item_db import Item_db
from db.User_db import User_db
from backend.entities.User import User
import json
import string
import random
from exts import mail
from flask_mail import Message


import string
import random
from exts import mail
from flask_mail import Message

from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager, set_access_cookies


class CreateUser(Resource):
    """
    This function creates an new user in our database and sends an email confirmation to them after they are succesfully registered
    It also handles corner cases where if an email is registered already or some unexpected errors occur, we will give the
    corresponding error message
    """
    def post(self):
        username = request.form.get('username')
        password = request.form.get('password')
        contact = request.form.get('contact')
        user_db = User_db()

        if user_db.check_in_user(username) or user_db.check_in_contact(contact):
            return Response("Existing username or email", 300)

        new_user = User(username, password, contact)
        try:
            user_db.add_one(new_user)
            message = Message(subject="Welcome message", recipients=[contact])
            message.body = "You have successly register to UofT Marketplace, \r\n" \
                           "your username is " + username + "\r\n" + "your password is " + password\
                           + "\r\n please remember your password and username"
            mail.send(message)
        except Exception as e:
            return jsonify(errno="400", errmsg=e)

        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)


class GoMyProfile(Resource):
    """
    This function finds the detail information about a user where the username is either given as an input or it is just the
    user that currently logined in
    AT the end, this function finds the user and gets the detail information about them and return it in json format
    """
    @jwt_required()
    def get(self):
        user_db = User_db()
        current_user = get_jwt_identity().replace('"', '')
        username = request.args.get('username')
        if username is not None:
            to_send = user_db.find_one({'username': username})
            return json.loads(json_util.dumps(to_send))
        else:
            to_send = user_db.find_one({'username': current_user})
            return json.loads(json_util.dumps(to_send))
    

class SearchUserByID(Resource):

    """
    SearchUser get method
    It takes finds an user in our databse based on the user id
    If the user exist in our databse, then we return the detail information about that user in json format
    Otherwise, we return an error message in json format indicating no such user
    """
    def get(self):
        _id = request.args.get('_id')
        if ObjectId.is_valid(_id):
            name = ObjectId(_id)
        else:
            return jsonify(errno="400", errmsg="please enter valid _id")
        user_db = User_db()
        user = user_db.find_one_by_id(name)
        result = json.loads(json_util.dumps(user))
        if result is None:
            return jsonify(errno="400", errmsg="there is no such user")
        return result


class Login(Resource):
    """
    This function handles the login action by the user where it gives corresponding error message when invalid username
    or password is entered
    """
    def post(self):
        # print(request.form)
        username = request.form.get('username')
        pwd = request.form.get('pwd')
        user_db = User_db()
        if not user_db.check_in_user(username):
            return Response("Invalid username", 300)
        elif not user_db.check_in(username, pwd):
            return Response("Invalid password", 400)
        else:
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token)
            # return jsonify(access_token=access_token)
            # user = user_db.find_one({'username': username})
            # return json.loads(json_util.dumps(user))


class Logout(Resource):
    """
    This function handles the logout action by the user
    """
    @jwt_required()
    def get(self):
        response = jsonify({"msg": "logout successful"})
        unset_jwt_cookies(response)
        return response


class RateUser(Resource):
    @jwt_required()
    def post(self):
        user_db = User_db()
        username = request.form.get('username')
        rating = int(request.form.get('rating'))
        if not user_db.check_in_user(username):
            return Response("Invalid username", 300)
        else:
            user_db.rate_user(username, rating)
            return Response("Rating successful", 200)

    def get(self):
        user_db = User_db()
        username = request.args.get('username')
        if not user_db.check_in_user(username):
            return Response("Invalid username", 300)
        else:
            rating = user_db.get_rating(username)
            return jsonify(rating=rating, rate_count=user_db.get_rate_count(username))


class ChangePicture(Resource):
    """
    This function performs the task of user changing their profile picture
    """
    @jwt_required()
    def put(self):
        user_db = User_db()
        picture_url = request.args.get("pictureUrl")
        current_user = get_jwt_identity().replace('"', '')
        if current_user is not None:
            user_db.update_one({'username': current_user}, "picture", picture_url)
        response = jsonify({"msg": "change successful"})
        return response


class CheckToken(Resource):
    """
    Token checking purpose
    """
    @jwt_required()
    def get(self):
        return {}
