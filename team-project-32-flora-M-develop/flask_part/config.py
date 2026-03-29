from pymongo import MongoClient
client = MongoClient('mongodb+srv://admin:passw0rd@cluster0.neis0mb.mongodb.net/?retryWrites=true&w=majority',
                     tls=True,
                     tlsAllowInvalidCertificates=True)

SECRET_KEY = "snsdf453121hskfe321wrbs5749krjer"


#mail_config
MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 465
MAIL_USE_TLS = False
MAIL_USE_SSL = True
MAIL_DEBUG = True
MAIL_USERNAME = "csc343project@gmail.com"
MAIL_PASSWORD = "ibbwockogxuteuds"
MAIL_DEFAULT_SENDER = "csc343project@gmail.com"