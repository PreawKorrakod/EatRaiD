import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./toggleGroup.module.css"; // นำเข้าไฟล์ CSS
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from '../src/app/config/supabaseClient.js';


const ToggleGroup = ({ id, status, formData, labels,onChange}) => {

  const [position, setPosition] = useState(() => {
    if (formData?.toggle_status === true) return "open";
    if (formData?.toggle_status === false) return "close";
    if (formData?.toggle_status === null)return "auto";
  });
  

  useEffect(() => {
    if (formData?.toggle_status === true) {
      setPosition("open");
    } else if (formData?.toggle_status === false) {
      setPosition("close");
    } else if (formData?.toggle_status === null) {
      setPosition("auto");
    }
    console.log("position:", position);
  }, [formData?.toggle_status]);
  

  const mapStatusToBackendValue = (value) => {
    switch (value) {
      case "open":
        return true; 
      case "auto":
        return null;
      case "close":
        return false;
    }
  };


  const handleToggle = (value) => {
    setPosition(value); // อัปเดตตำแหน่ง
    const backendValue = mapStatusToBackendValue(value); // แปลงเป็นค่าที่ backend ต้องการ
    axios.put(`${NEXT_PUBLIC_BASE_API_URL}/toggle`, {
      RestaurantId: id,
      toggle_status: backendValue,
    })
      .then((response) => {
        console.log("Toggle response:", response.data);
        setFormData(prevFormData => ({
          ...prevFormData,
          toggle_status: backendValue, // อัปเดต toggle_status ใน formData
        }));
        fetchInfo(); // อัปเดต infoData จาก backend เพื่อสะท้อนสถานะใหม่
      })
      .catch((error) => {
        console.error("Error toggling store:", error);
      });
    onChange(id, value); // เรียกใช้ฟังก์ชัน callback ที่รับมา
  };


  return (
    <div className={styles.toggleContainer}>
      <div className={`${styles.toggleSwitch} ${styles[position]}`}></div>

      <label
        className={`${styles.toggleLabel} ${position === "open" ? styles.blackFont : ""
          }`}
        onClick={() => handleToggle("open")}
      >
        {labels.left.title}
      </label>

      <label
        className={`${styles.toggleLabel} ${position === "auto" ? styles.blackFont : ""
          }`}
        onClick={() => handleToggle("auto")}
      >
        {labels.center.title}
      </label>

      <label
        className={`${styles.toggleLabel} ${position === "close" ? styles.blackFont : ""
          }`}
        onClick={() => handleToggle("close")}
      >
        {labels.right.title}
      </label>
    </div>
  );
};

ToggleGroup.propTypes = {
  id: PropTypes.string.isRequired, // รับ id ของร้าน
  status: PropTypes.oneOf(["Open", "Auto", "Close"]).isRequired, // รับค่า status
  labels: PropTypes.shape({
    left: PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    center: PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    right: PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func, // ฟังก์ชัน callback เมื่อมีการเปลี่ยนค่า
};

ToggleGroup.defaultProps = {
  labels: {
    left: { title: "Open", value: "open"},
    center: { title: "Auto", value: "auto" },
    right: { title: "Close", value: "close" },
  },
  onChange: (id, value) => console.log(`Store ${id} toggled to: ${value}`),
};

export default ToggleGroup;
