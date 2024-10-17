"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./info.module.css";
import { BsChevronDown } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import ToggleGroup from "../../../components/toggleGroup";
import Editinfo from "../../../components/Editinfo";

export default function Info() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [defaultIsOpen, setDefaultIsOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    businessDay: "",
    openTimeHR: "",
    openTimeMin: "",
    closeTimeHR: "",
    closeTimeMin: "",
    contactCall: "",
    contactLine: "",
    location: "",
    profileImage: "",
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [typerestaurant, setTyperestaurant] = useState("");

  const time_hr = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  // status ร้านให้เป็น Auto เริ่มต้น
  const [status, setStatus] = useState("Auto");

  const time_min = ["00", "15", "30", "45"];
  const businessDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getCurrentDateTime = () => {
    return new Date();
  };

  const getTodayTime = (hour, minute) => {
    const now = new Date();
    now.setHours(parseInt(hour, 10));
    now.setMinutes(parseInt(minute, 10));
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  // Mock data for testing
  const mockUserData = {
    data: [{ Id: "123" }],
  };

  const mockInfoData = {
    id: "1",
    Name: "Test Restaurant",
    BusinessDay: "true,true,true,true,true,true,true",
    OpenTimeHr: "09",
    OpenTimeMin: "00",
    CloseTimeHr: "21",
    CloseTimeMin: "00",
    Tel: "123456789",
    Line: "@testline",
    Location: "kmutnb",
    ProfilePic: "/DecPic.png",
    toggle_status: null,
  };

  const mockCategoryData = [
    { TypeName: "Noodle" },
    { TypeName: "Pizza" },
    { TypeName: "Rice" },
    { TypeName: "Italian" },
  ];

  useEffect(() => {
    // Simulating fetching user data
    setUserId(mockUserData.data[0].Id);
  }, []);

  useEffect(() => {
    if (userId) {
      // Simulating fetching restaurant info
      setInfoData(mockInfoData);
      const selectedDays = mockInfoData.BusinessDay.split(",").map(
        (day) => day === "true"
      );
      setSelectedBusinessDays(selectedDays);
    }
  }, [userId]);

  useEffect(() => {
    if (infoData) {
      // Simulating fetching category data
      const type = mockCategoryData.map((item) => item.TypeName);
      setTyperestaurant(type.join("/"));
    }
  }, [infoData]);

  useEffect(() => {
    if (infoData) {
      if (infoData.toggle_status !== null) {
        setOverrideStatus(infoData?.toggle_status);
      } else {
        setOverrideStatus(defaultIsOpen ? "open" : "close");
      }
    }
  }, [infoData, defaultIsOpen]);

  useEffect(() => {
    if (!infoData) return;

    const checkIsOpen = () => {
      const now = getCurrentDateTime();
      const currentDay = now.getDay();
      const isTodayOpen = selectedBusinessDays[currentDay];
      if (!isTodayOpen) {
        setDefaultIsOpen(false);
        return;
      }

      const openTime = getTodayTime(formData.openTimeHR, formData.openTimeMin);
      const closeTime = getTodayTime(
        formData.closeTimeHR,
        formData.closeTimeMin
      );

      if (closeTime <= openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      if (now >= openTime && now <= closeTime) {
        setDefaultIsOpen(true);
      } else {
        setDefaultIsOpen(false);
      }
    };

    checkIsOpen();
    const interval = setInterval(checkIsOpen, 60000);
    return () => clearInterval(interval);
  }, [infoData, selectedBusinessDays, formData]);

  // Set formData when infoData changes
  useEffect(() => {
    if (infoData) {
      setFormData({
        Id: infoData.id,
        name: infoData.Name,
        category: infoData.category,
        openTimeHR: infoData.OpenTimeHr,
        openTimeMin: infoData.OpenTimeMin,
        closeTimeHR: infoData.CloseTimeHr,
        closeTimeMin: infoData.CloseTimeMin,
        contactCall: infoData.Tel,
        contactLine: infoData.Line,
        location: infoData.Location,
        profileImage: infoData.ProfilePic,
      });
    }
  }, [infoData]);

  if (!infoData) {
    return <div>Loading...</div>;
  }

  // Code ส่งไปค่าปุ่ม
  const id = "store-001"; // กำหนด id ร้าน

  // ข้อความ labels ที่จะใช้ใน ToggleGroup
  const labelsText = {
    left: { title: "Open", value: "open" },
    center: { title: "Auto", value: "auto" },
    right: { title: "Close", value: "close" },
  };

  // ฟังก์ชัน onChange ที่จะเรียกเมื่อเปลี่ยน toggle
  const onChangetoggle = (storeId, newStatus) => {
    console.log(`Store ${storeId} changed to: ${newStatus}`);
    setStatus(
      newStatus === true ? "Open" : newStatus === false ? "Close" : "Auto"
    );
  };

  // Determine displayed status
  const displayedIsOpen =
    overrideStatus !== null ? overrideStatus === "open" : defaultIsOpen;

  // Toggle function
  const toggleOverride = async () => {
    const newStatus =
      overrideStatus === null ? (defaultIsOpen ? "close" : "open") : null;
    setOverrideStatus(newStatus);

    // Simulated update without axios
    console.log("override", newStatus);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeCategory = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChangeOpenTimeHR = (event) => {
    setFormData({ ...formData, openTimeHR: event.target.value });
  };

  const handleChangeOpenTimeMIN = (event) => {
    setFormData({ ...formData, openTimeMin: event.target.value });
  };

  const handleChangeCloseTimeHR = (event) => {
    const newCloseTimeHR = event.target.value;
    setFormData({ ...formData, closeTimeHR: newCloseTimeHR });
  };

  const handleChangeCloseTimeMIN = (event) => {
    setFormData({ ...formData, closeTimeMin: event.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSaveClick = async () => {
    const businessDayString = selectedBusinessDays
      .map((day) => (day ? "true" : "false"))
      .join(",");

    // Simulated save without axios
    console.log("Saved data:", {
      ...formData,
      businessDay: businessDayString,
      file: imageFile,
    });

    // Update infoData with mock data
    setInfoData({
      ...infoData,
      Name: formData.name,
      BusinessDay: businessDayString,
      OpenTimeHr: formData.openTimeHR,
      OpenTimeMin: formData.openTimeMin,
      CloseTimeHr: formData.closeTimeHR,
      CloseTimeMin: formData.closeTimeMin,
      Tel: formData.contactCall,
      Line: formData.contactLine,
      Location: formData.location,
      ProfilePic: profileImage || infoData.ProfilePic,
    });
    handleCloseModal();
  };

  const openday = [];
  const beforeshow_open = [];
  const beforeshow_close = [];
  selectedBusinessDays.forEach((day, index) => {
    if (day) {
      beforeshow_open.push(businessDays[index]);
    } else {
      beforeshow_close.push(businessDays[index]);
    }
  });
  if (beforeshow_open.length === 7) {
    openday.push("Everyday");
  } else if (beforeshow_open.length < 4) {
    openday.push(beforeshow_open.join(", "));
  } else if (beforeshow_open.length >= 4) {
    openday.push("Everyday except " + beforeshow_close.join(", "));
  }

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };


  /// main page
  return (
    <div className={styles.mainBg}>
      <Navbar />
      <div className={styles.bigContainer}>
        <div className={styles.profileCon}>
          <Image
            className={styles.uploadedImage}
            src={infoData.ProfilePic || "/default-profile.png"} // รูป fallback
            alt="Uploaded"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className={styles.rowCon1}>
          <button className={styles.editButton} onClick={handleEditClick}>
            <div className={styles.rowCon2}>
              <FiEdit3 className={styles.editIcon} />
              Edit Profile
            </div>
          </button>
        </div>

        {/* Render Editinfo outside of the button */}
        <Editinfo
          userID={userId}
          formData={formData}
          setFormData={setFormData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <div className={styles.rowCon3}>
          <h1 className={styles.title}>{infoData.Name || "Restaurant Name"}</h1>
        </div>
        <ToggleGroup
          id={id}
          status={status} // ส่งสถานะเริ่มต้นเข้าไป
          labels={labelsText} // ส่งข้อความ labels
          onChange={onChangetoggle} // ส่งฟังก์ชัน onChange
        />

        <div className={styles.rowCon}>
          <div className={styles.halfCon}>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Category</h2>
              {/* back แยกด้วยไรมาใส่ใน split */}
              {typerestaurant.split("/").map((category, index) => (
                <h2 key={index} className={styles.normalText4}>
                  {category.trim()}
                </h2>
              ))}
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Business day</h2>
              <h2 className={styles.normalText2}>{openday}</h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Time</h2>
              <div className={styles.rowCon2}>
                <h2 className={styles.normalText3}>
                  {infoData.OpenTimeHr} : {infoData.OpenTimeMin} -
                </h2>
                <h2 className={styles.normalText5}>
                  {infoData.CloseTimeHr} : {infoData.CloseTimeMin}
                </h2>
              </div>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colCon}>
                <div className={styles.rowCon2}>
                  <IoCall className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.Tel}</h2>
                </div>
                <div className={styles.rowCon2}>
                  <FaLine className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.Line}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.halfCon}>
            <h2 className={styles.normalText}>Location</h2>
            <h2 className={styles.locationCon}>{infoData.Location}</h2>
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${infoData.Location}`}
                  frameBorder="0"
                  className={styles.mapCon}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}