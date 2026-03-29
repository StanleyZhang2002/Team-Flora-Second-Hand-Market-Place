import React, { useState, useEffect } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import axios from "axios";
import './styles/item.css';
import FadeIn from "react-fade-in/lib/FadeIn";
import { apiUri } from "../assets/constants";
import awsS3Service from "../services/awsS3Service";

// Item page

function Item() {

  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [itemDiscription, setItemDiscription] = useState("")

  const [posterID, setPosterID] = useState("")
  const [posterName, setPosterName] = useState("")
  const [posterIcon, setPosterIcon] = useState(null)
  const [posterRating, setPosterRating] = useState("")

  const [userID, setUserID] = useState("")

  const itemID = window.location.pathname.split("/").pop()

  const [sold, setSold] = useState(false)
  const [buyerID, setBuyerID] = useState("")
  const [buyerName, setBuyerName] = useState("")
  const [itemPicture, setItemPicture] = useState(null)
  const [inWish, setInWish] = useState(false)

  const [canShow, setCanShow] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setCanShow(true), 200)
    return () => clearTimeout(timer);
  })

  const isAuthenticated = sessionStorage.getItem("isAuth");

  async function getProduct() {
    // Send request with item ID to get item detail from database
    await axios({
      method: "GET",
      url: apiUri + "/searchById?_id=" + itemID,

    })
      .then((response) => {
        const product = response.data
        setItemPicture(product.picture)
        setItemName(product.name)
        setItemPrice(product.price)
        setItemDiscription(product.discription)
        setPosterID(product.poster.$oid)
        setBuyerID(product.buyer.$oid)
        setSold(product.sold)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  async function getCurrentUserInfo() {
    // Send request with token to get current user detail from database
    await axios({
      method: "GET",
      url: apiUri + "/profile",
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
      .then((response) => {
        const profile = response.data
        setUserID(profile._id.$oid)
        for (const wished in profile.wishlist) {
          if (profile.wishlist[wished].$oid === itemID) {
            setInWish(true)
          }
        }
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  async function getPosterInfo() {
    // Send request with the item poster's ID to get poster detail from database
    await axios({
      method: "GET",
      url: apiUri + "/searchUserByID?_id=" + posterID,
    })
      .then((response) => {
        const profile = response.data
        setPosterName(profile.username)
        setPosterIcon(profile.picture)
        setPosterRating(profile.rating)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  async function getBuyerInfo() {
    // Send request with the item buyer's ID to get poster detail from database
    await axios({
      method: "GET",
      url: apiUri + "/searchUserByID?_id=" + buyerID,
    })
      .then((response) => {
        const profile = response.data
        setBuyerName(profile.username)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  useEffect(() => {
    getProduct();
    getCurrentUserInfo()
  }, []);

  // Get corresponding info about the item when user enter this item's page
  useEffect(() => {
    if (posterID) {
      getPosterInfo();
    } 
  }, [posterID]);

  useEffect(() => {
    if (buyerID) {
      getBuyerInfo();
    }
  }, [buyerID]);

  async function buyProduct(event) {
    // Send request with the item ID and current user's token for user to buy this item
    event.preventDefault();
    const buyerID = userID
    const data = {
      itemID: itemID,
      buyerID: buyerID
    }
    await axios({
      method: "POST",
      url: apiUri + "/buyItem",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
      },
      data: JSON.stringify(data)
    })
      .then((response) => {
        alert("Bought item successfully!")
        window.location.reload()
      }).catch((error) => {
        if (error.response) {
          alert(error.response.data)
        }
      })
  }

  async function likeProduct() {
    // Send request with the item ID and current user's token for user to add this item to wishlist
    await axios({
      method: "POST",
      url: apiUri + "/likeItem?itemID=" + itemID + "&userID=" + userID,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
      .then((response) => {
        window.location.reload()
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  async function unlikeProduct() {
    // Send request with the item ID and current user's token for user to remove this item from wishlist
    await axios({
      method: "DELETE",
      url: apiUri + "/likeItem?itemID=" + itemID + "&userID=" + userID,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
      .then((response) => {
        window.location.reload()
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  async function deleteProduct() {
    // delete product picture first
    await awsS3Service.remove(itemPicture)
    // Then send request with the item ID and current user's token for user to remove this item from their posting
    await axios({
      method: "DELETE",
      url: apiUri + "/createItem?itemID=" + itemID + "&userID=" + userID,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
      .then((response) => {
        alert("You removed item " + itemName + " successfully.")
        window.location = '/market'
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })
  }

  function goProfile(){
    // locate profile page for user
    if (posterID === userID) {
      window.location = "/myProfile";
    } else {
    window.location = '/profile/'+posterID;
    }
  }

  return (

    <>
      {canShow ?
        <FadeIn>
          {/* Item's detail*/}
          <div className="item-body">
            <div className="item">
              <div className="name">{itemName}</div>
              {itemPicture && itemPicture !== "picture" && <img className="item-large-img" src={itemPicture} />}
              <div className="price"><p1>Price : </p1><span className="dollar-sign">$</span>{itemPrice}</div>
              <div className="discription">{itemDiscription}</div>
              {/* Check item status to decide what button / message should be shown to user */}
              {sold ? <div className="sold-text"> {buyerID === userID ? <span>You bought this item ! Please wait for the poster to contact you.<br></br></span> : <span>This item is sold. {isAuthenticated ? <></> : <>To see more?<a href="/login"> Log in</a></>} </span>}</div> :
                <>{isAuthenticated ?
                  <>{posterID === userID ? <button className="buy" onClick={deleteProduct}> Delete </button> : <div><button className="buy" onClick={buyProduct}> Buy </button> {inWish ? <button className="in-wishlist" onClick={unlikeProduct}> Remove from Wishlist </button> : <button className="wishlist" onClick={likeProduct}> Add to Wishlist </button>} </div>} </> :
                  <span className="notAuth"> Interested in this item? Log in to buy it! <a href="/login"> Log in</a></span>}
                </>}
              {sold && posterID === userID  ? <div className="sold-text-seller" onClick={event => window.location.href = '/profile/' + buyerID}>This item is bought by {buyerName}. <br/>  Check your email for contact details. <br></br> </div> : <></>}
            </div>
            {/* Poster's detail */}
            <div className="user">
                <div className="poster">Posted by:</div>
                {posterIcon ? (
                <img id="logo" src={posterIcon} />
                ) : (
                <img id="logo" src={require("./images/default.jpeg")} />
                )}
                <div className="postername"> {posterName} </div>
                <div className="poster-rating"> Rating : {posterRating} </div>
                <div className="to-profile" onClick={goProfile}>
                {posterID === userID ? <>Go to your profile</> : <>Check profile !</>} <BsFillArrowRightCircleFill /></div>
            </div>
          </div>
        </FadeIn>
        : <></>
      }
    </>
  );
}

export default Item;

