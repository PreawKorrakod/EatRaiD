"use client";
import { useState, useEffect } from "react";
import styles from "./restaurant.module.css";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Topbar from "../../../components/Topbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function Info() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
    status: "",
    fav: "",
  });

  useEffect(() => {
    // Simulated fetch from backend
    const test = {
      image: "/DecPic.png",
      name: "Restaurant name",
      category: "Thai",
      businessDay: "Sunday",
      openTimeHR: "12",
      openTimeMin: "15",
      closeTimeHR: "18",
      closeTimeMin: "45",
      contactCall: "0888",
      contactLine: "hi",
      location: "subscribe rama7",
      status: "close",
      fav: "false"
    };
    setInfoData(test);
  }, []);

  useEffect(() => {
    if (infoData) {
      setFormData({
        name: infoData.name,
        category: infoData.category,
        businessDay: infoData.businessDay,
        openTimeHR: infoData.openTimeHR,
        openTimeMin: infoData.openTimeMin,
        closeTimeHR: infoData.closeTimeHR,
        closeTimeMin: infoData.closeTimeMin,
        contactCall: infoData.contactCall,
        contactLine: infoData.contactLine,
        location: infoData.location,
        profileImage: infoData.image,
        status: infoData.status,
        fav: infoData.fav,
      });
    }
  }, [infoData]);

  if (!infoData) {
    return <div>Loading...</div>;
  }

  const handleFavClick = () => {
    setInfoData(prevData => ({
        ...prevData,
        fav: prevData.fav === 'true' ? 'false' : 'true'
      }));
  };

  const statusClass =
    formData.status === "open" ? styles.statusOpen : styles.statusClosed;
  const statusText = formData.status === "open" ? "Open" : "Close";

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.profileCon}>
        <Image
          className={styles.uploadedImage}
          src={infoData.image}
          alt="Uploaded"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.bigContainer}>
        <button className={styles.editButton} onClick={handleFavClick}>
          Favorite
          {infoData.fav === 'true' ? <IoHeartSharp className={styles.favoriteIcon} /> : <IoHeartOutline className={styles.favoriteIcon} />}
        </button>
        <div className={styles.rowCon2}>
          <h1 className={styles.title}>{infoData.name}</h1>
          <GoDotFill className={`${styles.iconDot} ${statusClass}`} />
          <span className={`${styles.statusText} ${statusClass}`}>
            {statusText}
          </span>
        </div>
        <div className={styles.rowCon}>
          <div className={styles.halfCon}>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Category</h2>
              <h2 className={styles.normalText4}>{infoData.category}</h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Business day</h2>
              <h2 className={styles.normalText2}>{infoData.businessDay}</h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Open time</h2>
              <h2 className={styles.normalText3}>
                {infoData.openTimeHR} : {infoData.openTimeMin}
              </h2>
              <h2 className={styles.normalText1}>Close time</h2>
              <h2 className={styles.normalText2}>
                {infoData.closeTimeHR} : {infoData.closeTimeMin}
              </h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colCon}>
                <div className={styles.rowCon}>
                  <IoCall className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.contactCall}</h2>
                </div>
                <div className={styles.rowCon}>
                  <FaLine className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.contactLine}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.halfCon}>
            <h2 className={styles.normalText}>Location</h2>
            <h2 className={styles.locationCon}>{infoData.location}</h2>
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${infoData.location}`}
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
