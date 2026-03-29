import React, { useState, useEffect } from "react";
import "./styles/items.css";
import FadeIn from "react-fade-in/lib/FadeIn";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { apiUri } from "../assets/constants";

function Display() {

  const isAuthenticated = sessionStorage.getItem("isAuth");
  const [userID, setUserID] = useState("")

  const [canShow, setCanShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCanShow(true), 200);
    return () => clearTimeout(timer);
  });

  const [items, setItems] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 5;

  // Search bar helper
  const [searchInput, setSearchInput] = useState("");
  let inputHandler = (e) => {
    var lowerCaseInput = e.target.value.toLowerCase();
    setSearchInput(lowerCaseInput);
  };

  async function getCurrentUserInfo() {
    if (sessionStorage.getItem("isAuth")) {
    // Send request with token to get current user detail from database
    axios({
      method: "GET",
      url: apiUri + "/profile",
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
      .then((response) => {
        const profile = response.data
        if (profile.access_token) {
          sessionStorage.setItem("access_token", profile.access_token)
        }
        setUserID(profile._id.$oid)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
        }
      })}
  }

  async function getProducts() {
     // Send request to get all posted items' detail from the database
    await axios({
      method: "GET",
      url: apiUri + "/searchAllItem",
    })
      .then((response) => {
        const products = response.data;
        setItems(products);
        setSearchItem(products);
        setCurrentItems(products.slice(0, itemsPerPage));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
        }
      });
  }

  // Get corresponding info when user enter this item listing page
  useEffect(() => {
    getProducts();
    getCurrentUserInfo();
  }, []);

  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Update page count and set corresponding items in the listing when search condition is applied
  useEffect(() => {
    if (searchInput !== "") {
      const searched = items.filter((item) => {
        return item.name.toLowerCase().includes(searchInput);
      });
      setSearchItem(searched);
    } else {
      setSearchItem(items);
    }
    setCurrentPage(0);
    setPageCount(Math.ceil(searchItem.length / itemsPerPage));
  }, [searchInput]);

  // Update items to be shown corresponding to current page number
  useEffect(() => {
    setPageCount(Math.ceil(searchItem.length / itemsPerPage));
    const lastItem = (currentPage + 1) * itemsPerPage;
    const itemsOffset = lastItem - itemsPerPage;
    setCurrentItems(searchItem.slice(itemsOffset, lastItem));
  }, [searchItem, currentPage]);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  return (
    <>
      {canShow ? (
        <FadeIn className="market-body">
          <div className="search">
            {/* Sell button redirect to post item page */}
            {isAuthenticated ? (
              <a href="/sell" className="sell">
                Sell
              </a>
            ) : (
              <></>
            )}
            {/* Search bar */}
            <input
              className="search-bar"
              type="text"
              placeholder="What are you looking for ? ..."
              onChange={inputHandler}
            />
          </div>
          {/* Item listing */}
          <div className="market-container">
            <h1>Recently posted</h1>
            <ul className="items-container">
              {currentItems.map((item) => (
                <li
                  key={item._id.$oid}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id.$oid)
                  }
                >
                  <div className="item-desc">
                    <span className="item-name">{item.name} 
                    {item.sold ? <div className="sold-label">sold</div>:<div className="for-sell-label">For Sell</div>}
                    {isAuthenticated && item.poster.$oid === userID ? <div className="your-post-label">Your Post</div>:<></>}
                    {isAuthenticated && item.buyer !== null && item.buyer.$oid === userID ? <div className="you-bought-label">You Bought</div>:<></>}
                    </span>
                    <p>Description: {item.discription}</p>
                  </div>
                  <div className="item-price-img">
                    <h2 className="item-price">Price: {item.price}</h2>
                    {item.picture !== "picture" && (
                      <img className="item-img" src={item.picture}></img>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {/* Pagination element */}
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
              forcePage={currentPage}
            />
          </div>
        </FadeIn>
      ) : (
        <></>
      )}
    </>
  );
}

export default Display;
