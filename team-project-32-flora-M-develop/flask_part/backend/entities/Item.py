from backend.entities.User import User
class Item:
    """
    A class contains information about an item
    """

    price: float
    description: str
    picture: str
    poster: User
    rating: float

    def __init__(self, name: str, price: float, description: str, picture: str, poster: User):
        self.name = name
        self.price = price
        self.description = description
        self.picture = picture
        self.poster = poster

    def setname(self, name: str) -> None:
        """
        update name of an item
        :param name: the new name to set to
        """
        self.name = name

    def getname(self) -> str:
        """
        return the name of an item
        """
        return self.name

    def setprice(self, price: float) -> None:
        """
        Update price of an item
        :param price: the new price to set to
        """
        self.price = price

    def getprice(self) -> float:
        """
        Return the price of an item
        :return: the price of the item
        """
        return self.price

    def setdescription(self, description: str) -> None:
        """
        Update description of an item
        :param description: the new description of the item
        """
        self.description = description

    def getdescription(self) -> str:
        """
        Get the description of the item
        :return: the description of the item
        """
        return self.description

    def setpicture(self, picture: str) -> None:
        """
        Update picture of an item
        :param picture: the image source of the new picture
        """
        self.picture = picture

    def getpicture(self) -> str:
        """
        Get the picture of the item
        :return: the image source of the picture of the item
        """
        return self.picture

    def setposter(self, poster: User) -> None:
        """
        Update the poster of an item
        :param poster: the new poster of the item
        """
        self.poster = poster

    def getposter(self) -> User:
        """
        Get the poster of the item
        :return: the poster of the item
        """
        return self.poster
    
