import unittest
from db.User_db import *
from db.Item_db import *
from backend.entities.User import *
from backend.entities.Item import *

test_user = User("TEST", "123456", "TEST@TEST.com")
test_user2 = User("TEST2", "123456", "TEST@TEST.com")


user_db = User_db()
item_db = Item_db()


class Test(unittest.TestCase):
    def test_add_one(self):
        user_db.add_one(test_user)
        answer = user_db.check_in("TEST", "123456")
        self.assertEqual(True, answer)
        user_db.delete_one("TEST")

    def test_update_one(self):
        user_db.add_one(test_user2)
        user_db.update_one({'username': "TEST2"}, "password", "654321")
        answer = user_db.check_in("TEST2", "654321")
        self.assertEqual(True, answer)
        user_db.delete_one("TEST2")

    def test_delete_one(self):
        user_db.add_one(test_user)
        user_db.delete_one("TEST")
        answer = user_db.check_in_user("TEST")
        self.assertEqual(False, answer)

    def test_find_one(self):
        user_db.add_one(test_user)
        answer = user_db.find_one({'username': 'TEST'}).get('username')
        self.assertEqual("TEST", answer)
        user_db.delete_one("TEST")

    def test_update_user_posting(self):
        user_db.add_one(test_user)
        user_id1 = user_db.find_one({'username': 'TEST'}).get('_id')
        test_item = Item('test1', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id1 = item_db.find_one_id('test1')
        user_db.update_user_posting(user_id1, item_id1)
        answer = user_db.find_one({'username': 'TEST'}).get('posting')
        self.assertEqual([item_id1], answer)
        user_db.delete_one("TEST")
        item_db.delete_one(item_id1)

    def test_delete_user_posting(self):
        user_db.add_one(test_user)
        user_id1 = user_db.find_one({'username': 'TEST'}).get('_id')
        test_item = Item('test1', 9999, 'test', '', user_id1)
        item_db.add_one(test_item)
        item_id1 = item_db.find_one_id('test1')
        user_db.update_user_posting(user_id1, item_id1)
        user_db.remove_user_posting(user_id1,item_id1)
        answer = user_db.find_one({'username': 'TEST'}).get('posting')
        self.assertEqual([], answer)
        user_db.delete_one("TEST")
        item_db.delete_one(item_id1)

    def test_update_rating(self):
        user_db.add_one(test_user)
        user_id1 = user_db.find_one({'username': 'TEST'}).get('_id')
        user_db.rate_user(user_id1, 5)
        temp = user_db.find_one({'username': 'TEST'})
        rating = temp.get('rating')
        rating_count = temp.get('rate_count')
        self.assertEqual(5.0, rating)
        self.assertEqual(1, rating_count)
        user_db.delete_one("TEST")
