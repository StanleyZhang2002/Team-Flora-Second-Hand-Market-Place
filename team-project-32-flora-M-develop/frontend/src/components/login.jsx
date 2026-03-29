import React, { useState } from "react"
import "./styles/login.css"
import FadeIn from 'react-fade-in'
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { apiUri } from "../assets/constants";


function Login() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const isEmail = (email) => /^[^\s@]+@mail\.utoronto\.ca$/.test(email);

    const loginUsernameHandler = (e) => {
        const username = e.target.value;
        setLoginUsername(username);
    };

    const loginPasswordHandler = (e) => {
        const password = e.target.value;
        setLoginPassword(password);
    };

    const registerNameHandler = (e) => {
        const name = e.target.value;
        setRegisterName(name);
    }

    const registerEmailHandler = (e) => {
        const email = e.target.value;
            setRegisterEmail(email);
    }

    const registerPasswordHandler = (e) => {
        const password = e.target.value;
        setRegisterPassword(password);
    }

    async function loginHandler(event) {
        // Send request login the user with submitted info
        event.preventDefault();

        const form = new FormData();
        form.append('username', loginUsername)
        form.append('pwd', loginPassword)

        await axios({
            method: "POST",
            url: apiUri + "/login",
            headers: { "Content-Type": "multipart/form-data" },
            data: form
        })
            .then((response) => {
                const user = response.data
                sessionStorage.setItem("isAuth", true)
                sessionStorage.setItem("access_token", user.access_token)
                setLoginUsername("");
                setLoginPassword("");
                window.location = '/market';

            }).catch((error) => {
                if (error.response) {
                    alert(error.response.data)
                }
            })
    }

    function registerHandler(event) {
        // Send request to add new user according to submitted info
        event.preventDefault();
        if (!isEmail(registerEmail)){
            console.log(registerEmail)
            alert("Please use a UofT official email for registration.")
        } else {
        axios({
            method: "POST",
            url: apiUri + "/register",
            headers: { "Content-Type": "multipart/form-data" },
            data: {
                username: registerName,
                contact: registerEmail,
                password: registerPassword
            }
        })
            .then((response) => {
                const user = response.data
                sessionStorage.setItem("isAuth", true)
                sessionStorage.setItem("access_token", user.access_token)
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                window.location = '/myProfile';
            }).catch((error) => {
                if (error.response) {
                    alert(error.response.data)
                }
            })}
    }

    return (

        <FadeIn>
            <main>
                <div class="container" id="container">
                     {/* Register form */}
                    <div class="form-container sign-up-container">
                        <form onSubmit={registerHandler}>
                            <h1>Create Account</h1>
                            <input type="text" placeholder="Username" onChange={registerNameHandler} required />
                            <input type="email" placeholder="Email" onChange={registerEmailHandler} required />
                            <input type="password" placeholder="Password" minlength="6" onChange={registerPasswordHandler} required />
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                    <div className="middle"></div>
                    {/* Login form */}
                    <div class="form-container sign-in-container">
                        <form onSubmit={loginHandler}>
                            <h1>Sign in</h1>
                            <input type="text" placeholder="Username" value={loginUsername} onChange={loginUsernameHandler} required />
                            <input type="password" placeholder="Password" minlength="6" value={loginPassword} onChange={loginPasswordHandler} required />
                            <button type="submit">Sign In</button>
                        </form>
                    </div>
                </div>
            </main>
        </FadeIn>
    );
}
export default Login;