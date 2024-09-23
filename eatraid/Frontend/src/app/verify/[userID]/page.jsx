"use client";
import styles from "./verify.module.css";
import React, { useState, useEffect, useRef } from "react";
import Topbar from "../../../components/Topbar";
import Link from "next/link";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";

export default function Verify() {
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const fetchEmail = () => {
      const fetchedEmail = "conta@email.com";
      setEmail(fetchedEmail);
    };
    fetchEmail();
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleResend = () => {
    if (selectedOption) {
    }
  };

  const handleCancel = () => {
    if (selectedOption) {
    }
  };

  const handleVerify = () => {
    if (selectedOption) {
    }
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bg}>
        <div className={styles.bigContainer}>
          <div className={styles.topContainer}>
            {/* กำหนดหน้า owner กับ user ไงอ้ะ */}
            <Link href="/signup">
              <FaArrowLeft className={styles.iconArrowStyle} />
            </Link>
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
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.verifyButton} onClick={handleVerify}>
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
