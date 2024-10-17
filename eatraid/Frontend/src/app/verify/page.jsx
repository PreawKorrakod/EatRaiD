"use client";
import styles from "./verify.module.css";
import React, { useState, useRef, useEffect } from "react";
import Topbar from "../../../components/Topbar";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Image from "next/image";

import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from "../../../src/app/config/supabaseClient.js";

export default function Verify() {
  const [userID, setUserID] = useState(null);
  const inputRefs = useRef([]);
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const storedUserID = sessionStorage.getItem("userID");
    if (storedUserID) {
      const parsedUserID = JSON.parse(storedUserID);
      setUserID(parsedUserID); // Store in state
      console.log("Data:", parsedUserID, parsedUserID.file);
    } else {
      sessionStorage.removeItem("userID");
      // router.push("/"); // Redirect to home if no user ID
    }
  }, [router]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      setError("");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    if (otp.some((digit) => digit === "")) {
      setError("Please enter all 6 digits of the OTP before verifying.");
    } else {
      // Implement verification logic here
      console.log("Verifying OTP:", otp.join(""));

      if (
          userID.OpenTimeHr === '00' &&
          userID.CloseTimeHr === '00' &&
          userID.OpenTimeMin === '00' &&
          userID.CloseTimeMin === '00'
      ) {
          userID.OpenTimeHr = '-';
          userID.CloseTimeHr = '-';
          userID.OpenTimeMin = '-';
          userID.CloseTimeMin = '-';
      }

      try {
        axios.post(`${NEXT_PUBLIC_BASE_API_URL}/verify-OTP`, {
          email: userID.email,
          OTP: otp.join(""),
          role: userID.role,
          profilePic: userID.file,
          user: userID.id,
          Name: userID.Name || "-", 
          OpenTimeHr: userID.OpenTimeHr,
          CloseTimeHr: userID.CloseTimeHr, 
          OpenTimeMin: userID.OpenTimeMin, 
          CloseTimeMin: userID.CloseTimeMin,
          Location: userID.Location || "-", 
          Latitude: userID.Latitude, 
          Longitude: userID.Longitude,
          BusinessDay: userID.BusinessDay, 
          Tel: userID.Tel || "-", 
          Line: userID.Line || "-"

        }).then(async res => {
          console.log("Navigate based on role", res)
          // Navigate based on role

          if (userID.role === "customer") {
            router.push("/login"); // Redirect to home page
          } else if (userID.role === "owner") {
            sessionStorage.removeItem('userID');
            router.push("/login");
          }
        }).catch(error => {
          console.error('Error during verify OTP:', error);
            setError("Wrong OTP. Try again.");
        });
      } catch (error) {
        console.log(error);
      }

      setError("");
    }
  };

  const handleResend = () => {
    try {
      axios
        .post(`${NEXT_PUBLIC_BASE_API_URL}/resend-OTP`, {
          email: userID.email,
        })
        .then(async (res) => {
          console.log("resend OTP successfully");
        })
        .catch((error) => {
          console.error("Error during resend OTP:", error);
          setError("Can't resend OTP. Try again.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bg}>
        <div className={styles.bigContainer}>
          <div className={styles.topContainer}>
            <button
              onClick={() => router.back()}
              className={styles.iconArrowStyle}
            >
              <FaArrowLeft />
            </button>
          </div>
          <div className={styles.iconCon}>
            <MdMarkEmailUnread className={styles.iconStyle} />
          </div>
          <h1 className={styles.title}>Please check your email</h1>
          <h2 className={styles.normalText}>
            We've sent a code to{" "}
            <span className={styles.emailText}>
              {userID ? userID.email : "loading..."}
            </span>
          </h2>
          <div className={styles.otpBox}>
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className={styles.otpNumber}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                required
              />
            ))}
          </div>
          <div className={styles.rowContainer}>
            <p className={styles.normalText}>Didn't get the code?</p>
            <button className={styles.resendButton} onClick={handleResend}>
              Click to resend.
            </button>
          </div>
          <div className={styles.rowContainer2}>
            <button
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button className={styles.verifyButton} onClick={handleVerify}>
              Verify
            </button>
          </div>
        </div>
        {error && (
          <div className={styles.ErrorChecking}>
            <BsExclamationCircle className={styles.Alerticon} />
            {error}
          </div>
        )}
        {/* {profileImage && <Image src={profileImage} alt="Profile" width={900} height={900}/>} */}
      </div>
    </div>
  );
}
