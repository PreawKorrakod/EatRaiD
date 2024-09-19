"use client";
import React, { useState } from "react";
import "./signupRestaurantDetail.css";
import { BsChevronDown, BsThreeDots } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { SlPicture } from "react-icons/sl";

const categoryDropdown = ["Thai", "Japanese"];

function signupRestaurantDetail() {
  const [selectedOption, setSelectedOption] = useState(categoryDropdown[0]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmClick = () => {
    console.log("Confirm button clicked");
  };

  return (
    <div className="main-bg">
      <div className="big-container">
        <h1 className="title">Sign Up - Restaurant</h1>
        <div className="input-container">
          <div className="textfield-big-container-l">
            <div className="textfield-sub-container">
              <h2 className="normal-text">Name</h2>
              <input name="Name" className="textfield-style" />
            </div>
            <div className="textfield-sub-container">
              <h2 className="normal-text">Category</h2>

              <select
                className="dd-textfield-style"
                value={selectedOption}
                onChange={handleChange}
              >
                {categoryDropdown.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <BsChevronDown className="dropdown-icon" />
            </div>
            <div className="textfield-sub-container">
              <h2 className="normal-text">Business day</h2>
              <input name="Name" className="textfield-style" />
            </div>
            <div className="textfield-sub-container">
              <h2 className="normal-text">Open time</h2>
              <input name="Name" className="textfield-style-mini" />
              <h2 className="normal-text">Close time</h2>
              <input name="Name" className="textfield-style-mini" />
            </div>
            <div className="pic-big-container">
              <h2 className="normal-text">Picture</h2>
              <input 
                name="Picture" 
                className="picture-container"
                type="file"
                accept="image/*"
              />
                {/* <SlPicture className="custom-file-icon" />  */}
              
             
            </div>
          </div>

          <div className="textfield-big-container-r">
            <div className="textfield-sub-container">
              <h2 className="normal-text">Location</h2>
            </div>
            <input name="Name" className="location-textfield" />
            <div className="map-container"></div>

            <h2 className="normal-text">Contact</h2>
            <div className="textfield-sub-container-r">
              <IoCall className="icon-style"/>
              <input name="Name" className="textfield-style" />
              <FaLine className="icon-style"/>
              <input name="Line" className="textfield-style" />
            </div>

          </div>
        </div>
        <button 
          className="confirm-button"
          onClick={handleConfirmClick}
        >
          Confirm
        </button>
        
      </div>
    </div>
  );
}

export default signupRestaurantDetail;
