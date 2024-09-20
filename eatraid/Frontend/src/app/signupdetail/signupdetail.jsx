"use client";
import React, { useState } from "react";
import styles from "./signupRestaurantDetail.module.css";
import { BsChevronDown, BsThreeDots } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { SlPicture } from "react-icons/sl";
import Topbar from "../../../components/Topbar";

const categoryDropdown = ["Thai", "Japanese"];

export default function signupdetail() {
  const [selectedOption, setSelectedOption] = useState(categoryDropdown[0]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmClick = () => {
    console.log("Confirm button clicked");
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bigContainer}>
        <h1 className={styles.title}>Sign Up - Restaurant</h1>
        <div className={styles.inputContainer}>
          <div className={styles.textfieldBigContainerL}>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Name</h2>
              <input name="Name" className={styles.textfieldStyle} />
            </div>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Category</h2>
              <select
                className={styles.ddTextfieldStyle}
                value={selectedOption}
                onChange={handleChange}
              >
                {categoryDropdown.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <BsChevronDown className={styles.dropdownIcon} />
            </div>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Business day</h2>
              <input name="Name" className={styles.textfieldStyle} />
            </div>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Open time</h2>
              <input name="Name" className={styles.textfieldStyleMini} />
              <h2 className={styles.normalText}>Close time</h2>
              <input name="Name" className={styles.textfieldStyleMini} />
            </div>
            <div className={styles.picBigContainer}>
              <h2 className={styles.normalText}>Picture</h2>
              <input
                name="Picture"
                className={styles.pictureContainer}
                type="file"
                accept="image/*"
              />
            </div>
          </div>

          <div className={styles.textfieldBigContainerR}>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Location</h2>
            </div>
            <input name="Name" className={styles.locationTextfield} />
            <div className={styles.mapContainer}></div>

            <h2 className={styles.normalText}>Contact</h2>
            <div className={styles.textfieldSubContainerR}>
              <IoCall className={styles.iconStyle} />
              <input name="Name" className={styles.textfieldStyle} />
              <FaLine className={styles.iconStyle} />
              <input name="Line" className={styles.textfieldStyle} />
            </div>
          </div>
        </div>
        <button
          className={styles.confirmButton}
          onClick={handleConfirmClick}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
