import React, {useEffect} from "react";
import './App.css';
import axios from "axios";
import { apiUri } from "./assets/constants";
import Login from './components/login';
import Profile from './components/profile';
import Contact from './components/contact';
import Item from './components/item'
import Display from "./components/items";
import Navbar from './components/navbar';
import Sell from "./components/sell";
import Bought from "./components/bought"
import MyProfile from "./components/myProfile";

import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';

function App() {

  async function check_token() {
    await axios({
      method: "GET",
      url: apiUri + "/checkToken",
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    })
    .then((response) => {
      if (response.access_token) {
        sessionStorage.setItem("access_token", response.access_token);
      }
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

  useEffect(() => {
    if (sessionStorage.getItem("isAuth")) {
      if (sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == 'undefined') {
        alert("Login session is over. Please login again.")
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("isAuth");
        window.location = '/login'
      } else {
        check_token();
      }
    }
  }, []);

  return (
    <>
      <Router >
          <Navbar forceRefresh={true}/>
          <Routes>
            <Route exact path="/" element={<Display/>} loading/> 
            <Route path="/market" element={<Display/>} loading/>
            <Route path="/bought/:id" element={<Bought/>} loading/>
            <Route path="/login"  element={<Login/>} loading/>
            <Route path="/profile/:id" forceRefresh={true} element={<Profile/>} loading/>
            <Route path="/myProfile" forceRefresh={true} element={<MyProfile/>} loading/>
            <Route path="/contact" element={<Contact/>} loading/>
            <Route path="/item/:id" element={<Item/>} loading/>
            <Route path="/sell" element={<Sell/>}loading/>
          </Routes>
      </Router>
      
    </>
  );
}

export default App;
