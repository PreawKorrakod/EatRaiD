"use client";
import React, { useState, useEffect } from "react";
import styles from "./signupdetail.module.css";
import { BsChevronDown } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Topbar from "../../../components/Topbar";
import { useRouter } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from "../../../src/app/config/supabaseClient.js";

const businessDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SignupDetail() {
  const [userID, setuserID] = useState(null);

  useEffect(() => {
    const storeduserID = sessionStorage.getItem("userID");
    if (storeduserID) {
      setuserID(JSON.parse(storeduserID));
      console.log(JSON.parse(storeduserID));
    } else {
      router.push("/");  // Redirect to home if no user ID
    }
  }, []);

  // if (!userID) return router.push("/");  // กลับหน้า Home

  const router = useRouter();
  const [openTimeHR, setOpenTimeHR] = useState("00");
  const [openTimeMIN, setOpenTimeMIN] = useState("00");
  const [closeTimeHR, setCloseTimeHR] = useState("00");
  const [closeTimeMIN, setCloseTimeMIN] = useState("00");
  const [selectedBusinessDays, setSelectedBusinessDays] = useState(
    new Array(businessDays.length).fill(true)
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [Imagefile, setImagefile] = useState("");

  const [NameOwner, setNameOwner] = useState(""); //เก็บชื่อที่ตัวแปร NameOwner
  const [numberPhone, setNumberPhone] = useState(""); //เก็บเบอร์ที่ตัวแปร numberPhone
  const [LineContact, setLineContact] = useState(""); // เก็บไลน์ที่ตัวแปร numberPhone

  const handleChangeOpenTimeHR = (event) => {
    setOpenTimeHR(event.target.value);
  };

  const handleChangeOpenTimeMIN = (event) => {
    setOpenTimeMIN(event.target.value);
  };

  const handleChangeCloseTimeHR = (event) => {
    const newCloseTimeHR = event.target.value;
    if (parseInt(newCloseTimeHR) < parseInt(openTimeHR)) {
      setOpenTimeHR(newCloseTimeHR);
    }
    setCloseTimeHR(newCloseTimeHR);
  };

  const handleChangeCloseTimeMIN = (event) => {
    setCloseTimeMIN(event.target.value);
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const validateInputs = () => {
    const phonePattern = /^\d{10}$/;
    if (numberPhone && !phonePattern.test(numberPhone)) {
      return "Phone number must be a 10-digit number.";
    }

    if (
      !location ||
      !profileImage ||
      !NameOwner ||
      !(numberPhone || LineContact)
    ) {
      return "Please fill in all required fields.";
    }

    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImagefile(file);
    }
  };

  const handleConfirmClick = () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    // console.log("Confirm button clicked");
    // console.log("Selected business days:", selectedBusinessDays);
    // console.log("Location:", location);
    // console.log('image',Imagefile)
    const displayOpenTime = `${openTimeHR}:${openTimeMIN}`;
    const displayCloseTime = `${closeTimeHR}:${closeTimeMIN}`;

    const id = userID.id;
    const role = "owner";
    const email = userID.email;
    const file = profileImage;
    const Name = NameOwner || "-";
    const OpenTime = displayOpenTime === "00:00" ? "-" : displayOpenTime;
    const CloseTime = displayCloseTime === "00:00" ? "-" : displayCloseTime;
    const Location = location || "-";
    const Latitude = 0;
    const Longitude = 0;
    const BusinessDay = selectedBusinessDays.join(",");
    const Tel = numberPhone || "-";
    const Line = LineContact || "-";
    sessionStorage.removeItem("userID");
    const newUserID = {
      email,
      role,
      id,
      file,
      Name,
      OpenTime,
      CloseTime,
      Location,
      Latitude,
      Longitude,
      BusinessDay,
      Tel,
      Line,
    };
    console.log("signup successful navigate to verify", newUserID);
    sessionStorage.setItem("userID", JSON.stringify(newUserID));
    router.push("/verify");
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bigContainer}>
        <div className={styles.topContainer}>
          <button
            onClick={() => router.back()}
            className={styles.iconArrowStyle}
          >
            <FaArrowLeft />
          </button>
        </div>
        <h1 className={styles.title}>Sign Up - Restaurant</h1>
        <div className={styles.inputContainer}>
          <div className={styles.textfieldBigContainerL}>
            <div className={styles.rowContainer}>
              <div className={styles.picBigContainer}>
                <label className={styles.pictureContainer}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  {!profileImage ? (
                    <div>
                      <AiOutlinePicture className={styles.iconPicStyle} />
                      <div className={styles.rowContainer}>
                      <h2 className={styles.picText}>click to upload </h2>
                      <h2 className={styles.normalTextRed}>*</h2>
                      </div>
                    </div>
                  ) : (
                    <Image
                      className={styles.uploadedImage}
                      src={profileImage}
                      alt="Uploaded"
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </label>
              </div>
              <div className={styles.colContainer}>
                <div className={styles.rowContainer}>
                  <h2 className={styles.normalText}>Name</h2>
                  <h2 className={styles.normalTextRed}>*</h2>
                </div>
                <div className={styles.rowContainer}>
                  <input
                    name="Name"
                    value={NameOwner}
                    className={styles.textfieldStyle}
                    onChange={(e) => setNameOwner(e.target.value)}
                  />
                </div>

                <h2 className={styles.normalText}>Contact</h2>
                <div className={styles.rowContainer}>
                  <div className={styles.contactBox}>
                    <IoCall className={styles.iconStyle} />

                    <input
                      name="Phone"
                      value={numberPhone}
                      className={styles.textfieldStyleContact}
                      onChange={(e) => setNumberPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.rowContainer}>
                  <div className={styles.contactBox}>
                    <FaLine className={styles.iconStyle} />

                    <input
                      name="Line"
                      value={LineContact}
                      className={styles.textfieldStyleContact}
                      onChange={(e) => setLineContact(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.rowContainerCenter}>
              <h2 className={styles.normalText}>Business days</h2>
              <div className={styles.dropdown} >
                <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                  {selectedBusinessDays.every(Boolean)
                    ? "Everyday"
                    : "Selected Day(s)"}
                  <BsChevronDown />
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownList}>
                    {businessDays.map((day, index) => (
                      <div key={index} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          id={day}
                          checked={selectedBusinessDays[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <label htmlFor={day}>{day}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.rowContainerCenter2}>
              <h2 className={styles.normalText}>Open time</h2>
              <div className={styles.textfieldSubContainer}>
                <input
                  className={styles.ddTextfieldStyle}
                  type="number"
                  value={openTimeHR}
                  min="0"
                  max="23"
                  step="01"
                  onChange={handleChangeOpenTimeHR}
                />
                <h2 className={styles.normalText}> : </h2>
                <input
                  className={styles.ddTextfieldStyle}
                  type="number"
                  value={openTimeMIN}
                  min="0"
                  max="45"
                  step="15"
                  onChange={handleChangeOpenTimeMIN}
                />
              </div>
            </div>
            <div className={styles.rowContainerCenter2}>
              <h2 className={styles.normalText}>Close time</h2>
              <div className={styles.textfieldSubContainer}>
                <input
                  className={styles.ddTextfieldStyle}
                  type="number"
                  value={closeTimeHR}
                  min="0"
                  max="23"
                  step="1"
                  onChange={handleChangeCloseTimeHR}
                />
                <h2 className={styles.normalText}> : </h2>
                <input
                  className={styles.ddTextfieldStyle}
                  type="number"
                  value={closeTimeMIN}
                  min="0"
                  max="45"
                  step="15"
                  onChange={handleChangeCloseTimeMIN}
                />
              </div>
            </div>
          </div>

          <div className={styles.textfieldBigContainerR}>
            <div className={styles.textfieldSubContainer}>
              <div className={styles.rowContainer}>
                <h2 className={styles.normalText}>Location</h2>
                <h2 className={styles.normalTextRed}>*</h2>
              </div>
            </div>
            <textarea
              name="Location"
              className={styles.locationTextfield}
              rows={4}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                console.log(e.target.value);
              }}
            />
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${location}`}
                  frameborder="0"
                  className={styles.mapContainer}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <button className={styles.confirmButton} onClick={handleConfirmClick}>
          Confirm
        </button>
        <div className={styles.bottomContainer}>
          <h2 className={styles.bottomText}>Already have an account?</h2>
          <Link href="/login" className={styles.LoginButton}>
            Login
          </Link>
        </div>
        {errorMessage && (
          <div className={styles.ErrorChecking}>
            <span className={styles.Alerticon}>⚠️</span>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
