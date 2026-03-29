import React, {useState} from "react";
import "./styles/searchbar.css";


function Searchbar() {
    const [input, setInput] = useState("")

    let inputHandler = (e) => {
        var lowerCaseInput = e.target.value.toLowerCase();
        setInput(lowerCaseInput);
    }

    return (
        <>
        <div className="search">
           <input
                className="search-bar"
                type="text"
                placeholder="What are you looking for ? ..."
                onChange={inputHandler}
            />
        </div>
        </>
    );
}
export default Searchbar;
