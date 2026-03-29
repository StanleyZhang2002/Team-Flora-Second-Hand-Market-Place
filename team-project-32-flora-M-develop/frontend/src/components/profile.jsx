import React, { useState, useEffect } from "react";
import "./styles/profile.css";
import axios from "axios";
import FadeIn from "react-fade-in/lib/FadeIn";
import { apiUri } from "../assets/constants";
import { Form } from "react-bootstrap";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

function Profile() {
  const [username, setUsername] = useState("");
  const [posting, setPosting] = useState([]);
  const [items, setItems] = useState([]);
  const userID = window.location.pathname.split("/").pop();
  const [picture, setPicture] = useState("");
  const [rating, setRating] = useState(0)
  const [ratingClick, setRatingClick] = useState(false)
  const [inputRating, setInputRating] = useState(0)

  const [canShow, setCanShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCanShow(true), 200);
    return () => clearTimeout(timer);
  });

  async function getProfile() {
    // Send request with specific user ID to get target user's detail
    await axios({
      method: "GET",
      url: apiUri + "/searchUserByID?_id=" + userID,
    })
      .then((response) => {
        const profile = response.data;
        setUsername(profile.username);
        setRating(profile.rating.toFixed(2));
        setPosting(profile.posting);
        setPicture(profile.picture);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
        }
      });
  }

  // When user entered this user profile page, get corresponding info
  useEffect(() => {
    getProfile();
  }, []);

  async function getProducts() {
    // Send request to get an array of all items in database, then filter it to only get target user's posting
    await axios({
      method: "GET",
      url: apiUri + "/searchAllItem",
    })
      .then((response) => {
        const products = response.data;
        const list = [];
        for (var i = 0; i < products.length; i++) {
          if (
            posting.some((element) => {
              if (element.$oid === products[i]._id.$oid) {
                return true;
              }
              return false;
            })
          ) {
            list.push(products[i]);
          }
        }
        setItems(list);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
        }
      });
  }

  const inputRatingHandler = (e) => {
    const rating = e.target.value;
    setInputRating(rating);
};

  function onRatingClick(event) {
    if (ratingClick) {
      setRatingClick(false)
    } else {
      setRatingClick(true)
    }
  }

  async function rateUser(event){
    // Send request to add rating to this user

    event.preventDefault();

    const form = new FormData();
    form.append('username', username)
    form.append('rating', inputRating)

    await axios({
      method: "POST",
      url: apiUri + "/rateUser",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      },
      data: form
    })
      .then((response) => {
        alert("You have rated this user successfully!")
        window.location.reload()
      })
      .catch((error) => {
        if (error.response) {
          alert("Cannot rate this user. Try again.")
          window.location.reload()
        }
      });
  }

  // Update target user's postings
  useEffect(() => {
    if (posting.length > 0) {
      getProducts();
    }
  }, [posting]);

  return (
    <>
      {canShow ? (
        <FadeIn className="profile-body">
          <div id="info-container">
            {/* User's info */}
            {picture ? (
              <img id="logo" src={picture} />
            ) : (
              <img id="logo" src={require("./images/default.jpeg")} />
            )}
            <div id="username">{username}</div>
            <div id="rating">Rating : {rating}</div>
            {sessionStorage.getItem("isAuth") ? <> {ratingClick ? 
              <div className="rating-form-on">
              Rate this user:  
              <form onSubmit={rateUser} id="rate-form">
                <input required type="number" max="10" min="1" id="input-rating"onChange={inputRatingHandler} placeholder="Rate this user from 1 to 10"></input>
                <button id="rate-this-user" type="submit">Submit</button>
                <button id="rate-this-user" onClick={onRatingClick}>close</button>
              </form>
              </div> :
              <button id="rate-this-user" onClick={onRatingClick} >
                Rate this user
              </button>}</> : <></>
            }
           
          </div>
        
          <></>
          <div id="post-wish">
            <div id="post-container">
              {/* Posting list */}
              <h1>All Posts</h1>
              <ul className="posts-container">
                {items.map((item) => (
                  <li
                    className="post-box"
                    key={item._id.$oid}
                    onClick={(event) =>
                      (window.location.href = "/item/" + item._id.$oid)
                    }
                  >
                    <span className="post-name">{item.name} {item.sold ? <div className="sold-label">sold</div>:<div className="for-sell-label">For Sell</div>}
                    </span>
                    <h2 className="post-price"> ${item.price}</h2>
                    <span className="post-desc">{item.discription}</span>
                    
                   
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
export default Profile;
