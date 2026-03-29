from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient
load_dotenv(find_dotenv())

password = os.environ.get("MONGODB_PWD")
# password = "passw0rd"

connection_string = f"mongodb+srv://admin:{password}@cluster0.neis0mb.mongodb.net/Market?retryWrites=true&w=majority"
client = MongoClient(connection_string)

#peter的测试配置
# client = MongoClient('mongodb+srv://admin:passw0rd@cluster0.neis0mb.mongodb.net/?retryWrites=true&w=majority',
#                      tls=True,
#                      tlsAllowInvalidCertificates=True)
# connect to the market database
db = client["Market"]

# schema for a User
user_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "additionalProperties": True,
        "required": ["username", "password", "contact"],
        "properties": {
            "username": {
                    "bsonType": "string"
            },
            "password": {
                "bsonType": "string",
                "description": "encrypted string"
            },
            "contact": {
                "bsonType": "string",
            },
            "posting": {
                "bsonType": "array",
                "description": "User's Items for sell",
                "items": {
                    "bsonType": "objectId",
                    "description": "objectId of an Item"
                }
            },
            "wishlist": {
                "bsonType": "array",
                "description": "User's wishlist Items",
                "items": {
                    "bsonType": "objectId",
                    "description": "objectId of an Item"
                }
            },
            "boughtlist": {
                "bsonType": "array",
                "description": "User's bought list Item",
                "items":{
                    "bsonType": "objectId",
                    "description": "objectId of an Item"
                }
            },
            "picture": {
                "bsonType": "string",
                "description": "url of profile picture"
            }
        }
    }
}

# schema for an Item
item_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "additionalProperties": True,
        "required": ["name", "price", "poster"],
        "properties": {
            "name": {
                "bsonType": "string",
            },
            "price": {
                "bsonType": "double"
            },
            "discription": {
                "bsonType": "string",
            },
            "picture": {
                "bsonType": "string",
                "description": "url of pictures"
            },
            "poster": {
                "bsonType": "objectId",
                "description": "objectId of the User than owns this Item"
            },
            "wishlist_by": {
                "bsonType": "array",
                "description": "Users who wishlisted this Item",
                "items": {
                    "bsonType": "objectId",
                    "description": "objectId of a User"
                }
            },
        }
    }
}


def create_collection(coll_name, validator):
    result = db.create_collection(coll_name, validator=validator)
    print(result)


def add_user_validator_check():
    user_coll = db['Users']
    try:
        user_coll.insert_one({"name": "Rainbow RGB", "box_size": 3})
    except Exception as e:
        print(e)


if __name__ == "__main__":
    # create/update schemas
    try:
        create_collection("Users", user_validator)
        print("created Users")
    except Exception as e:
        print(e)
        db.command("collMod", "Users", validator=user_validator)
        print("updated Users")
        # print(db.get_collection("Users").options().get('validator'))

    try:
        create_collection("Items", item_validator)
        print("created Items")
    except Exception as e:
        print(e)
        db.command("collMod", "Items", validator=item_validator)
        print("updated Items")
        # print(db.get_collection("Items").options().get('validator'))