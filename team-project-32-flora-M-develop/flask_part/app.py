from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
import os
from backend.function import controllers, Itemfunction, Userfunction
import config
from exts import mail
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager
from bson import json_util

app = Flask(__name__)
api = Api(app)
app.config.from_object(config)

mail.init_app(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config["JWT_COOKIE_SECURE"] = True
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_SECRET_KEY"] = config.SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=20)
jwt = JWTManager(app)


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=15))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())

            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json_util.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


api.add_resource(controllers.SearchItem, '/searchItem')
api.add_resource(controllers.SearchById, '/searchById')
api.add_resource(controllers.SearchAllItem, '/searchAllItem')

api.add_resource(Itemfunction.CreateItem, '/createItem')
api.add_resource(Itemfunction.LikeItem, '/likeItem')
api.add_resource(Itemfunction.BuyItem, '/buyItem')
api.add_resource(Itemfunction.DeletePicture, '/deletePicture')

api.add_resource(Userfunction.CreateUser, '/register')
api.add_resource(Userfunction.SearchUserByID, '/searchUserByID')
api.add_resource(Userfunction.Login, '/login')
api.add_resource(Userfunction.RateUser, '/rateUser')

api.add_resource(Userfunction.Logout, '/logout')
api.add_resource(Userfunction.GoMyProfile, '/profile')
api.add_resource(Userfunction.ChangePicture, '/profile/picture')
api.add_resource(Userfunction.CheckToken, '/checkToken')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
