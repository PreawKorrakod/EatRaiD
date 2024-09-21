"use client";
import styles from "./signUpRole.module.css";
import React, { useState } from "react";
import Topbar from "../../../components/Topbar";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { BsShop } from "react-icons/bs";

function SignUpRole() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option); // Update the selected option
  };

  const handleConfirm = () => {
    if (selectedOption) {
      alert(`You have selected: ${selectedOption}`);
      // Trigger further actions, such as submitting the selection
    }
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bigContainer}>
        <h1 className={styles.title}>Sign Up</h1>
        <div className={styles.subContainer}>
          {/* <button className={styles.roleButton}>
            <AiOutlineUser className={styles.iconStyle} />
            User
          </button>
          <button className={styles.roleButton}>
            <BsShop className={styles.iconStyle} />
            Restaurant
          </button> */}
            <button
            className={`${styles.roleButton} ${
              selectedOption === "User" ? styles.activeButton : ""
            }`}
            onClick={() => handleSelection("User")}
          >
            <AiOutlineUser
              className={`${styles.iconStyle} ${
                selectedOption === "User" ? styles.activeIcon : ""
              }`}
            />
            User
          </button>
          <button
            className={`${styles.roleButton} ${
              selectedOption === "Restaurant" ? styles.activeButton : ""
            }`}
            onClick={() => handleSelection("Restaurant")}
          >
            <BsShop
              className={`${styles.iconStyle} ${
                selectedOption === "Restaurant" ? styles.activeIcon : ""
              }`}
            />
            Restaurant
          </button>
        </div>
        <button 
          className={styles.confirmButton}
          onClick={handleConfirm}
        >Confirm</button>
        <div className={styles.bottomContainer}>
          <h2 className={styles.normalText}>Already have an account?</h2>
          <Link href="/login" className={styles.LoginButton}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpRole;
