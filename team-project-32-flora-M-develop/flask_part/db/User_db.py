from pymongo import MongoClient
from backend.entities.User import User
from bson import ObjectId


client = MongoClient('mongodb+srv://admin:passw0rd@cluster0.neis0mb.mongodb.net/?retryWrites=true&w=majority',
                     tls=True,
                     tlsAllowInvalidCertificates=True)


class User_db(object):
    def __init__(self):
        self.client = client
        self.coll = self.client['Market']
        self.user_db = self.coll['Users']
        # self.coll = self.client['test']
        # self.user_db = self.coll['user']

    def add_one(self, users):
        """

        :param users: entity User
        :return: adds a new user if not exist

        """
        new_user = {'username': users.get_username(),
                    'password': users.get_password(),
                    'contact': users.get_contact(),
                    'posting': [],
                    'wishlist': [],
                    'boughtlist': [],
                    'rating': 0.0,
                    'rate_count': 0
                    }

        if self.user_db.find_one({"username": users.get_username()}) is None:
            return self.user_db.insert_one(new_user)

        else:
            raise Exception("the item is already exist")

    def update_one(self, filter, key, new_value):

        """
        update user with filter
        """
        # filter = {'username': username}
        if self.user_db.find_one(filter) is None:
            raise Exception("the users doesn't exist. Please create the user")
        newvalues = {"$set": {key: new_value}}
        return self.user_db.update_one(filter, newvalues)

    def delete_one(self, username):
        """
        delete the user with the given username
        """
        filter = {'username': username}
        if self.user_db.find_one(filter) is None:
            raise Exception("the users you want delete is not exist, please find a new user")
        return self.user_db.delete_one(filter)

    def check_in(self, username, password):
        """
        from database check if username and password are in the database
        return: boolean true indicating they are in the database and false if not
        """
        filter = {'username': username, 'password': password}
        if self.user_db.find_one(filter) is None:
            return False
        return True

    def check_in_user(self, username):
        """
        check username is already exisit.
        param: username
        return: boolean true indicating already exist and false otherwise
        """
        filter = {'username': username}
        if self.user_db.find_one(filter) is None:
            return False
        return True

    def check_in_contact(self, email):
        """
        check username is already exisit.
        param: email
        return: boolean true indicating already exist and false otherwise
        """
        filter = {'contact': email}
        if self.user_db.find_one(filter) is None:
            return False
        return True

    def find_one(self, filters):
        """find one user using filters"""
        return self.user_db.find_one(filters)

    def find_one_by_id(self, _id):
        """find the user with the given id"""
        filters = {"_id": ObjectId(_id)}
        return self.user_db.find_one(filters)

    def find_all(self):
        """find all users in database"""
        ret = list(self.user_db.find().sort("datetime"))
        return ret

    def update_user_posting(self, _id, obj_id):
        """add the item with the give id to the list of postings of the user"""
        filters = {"_id": ObjectId(_id)}
        ret = self.user_db.update_one(filters, {"$push": {"posting": ObjectId(obj_id)}})
        return ret

    def remove_user_posting(self, _id, obj_id):
        """remove the item with the give id from the list of postings of the user"""
        filters = {"_id": ObjectId(_id)}
        ret = self.user_db.update_one(filters, {"$pull": {"posting": ObjectId(obj_id)}})
        return ret

    def update_user_add_wishlist(self, _id, obj_id):
        """add the item with the give id to the wishlist of the user"""
        filters = {"_id": ObjectId(_id)}
        ret = self.user_db.update_one(filters, {"$push": {"wishlist": ObjectId(obj_id)}})
        return ret

    def update_user_remove_wishlist(self, _id, obj_id):
        """remove the item with the give id from the wishlist of the user"""
        filters = {"_id": ObjectId(_id)}
        ret = self.user_db.update_one(filters, {"$pull": {"wishlist": ObjectId(obj_id)}})
        return ret
    
    def update_user_history(self, _id, obj_id):
        """add the item with the give id to the list of bought items of the user"""
        filters = {"_id": ObjectId(_id)}
        ret = self.user_db.update_one(filters, {"$push": {"boughtlist": ObjectId(obj_id)}})
        return ret
    
    def rate_user(self, username, new_rating):
        filters = { "username" : username}
        rated_user = self.user_db.find_one(filters)
        old_rating = rated_user['rating']
        old_rate_count = rated_user['rate_count']
        new_rate_count = old_rate_count + 1
        new_rating = round((old_rating * old_rate_count + new_rating) / new_rate_count, 2)
        ret = self.user_db.update_one(filters, {"$set": {"rating": new_rating, "rate_count": new_rate_count}})
        return ret


if __name__ == '__main__':
    user = User('new', "123456", "peter@peter")
    obj = User_db()
    print(obj.find_one_by_id("63679bec4751724547fe9b29").get('contact'))
    # obj.find_all()
    # obj. update_user_posting('634df5776b892bbf79685d78', '636183f9ac32ca0bd60c5b15')

