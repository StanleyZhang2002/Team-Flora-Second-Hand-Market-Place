import json

from flask import jsonify, request
from flask_restful import Resource, reqparse, abort
from bson import json_util, ObjectId

from db.Item_db import Item_db
from db.User_db import User_db


class SearchItem(Resource):
    """
    SearchItem get method
    Given the types of data that we are searching with which are either the item's name
    or the item's id and give the actual value of the data
    type: either "name" or "_id"
    name: no restriction on this, it is the value of the data either name of the item or the id of the item
    If the item exist in our database, we return the detailed information about that item in json format
    If the item does not exist in our databse, we return an error message saying the item not exist
    """

    def get(self):
        name = request.args.get('name')
        types = request.args.get('types')
        if types == "poster" or types == '_id':
            if ObjectId.is_valid(name):
                name = ObjectId(name)
            else:
                return jsonify(errno="400", errmsg="please enter valid _id")
        item_db = Item_db()
        item = item_db.find_one(types, name)
        result = json.loads(json_util.dumps(item))
        if result is None:
            return jsonify(errno = "400", errmsg="there is no such item")
        return result


class SearchById(Resource):
    """
        SearchById get method
        This function takes only one input which is the id of the item and check if this item is in our databse
        _id: valid format for item _id
        Same to the SearchItem function, we return the detail information about the item in json format if it exist in our database
        Or we give an error message saying the item does not exist
        """
    def get(self):
        _id = request.args.get('_id')
        if ObjectId.is_valid(_id):
            name = ObjectId(_id)
        else:
            return jsonify(errno="400", errmsg="please enter valid _id")
        name = ObjectId(_id)
        item_db = Item_db()
        item = item_db.find_one('_id', name)
        result = json.loads(json_util.dumps(item))
        if result is None:
            return jsonify(errno="400", errmsg="there is no such item")
        return result


class SearchAllItem(Resource):
    """
        SearchAllItem get method
        This function returns all items in our databse in json format so no input is needed
    """
    def get(self):
        item_db = Item_db()
        all_coll = item_db.find_all()
        return json.loads(json_util.dumps(all_coll))
