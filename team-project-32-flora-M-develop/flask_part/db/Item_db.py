from pymongo import MongoClient
from backend.entities.Item import Item
from backend.entities.User import User
from bson.objectid import ObjectId
from datetime import datetime


client = MongoClient('mongodb+srv://admin:passw0rd@cluster0.neis0mb.mongodb.net/?retryWrites=true&w=majority',
                     tls=True,
                     tlsAllowInvalidCertificates=True)


class Item_db(object):
    def __init__(self):
        self.client = client
        self.coll = self.client['Market']
        self.item_db = self.coll['Items']
        self.user_db = self.coll['Users']

    def add_one(self, item_):
        """
        Add a new item to our database
        """
        temp = float(item_.getprice())
        new_item = {"name": item_.getname(),
                    "price": temp,
                    "discription": item_.getdescription(),
                    "picture": item_.getpicture(),
                    "poster": ObjectId(item_.getposter()),
                    "wishlist_by": [],
                    "sold": False,
                    "datetime": datetime.now(),
                    "pending": False,
                    "buyer": None
                    }
        if self.user_db.find_one(ObjectId(item_.getposter())) is None:
            raise Exception("the user is not exist, please register")
        else:
            inserted = self.item_db.insert_one(new_item)
            return inserted.inserted_id

    def update_one(self, filters, key, new_value):

        if self.item_db.find_one(filters) is None:
            raise Exception("the item doesn't exist. Please create the user")
        newvalues = {"$set": {key: new_value}}
        return self.item_db.update_one(filters, newvalues)

    def delete_one(self, itemID):

        filter = {'_id': ObjectId(itemID)}
        if self.item_db.find_one(filter) is None:
            raise Exception("the item you want delete is not exist, please find a new user")
        return self.item_db.delete_one(filter)

    def check_in(self, name):
        """
        check if an item is in the database through name
        """
        filter = {"name": name}
        if self.item_db.find_one(filter) is None:
            return False
        return True

    def find_one(self, types, name):
        """
        find if an one item in database through type
        """
        filters = {types: name}
        ret = self.item_db.find_one(filters)
        return ret

    def find_all(self):
        """
        find all items in the database
        """
        ret = list(self.item_db.find().sort("datetime", -1))
        return ret

    def find_one_id(self, name):
        """find the item id with the given name in our database"""
        filters = {"name": name}
        ret = self.item_db.find_one(filters)
        _id = ret.get("_id") 
        return _id

    def find_one_by_id(self, _id):
        """
        find one item in database by id
        """
        filters = {"_id": ObjectId(_id)}
        return self.item_db.find_one(filters)

    def update_item_add_wishlist(self, _id, user_id):
        """Add the item with id as _id to the user's wishlist where the user has user id as user_id"""
        filters = {"_id": ObjectId(_id)}
        ret = self.item_db.update_one(filters, {"$push": {"wishlist_by": ObjectId(user_id)}})
        return ret

    def update_item_remove_wishlist(self, _id, user_id):
        """Remove the item with id as _id from the user's wishlist where the user has user id as user_id"""
        filters = {"_id": ObjectId(_id)}
        ret = self.item_db.update_one(filters, {"$pull": {"wishlist_by": ObjectId(user_id)}})
        return ret

    def set_buyer(self, itemID, userID):
        """set the buyer of the item and change the state of both pending and sold to true"""
        filters = {"_id": ObjectId(itemID)}
        ret = self.item_db.update_one(filters, {"$set": {"buyer": ObjectId(userID), "pending": True, "sold": True}})
        return ret


if __name__ == '__main__':
    user = User("peter", "123456", "peter@peter")
    item = Item("a", 13, "牛蛙", "picture", "634df5776b892bbf79685d78")
    obj = Item_db()
    # obj.check_in("b")
    obj.add_one(item)
    # obj.find_all()

