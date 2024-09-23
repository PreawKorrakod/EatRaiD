"use client";
import styles from "./verify.module.css";
import React, { useState, useRef } from "react";
import Topbar from "../../../components/Topbar";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function Verify() {
  // const { email: initialEmail,role,userID } = params; // Destructure role from params
  // const [email, setEmail] = useState(initialEmail || "");
  const inputRefs = useRef([]);
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState(""); 

  const { userID } = router.query; // ดึง userID จาก URL params
  const { email, role } = router.query; // ดึง email และ role จาก state/query

  useEffect(() => {
    if (!email || !role || !userID) {
      setError("Missing required information. Please sign up again.");
    }
  }, [email, role, userID]);
  
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

      // Navigate based on role
      if (role === "customer") {
        router.push("/"); // Redirect to home page
      } else if (role === "owner") {
        router.push("/signupdetail"); 
      }

      setError(""); 
    }
  };

  const handleResend = () => {
    // Implement resend logic here
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
          <MdMarkEmailUnread className={styles.iconStyle} />
          <h1 className={styles.title}>Please check your email</h1>
          <h2 className={styles.normalText}>
            We've sent a code to{" "}
            <span className={styles.emailText}>{email}</span>
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
      </div>
    </div>
  );
}
