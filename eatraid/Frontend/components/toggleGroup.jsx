import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./toggleGroup.module.css"; // นำเข้าไฟล์ CSS

const ToggleGroup = ({ id, status, labels, onChange }) => {
  const [position, setPositoggleContainertion] = useState(status.toLowerCase()); // ใช้ status ที่รับมาเป็นค่าเริ่มต้น
  // back ใช้ตัวแปร id และ backencvalue ในการ check status ได้เลย

  useEffect(() => {
    setPosition(status.toLowerCase()); // อัปเดตตำแหน่งเมื่อค่า status เปลี่ยน
  }, [status]);

  const mapStatusToBackendValue = (value) => {
    switch (value) {
      case "open":
        return true; // เปิดร้าน
      case "close":
        return false; // ปิดร้าน
      case "auto":
      default:
        return null; // โหมดอัตโนมัติ
    }
  };

  const handleToggle = (value) => {
    setPosition(value); // อัปเดตตำแหน่ง
    const backendValue = mapStatusToBackendValue(value); // แปลงเป็นค่าที่ backend ต้องการ
    onChange(id, backendValue); // ส่ง id และค่าสถานะใหม่ไปยัง parent
  };

  return (
    <div className={styles.toggleContainer}>
      <div className={`${styles.toggleSwitch} ${styles[position]}`}></div>

      <label
        className={`${styles.toggleLabel} ${
          position === "open" ? styles.blackFont : ""
        }`}
        onClick={() => handleToggle("open")}
      >
        {labels.left.title}
      </label>

      <label
        className={`${styles.toggleLabel} ${
          position === "auto" ? styles.blackFont : ""
        }`}
        onClick={() => handleToggle("auto")}
      >
        {labels.center.title}
      </label>

      <label
        className={`${styles.toggleLabel} ${
          position === "close" ? styles.blackFont : ""
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
  status: PropTypes.oneOf(["Open", "Close", "Auto"]).isRequired, // รับค่า status
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
    left: { title: "Open", value: "open" },
    center: { title: "Auto", value: "auto" },
    right: { title: "Close", value: "close" },
  },
  onChange: (id, value) => console.log(`Store ${id} toggled to: ${value}`),
};

export default ToggleGroup;
