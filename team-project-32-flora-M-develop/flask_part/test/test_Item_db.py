import unittest
from db.User_db import *
from db.Item_db import *
from backend.entities.User import *
from backend.entities.Item import *

test_user3 = User("TEST3", "123456", "TEST@TEST.com")
test_user4 = User("TEST4", "123456", "TEST@TEST.com")

user_db = User_db()
item_db = Item_db()


class Test(unittest.TestCase):
    def test_add_one(self):
        user_db.add_one(test_user3)
        user_id1 = user_db.find_one({'username': 'TEST3'}).get('_id')
        test_item = Item('test3', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id = item_db.find_one_id("test3")
        answer = item_db.check_in('test3')
        self.assertEqual(True, answer)
        item_db.delete_one(item_id)
        user_db.delete_one("TEST3")

    def test_find_one(self):
        user_db.add_one(test_user3)
        user_id1 = user_db.find_one({'username': 'TEST3'}).get('_id')
        test_item = Item('test3', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id = item_db.find_one_id("test3")
        answer = item_db.find_one('name', 'test3').get('name')
        self.assertEqual("test3", answer)
        item_db.delete_one(item_id)
        user_db.delete_one("TEST3")

    def test_find_one_by_id(self):
        user_db.add_one(test_user3)
        user_id1 = user_db.find_one({'username': 'TEST3'}).get('_id')
        test_item = Item('test3', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id = item_db.find_one_id("test3")
        answer = item_db.find_one_by_id(item_id).get('name')
        self.assertEqual("test3", answer)
        item_db.delete_one(item_id)
        user_db.delete_one("TEST3")


    def test_update_wishlist(self):
        user_db.add_one(test_user3)
        user_db.add_one(test_user4)

        user_id1 = user_db.find_one({'username': 'TEST3'}).get('_id')
        user_id2 = user_db.find_one({'username': 'TEST4'}).get('_id')
        test_item = Item('test3', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id = item_db.find_one_id("test3")
        item_db.update_item_add_wishlist(item_id, user_id2)
        answer = item_db.find_one_by_id(item_id).get('wishlist_by')
        self.assertEqual([user_id2], answer)
        item_db.delete_one(item_id)
        user_db.delete_one("TEST3")
        user_db.delete_one("TEST4")

    def test_update(self):
        user_db.add_one(test_user3)
        user_id1 = user_db.find_one({'username': 'TEST3'}).get('_id')
        test_item = Item('test3', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id = item_db.find_one_id("test3")
        item_db.update_one({'name': 'test3'}, 'price', 8888.0)
        answer = item_db.find_one_by_id(item_id).get('price')
        self.assertEqual(8888, answer)
        item_db.delete_one(item_id)
        user_db.delete_one("TEST3")

