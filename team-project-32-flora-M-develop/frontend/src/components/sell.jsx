import React, { useState } from "react";
import './styles/sell.css'
import axios from "axios";
import { apiUri } from "../assets/constants";
import awsS3Service from "../services/awsS3Service";

function Sell() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")

  const nameHandler = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const priceHandler = (e) => {
    const price = e.target.value;
    setPrice(price);
  };

  const descriptionHandler = async (e) => {
    const description = e.target.value;
    setDescription(description);
  };

  const uploadImg = async (e) => {
    // if an img already uploaded, remove it from bucket first
    if (picture) {
      await awsS3Service.remove(picture)
    }
    const file = e.target.files[0];
    const awsFileUrl = await awsS3Service.upload(file)
    setPicture(awsFileUrl)
  }

  async function SellHandler(event) {
    // Send request to add the item into listing in database, then redirect user to corresponding item page
    event.preventDefault();
    const data = {
      "name": name,
      "price": price,
      "discription": description,
      "picture": picture
    }
    await axios({
      method: "POST",
      url: apiUri + "/createItem",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
      },
      data: JSON.stringify(data)
    })
      .then((response) => {
        window.location = '/item/' + response.data.itemID.$oid
      }).catch((error) => {
        if (error.response) {
          alert(error.response.data)
        }
      })
  }

  return (
    <>
      <div className="sell-form-row">
        <form onSubmit={SellHandler}>
          <h1>Create Item Post</h1>
          <input type="text" placeholder="Item name" value={name} onChange={nameHandler} required />
          <input type="text" placeholder="Item price" value={price} onChange={priceHandler} required />
          <input className="sell-form-desc" type="text" placeholder="Item description" value={description} onChange={descriptionHandler} />
          <p style={{ marginBottom: "-2px" }}>Upload an Image</p>
          <input type="file" accept="image/png, image/gif, image/jpeg, image/jpg" onChange={uploadImg} />
          <button type="submit">Sell</button>
        </form>
        {picture && <img className="sell-form-img" src={picture}></img>}
      </div>
    </>
  );
}
export default Sell;
