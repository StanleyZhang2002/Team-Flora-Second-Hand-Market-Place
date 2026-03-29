
class User(object):
    """
    A class represent a user of our website
    """
    username: str
    password: str
    contact: str
    posting = []
    wishlists = []
    rating = 0.0
    rate_count = 0

    def __init__(self, username: str, password: str, contact: str) -> object:
        self.username = username
        self.password = password
        self.contact = contact
        self.posting = []
        self.wishlists = []

    def get_username(self) -> str:
        """
        Get the username of a user
        :return: the username of the user
        """
        return self.username

    def set_username(self, username: str) -> None:
        """
        Update username of a user
        :param username: the new username of the user
        """
        self.username = username

    def get_password(self) -> str:
        """
        Get the password of a user
        :return: the password of the user
        """
        return self.password

    def set_password(self, password: str) -> None:
        """
        Update the password of the user
        :param password: the new password of the user
        """
        self.password = password

    def get_contact(self) -> str:
        """
        Get the contact information of the user
        :return: the contact information of the user
        """
        return self.contact

    def set_contact(self, contact: str) -> None:
        """
        Update the contact information of the user
        :param contact: the new contact information of the user
        """
    def setrating(self, rating: float) -> None:
        """
        Update the rating of an item
        :param rating: the new rating of the item
        """
        self.rating = rating
    def getrating(self) -> float:
        """
        Get the rating of the item
        :return: the rating of the item
        """
        return self.rating
    def setrate_count(self, rate_count: int) -> None:
        """
        Update the rate_count of an item
        :param rate_count: the new rate_count of the item
        """
        self.rate_count = rate_count
    def getrate_count(self) -> int:
        """
        Get the rate_count of the item
        :return: the rate_count of the item
        """
        return self.rate_count
