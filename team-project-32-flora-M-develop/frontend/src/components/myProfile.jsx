import React, { useState, useEffect } from "react";
import "./styles/myProfile.css";
import axios from "axios";
import FadeIn from "react-fade-in/lib/FadeIn";
import { apiUri } from "../assets/constants";
import awsS3Service from "../services/awsS3Service";
import defaultIcon from "./images/default.jpeg";

// Only current user could access,  check own user details

function MyProfile() {
  const [username, setUsername] = useState("");
  const isAuthenticated = sessionStorage.getItem("isAuth");
  const [contact, setContact] = useState("");
  const [posting, setPosting] = useState([]);
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishitems, setWishitems] = useState([]);
  const [picture, setPicture] = useState(null);
  const [userID, setUserID] = useState("")
  const [rating, setRating] = useState(0)
  const [allset, setAllset] = useState(false)

  const [isHovering, setIsHovering] = useState(false);
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanShow(true), 200);
    return () => clearTimeout(timer);
  });

  function getMyProfile() {
    // Send request with token to get current user's detail
    axios({
      method: "GET",
      url: apiUri + "/profile",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        const profile = response.data;
        setUserID(profile._id.$oid)
        setUsername(profile.username);
        setContact(profile.contact);
        setWishlist(profile.wishlist);
        setPosting(profile.posting);
        setRating(profile.rating);
        setPicture(profile.picture);
        setAllset(true)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
        }
      });
  }

  async function getProducts() {
     // Send request to get an array of all items in database, then filter it to only get current user's posting
    await axios({
      method: "GET",
      url: apiUri + "/searchAllItem",
    })
      .then((response) => {
        const products = response.data;
        const posting_list = [];
        const wishing_list = []
        for (var i = 0; i < products.length; i++) {
          if (
            posting.some((element) => {
              if (element.$oid === products[i]._id.$oid) {
                return true;
              }
              return false;
            })
          ) {
            posting_list.push(products[i]);
          }
          if (
            wishlist.some((element) => {
              if (element.$oid === products[i]._id.$oid) {
                return true;
              }
              return false;
            })
          ) {
            wishing_list.push(products[i]);
          }
        }
        setItems(posting_list);
        setWishitems(wishing_list);
      })
      .catch((error) => {
          console.log(error.response);
          console.log(error.response.status);
        }
      );
  }

  useEffect(() => {
    getMyProfile();
  }, []);

  useEffect(() => {
    if (allset) {
      getProducts();
    }
  }, [allset]);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  function ChangeIcon() {
    document.getElementById("upload-pfp").click();
  }

  const uploadImg = async (e) => {
    // if an img already uploaded, remove it from bucket first
    if (picture) {
      await awsS3Service.remove(picture);
    }
    const file = e.target.files[0];
    const awsFileUrl = await awsS3Service.upload(file);
    setPicture(awsFileUrl);
    axios({
      method: "PUT",
      url: apiUri + "/profile/picture?pictureUrl=" + awsFileUrl,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token"),
      },
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
      }
    });
  };
  
  return (
    <>
      {canShow ? (
        <FadeIn className="profile-body">
          <input
            className="pfp-upload"
            id="upload-pfp"
            type="file"
            accept="image/png, image/gif, image/jpeg, image/jpg"
            onChange={uploadImg}
          />
          <div className="info-box">
            {/* Current user's info */}
            <div
              className="logo"
              style={{
                backgroundImage:
                  !isHovering &&
                  (picture ? `url(${picture})` : `url(${defaultIcon})`),
              }}
              onClick={ChangeIcon}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              {isHovering && "Upload Image"}
            </div>

            <div className="username">username: {username}</div>
            <div className="email">email: {contact}</div>
            <div className="email">rating: {rating}</div>
          </div>
          <div className="listing">
             {/* Current user's posting */}
            <div className="posting-body">
              <h1>Postings</h1>
              <ul className="wishes-container">
                {items.map((item) => (
                  <li
                    className="wishitem-box"
                    key={item._id.$oid}
                    onClick={(event) =>
                      (window.location.href = "/item/" + item._id.$oid)
                    }
                  >
                    <span className="wish-name">{item.name} {item.sold ? <div className="sold-label">sold</div>:<div className="for-sell-label">For Sell</div>}</span>
                    <h2 className="wish-price">${item.price}</h2>
                    <p className="wish-desc">{item.discription}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* Current user's wishlist */}
            <div className="wishlist-body">
              <h1>Wishlist</h1>
              <ul className="wishes-container">
                {wishitems.map((wishes) => (
                  <li
                    className="wishitem-box"
                    key={wishes._id.$oid}
                    onClick={(event) =>
                      (window.location.href = "/item/" + wishes._id.$oid)
                    }
                  >
                    <span className="wish-name"> {wishes.name} {wishes.sold ? <div className="sold-label">sold</div>:<div className="for-sell-label">For Sell</div>}
                    {isAuthenticated && wishes.buyer !== null && wishes.buyer.$oid === userID ? <div className="you-bought-label">You Bought</div>:<></>}
                    </span>
                    <h2 className="wish-price">${wishes.price}</h2>
                    <p className="wish-desc">{wishes.discription}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      ) : (
        <></>
      )}
    </>
  );
}
export default MyProfile;