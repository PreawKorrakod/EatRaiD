"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import HomeCard from "../../components/HomeCard";
import Footer from "../../components/footer";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import image1 from "../../public/imgTest1.png";
import image2 from "../../public/imgTest2.png";
import image3 from "../../public/imgTest3.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { BsChevronDoubleLeft, BsCheckLg, BsChevronDoubleRight, BsPlus, BsXSquareFill, BsUpload, BsImages, BsExclamationCircle, BsCheckCircleFill, BsFillTrashFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { BsBoxArrowUpRight } from "react-icons/bs";
import Link from "next/link";
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from "./config/supabaseClient";
import { CustomCheckbox } from "../../components/CustomCheckbox";
import SliderDistance from "../../components/SliderDistance";
import SliderPrice from "../../components/SliderPrice";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const data = [
  {
    id: 1,
    name: "food A",
    image: image1,
    type: ["noodle", "fastfood"],
    distance: "5.6",
  },
  {
    id: 2,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "0.6",
  },
  {
    id: 3,
    name: "food C",
    image: image3,
    type: ["noodle", "fastfood"],
    distance: "1.6",
  },
  {
    id: 4,
    name: "food A",
    image: image1,
    type: ["noodle", "fastfood"],
    distance: "5.6",
  },
  {
    id: 5,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "0.5",
  },
  {
    id: 6,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "1.6",
  },
  {
    id: 7,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "0.6",
  },
  {
    id: 8,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "1.6",
  },
  {
    id: 9,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "0.6",
  },
  {
    id: 10,
    name: "food B",
    image: image2,
    type: ["noodle", "fastfood"],
    distance: "0.6",
  },
];

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState([]);
  const [groupSelected, setGroupSelected] = useState([]);

  // Pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate the items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  useEffect(() => {
    const fetchcategoryData = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/category`);
        setCategory(["All", ...response.data]);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
    fetchcategoryData();
  }, []);

  const filterRes = () => {
    return (
      <div className={styles.AllFilterContainer}>
        <div className={styles.CategoryContainer}>
          <div className={styles.Categoryheader}>Categories</div>
          <div className={styles.categoryComponents}>
            {category.map((type, index) => (
              <CustomCheckbox key={index} value={type.Name || type}>
                {type.Name || type}
              </CustomCheckbox>
            ))}
          </div>
        </div>

        <div className={styles.CategoryContainer}>
          <SliderPrice />
        </div>

        <div className={styles.CategoryContainer}>
          <SliderDistance />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.Container}>
        <div className={styles.Search_Filter_wrapper}>
          <form className={styles.search_wrapper}>
            <div className={`${styles.SearchBox} ${isFocused ? styles.active : ""}`}>
              <IoSearch size={25} className={styles.icon_Search} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.inputSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
            <button type="submit" className={styles.SearchBox_btn}>Search</button>
          </form>
          <div className={styles.Filter_wrapper}>
            <div className={styles.Filter_header}>Filter Restaurant</div>
            <div className={styles.Filter_Contaniner}>{filterRes()}</div>
          </div>
        </div>

        <div className={styles.List_Containner}>
          <div className={styles.random_wrapper}>
            <div className={styles.RandomContainer}>
              <div className={styles.titleText}>Not sure what to eat? Click this button for a random!</div>
              <button className={styles.Randombtn}>
                <GiPerspectiveDiceSixFacesRandom className={styles.randomicon} size={25} />
                <span>Random</span>
              </button>
            </div>

            <div className={styles.ShowResForRandom}>
              {currentItems.map((card) => (
                <div key={card.id}>
                  <HomeCard {...card} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <button className={styles.pageButton} onClick={handlePreviousPage} disabled={currentPage === 1}>
                <BsChevronDoubleLeft />
              </button>
              {renderPageNumbers()}
              <button className={styles.pageButton} onClick={handleNextPage} disabled={currentPage === totalPages}>
                <BsChevronDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}