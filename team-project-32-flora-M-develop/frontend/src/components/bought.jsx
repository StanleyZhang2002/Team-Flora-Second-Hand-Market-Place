import React, { useState, useEffect } from "react";
import "./styles/bought.css"
import FadeIn from "react-fade-in/lib/FadeIn";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { apiUri } from "../assets/constants";

// Bought History page

function Bought() {

    const [items, setItems] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
    const userID = window.location.pathname.split("/").pop();

    const [canShow, setCanShow] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => setCanShow(true), 200)
        return () => clearTimeout(timer);
    })

    function getBoughtItem() {
      // Send request to get the items' ID of user's bought items from database
        axios({
          method: "GET",
          url: apiUri + "/searchUserByID?_id=" + userID,
        })
        .then((response) => {
            const profile = response.data
            setItems(profile.boughtlist)
        }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
            }
        })
    }

    useEffect(() => {
        getBoughtItem();
    }, []);

    async function getInfo() {
      // Send request to get the items detail from database
        await axios({
          method: "GET",
          url: apiUri + "/searchAllItem",
        })
          .then((response) => {
            const objects = response.data
            const list = []
            for (var i = 0; i < objects.length; i++) {
              if (items.some(element => { if (element.$oid === objects[i]._id.$oid) { return true } return false })) {
                list.push(objects[i])
              }
            }
            setBoughtItems(list)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
            }
          })
    }

    // When user bought new item, update the list of item in bought history page 
    useEffect(() => {
      if (items.length > 0) {
        getInfo();
      }
    }, [items]);

    return (
        <>
            {canShow ?
                <FadeIn>
                    <div id = "infoContainer">
                        <div id = "boughtTitle">All Bought items</div>
                        {/* Show bought history of user */}
                        <ul className="boughtItems-container">
                            {boughtItems.map((item) => (
                            <li key={item._id.$oid} onClick={event => window.location.href = '/item/' + item._id.$oid}>
                            <span className="boughtItem-name">Name: {item.name}</span>
                            <h2 className="boughtItem-price">Price: {item.price}</h2>
                            <p className="boughtItem-desc">Description: {item.discription}</p>
                            </li>
                            ))}
                        </ul>
                    </div>
                </FadeIn>
            : <></>}
        </>
    );
}

export default Bought;