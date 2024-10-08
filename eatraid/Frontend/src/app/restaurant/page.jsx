"use client";
import { useState, useEffect } from "react";
import styles from "./restaurant.module.css";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Topbar from "../../../components/Topbar";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import MenuCard from "../../../components/MenuCard";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import image1 from "../../../public/imgTest4.png";
import image2 from "../../../public/imgTest5.png";
import image3 from "../../../public/imgTest6.png";

// Data array
const data = [
  { id: 1, name: "food A", image: image1, type: "noodle", price: "50" },
  { id: 2, name: "food B", image: image2, type: "noodle", price: "50" },
  { id: 3, name: "food C", image: image3, type: "Western", price: "50" },
  // ... more items
];

export default function Info() {
  const [infoData, setInfoData] = useState(null);
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
      fav: "false",
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
    setInfoData((prevData) => ({
      ...prevData,
      fav: prevData.fav === "true" ? "false" : "true",
    }));
  };

  const statusClass =
    formData.status === "open" ? styles.statusOpen : styles.statusClosed;
  const statusText = formData.status === "open" ? "Open" : "Close";

  // Pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Number of items to show per page

  // Calculate the items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate the page numbers
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.scrollableContainer}>
        <div className={styles.profileCon}>
          <Image
            className={styles.uploadedImage}
            src={infoData.image}
            alt="Uploaded"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h1 className={styles.title}>{infoData.name}</h1>
          <GoDotFill className={`${styles.iconDot} ${statusClass}`} />
          <span className={`${styles.statusText} ${statusClass}`}>
            {statusText}
          </span>
          <button className={styles.editButton} onClick={handleFavClick}>
            Favorite
            {infoData.fav === "true" ? (
              <IoHeartSharp className={styles.favoriteIcon} />
            ) : (
              <IoHeartOutline className={styles.favoriteIcon} />
            )}
          </button>
        </div>

        <div className={styles.MenuContainer}>
          {currentItems.length > 0 ? (
            <div className={styles.content_grid}>
              {currentItems.map((restaurant) => (
                <MenuCard
                  key={restaurant.id}
                  id={restaurant.id}
                  img={restaurant.image}
                  name={restaurant.name}
                  type={restaurant.type}
                  price={restaurant.price}
                />
              ))}
            </div>
          ) : (
            <div className={styles.content_empty}>
              <p className={styles.emptyMessage}>No menu added yet.</p>
            </div>
          )}

          {data.length > 0 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <BsChevronDoubleLeft className={styles.Arrow} />
              </button>
              {renderPageNumbers()}
              <button
                className={styles.pageButton}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <BsChevronDoubleRight className={styles.Arrow} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
