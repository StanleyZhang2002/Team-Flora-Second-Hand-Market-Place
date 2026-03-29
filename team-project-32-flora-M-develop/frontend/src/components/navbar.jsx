import React, { useState } from "react";
import "./styles/navbar.css";
import { IoKey, IoChatbubbleEllipses, IoBagCheckSharp, IoHelpCircle, IoCloseSharp, IoPerson} from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { Link } from 'react-router-dom';
import axios from "axios";
import { apiUri } from "../assets/constants";
import { BsWindowSidebar } from "react-icons/bs";

function Navbar() {

    const [click, setClick] = useState(false);

    const onClick = () => setClick(true);

    const offClick = () => setClick(false);

    const [isAuthenticated, setAuthenticated] = useState(() => {
        return sessionStorage.getItem("isAuth");
    });

    function toProfile() {
        offClick()
        window.location = "/myProfile"
    }

    function toBought() {
        offClick()
        getCurrentUserBought()
    }

    async function getCurrentUserBought() {
        axios({
          method: "GET",
          url: apiUri + "/profile",
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
          }
        })
          .then((response) => {
            if (response.access_token) {
              sessionStorage.setItem("access_token", response.access_token);
            }
            const profile = response.data
            window.location = "/bought/" + profile._id.$oid
          }).catch((error) => {
            if (error.response) {
              if (error.response.status == 401) {
                alert("Login session is over. Please login again.")
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("isAuth");
                window.location = '/login'
              }
            }
          })
      }


    function logOut() {
        axios({
          method: "GET",
          url: apiUri + "/logout",
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
          }
        })
        .then((response) => {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("isAuth");
          offClick()
          window.location = '/login'
        }).catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              alert("The login session is already over. Please login again.")
              sessionStorage.removeItem("access_token");
              sessionStorage.removeItem("isAuth");
              window.location = '/login'
            }
            }
        })
    }

    return (
        <>
            <nav id="navbar">
                <div className="left">
                    <a href="/market" className="header" onClick={offClick}>UofT Second hand Marketplace</a>
                </div>
                <div className="right">
                    <button onClick={click ? offClick : onClick}> {click ? <IoCloseSharp className="navbar-menu-icon" /> : <HiMenu className="navbar-menu-icon" />}</button>
                </div>
            </nav>

            <ul className={click ? 'nav-menu-active' : 'nav-menu'}>
                <li><a onClick={offClick} href="/market">Marketplace</a></li>
                {/* <li><a onClick={offClick} href="/message"><IoChatbubbleEllipses/> Message</a></li> */}
                {isAuthenticated ? <li><a onClick={toBought} href="#" ><IoBagCheckSharp />Bought item</a></li> : <></>}
                {isAuthenticated ? <li><a onClick={toProfile} href="#" ><IoPerson />Profile</a></li> : <></>}
                {isAuthenticated ? <li><a onClick={logOut} href="/"><IoKey /> Logout</a></li> : <li><a onClick={offClick} href="/login" ><IoKey />Log In / Register</a></li>}
                <li><a onClick={offClick} href="/contact"><IoHelpCircle />Contact Us</a></li>
            </ul>

        </>
    );
}

export default Navbar;