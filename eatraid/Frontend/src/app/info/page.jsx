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

import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from '../../../src/app/config/supabaseClient.js';
import { user } from "@nextui-org/theme";

export default function Info() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [defaultIsOpen, setDefaultIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    restaurantId: "",
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

  const [UpdateStatus,  setUpdateStatus] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false); // เพิ่ม state นี้

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

  // const [status, setStatus] = useState("Auto");

  // const [status, setStatus] = useState(() => {
  //   if (infoData?.toggle_status === true) return "open";
  //   if (infoData?.toggle_status === false) return "close";
  //   return "auto";
  // });
  

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

  console.log("userId:", userId);

  // ดึงข้อมูลผู้ใช้เมื่อ component mount
  useEffect(() => {

    const fetchData = async () => {
      try {
        const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
          withCredentials: true,
        });
        if (user !== null && user.data.length > 0) {
          console.log(user.data[0].Id);
          setUserId(user.data[0].Id);
        } else {
          router.push(`/`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showinfo`, {
          params: { RestaurantId: userId },
          withCredentials: true,
        });
        if (response.data && response.data.length > 0) {
          console.log("Restaurant info:", response.data[0]);
          const selectedDays = response.data[0].BusinessDay.split(',').map(day => day === 'true');
          setSelectedBusinessDays(selectedDays);

          setInfoData(response.data[0]);
          setFormData(prevFormData => ({
            ...prevFormData,
            Id: response.data[0].id,
            name: response.data[0].Name,
            restaurantId: response.data[0].RestaurantId,
            businessDay: selectedDays,
            category: response.data[0].category,
            openTimeHR: response.data[0].OpenTimeHr,
            openTimeMin: response.data[0].OpenTimeMin,
            closeTimeHR: response.data[0].CloseTimeHr,
            closeTimeMin: response.data[0].CloseTimeMin,
            contactCall: response.data[0].Tel,
            contactLine: response.data[0].Line,
            location: response.data[0].Location,
            profileImage: response.data[0].ProfilePic,
          }));
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    };
    fetchInfo();
  }, [userId]);

  // useEffect(() => {
  //   if (infoData) {
  //     const toggleStatus = infoData?.toggle_status; 
  //     setStatus(toggleStatus === null ? "Auto" : toggleStatus ? "Open" : "Close");
  //   }
  // }, [infoData]);
  

  console.log("selectedBusinessDays:", selectedBusinessDays);

  // ดึงประเภทร้านเมื่อ infoData ถูกตั้งค่า
  useEffect(() => {
    const fetchCategory = async () => {
      if (!infoData?.RestaurantId) return;
      try {
        const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/typerestaurant`, {
          params: { RestaurantId: infoData?.RestaurantId },
          withCredentials: true,
        });
        console.log("Restaurant Category:", category.data[0]);
        const type = category.data.map((item) => item.TypeName);
        setTyperestaurant(type.join('/'));
      } catch (error) {
        console.error('Error fetching restaurant category:', error);
      }
    };
    fetchCategory();
  }, [infoData?.RestaurantId]);

  // useEffect(() => {
  //   console.log("TOGGLE", infoData?.toggle_status);
  //   if (!infoData) return;
  //   else {
  //     if (infoData?.toggle_status === true) setStatus("Open");
  //     else if (infoData?.toggle_status === false) setStatus("Close");
  //     else if (infoData?.toggle_status === null) setStatus("Auto")
  //   };
  // }, [userId, infoData]);


  // ตั้งค่า formData เมื่อ infoData เปลี่ยนแปลง
  useEffect(() => {
    if (infoData) {
      console.log("infoData:", infoData.id);
      setFormData({
        Id: infoData.id,
        name: infoData.Name,
        restaurantId: infoData.RestaurantId,
        businessDay: selectedBusinessDays.join(','),
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


  useEffect(() => {
    if (infoData) {
      setFormData(prevFormData => ({
        ...prevFormData,
        businessDay: selectedBusinessDays.join(','),
      }));
    }
  }, [selectedBusinessDays, infoData]);

 

  console.log("infodata:", infoData);

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
        businessDay: selectedBusinessDays.join(','),
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

  console.log("formData:", formData);


  if (!infoData) {
    return <div>Loading...</div>;
  }

  // Code ส่งไปค่าปุ่ม
  const id = userId;
  const labelsText = {
    left: { title: "Open", value: "open" },
    center: { title: "Auto", value: "auto" },
    right: { title: "Close", value: "close" },
  };

  const onChangetoggle = (id, newStatus) => {
    console.log(`Store ${id} changed to: ${newStatus}`);
    const updatedStatus = newStatus === true ? "open" : newStatus === false ? "close" : "auto";
    setUpdateStatus(updatedStatus);
    axios.put(`${NEXT_PUBLIC_BASE_API_URL}/toggle`, {
      RestaurantId: id,
      toggle_status: newStatus,
    })
      .then((response) => {
        console.log("Toggle response:", response.data);
      })
      .catch((error) => {
        console.error("Error toggling store:", error);
      });
  };
  



  const handleEditClick = () => {
    setIsModalOpen(true);
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

  console.log("OpenDay:", openday);


  /// main page
  return (
    <div className={styles.mainBg}>
      <Navbar />
      <div className={styles.bigContainer}>
        <div className={styles.profileCon}>
          <Image
            className={styles.uploadedImage}
            src={formData.profileImage || "/default-profile.png"} // รูป fallback
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
          selectedBusinessDays={selectedBusinessDays}
          setSelectedBusinessDays={setSelectedBusinessDays}

        />

        <div className={styles.rowCon3}>
          <h1 className={styles.title}>{formData.name || "Restaurant Name"}</h1>
        </div>
        <ToggleGroup
          id={id}
          status={formData?.toggle_status === null ? "auto" : formData?.toggle_status ? "close" : "open"} // ส่งสถานะเริ่มต้นเข้าไป
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
                  {formData.openTimeHR} : {formData.openTimeMin} -
                </h2>
                <h2 className={styles.normalText5}>
                  {formData.closeTimeHR} : {formData.closeTimeMin}
                </h2>
              </div>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colCon}>
                <div className={styles.rowCon2}>
                  <IoCall className={styles.icon} />
                  <h2 className={styles.normalText2}>{formData.contactCall}</h2>
                </div>
                <div className={styles.rowCon2}>
                  <FaLine className={styles.icon} />
                  <h2 className={styles.normalText2}>{formData.contactLine}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.halfCon}>
            <h2 className={styles.normalText}>Location</h2>
            <h2 className={styles.locationCon}>{formData.location}</h2>
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${formData.location}`}
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