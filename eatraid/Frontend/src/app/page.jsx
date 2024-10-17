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
    name: "Food A",
    image: image1,
    type: ["noodle", "Fast food"],
    distance: "5.6",
    price: { min: 30, max: 90 },
  },
  {
    id: 2,
    name: "Food B",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "0.6",
    price: { min: 100, max: 150 },
  },
  {
    id: 3,
    name: "Food C",
    image: image3,
    type: ["noodle", "Fast food"],
    distance: "1.6",
    price: { min: 100, max: 250 },
  },
  {
    id: 4,
    name: "Food D",
    image: image1,
    type: ["noodle", "Fast food"],
    distance: "5.6",
    price: { min: 80, max: 150 },
  },
  {
    id: 5,
    name: "Food E",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "0.5",
    price: { min: 20, max: 60 },
  },
  {
    id: 6,
    name: "Food F",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "1.6",
    price: { min: 150, max: 300 },
  },
  {
    id: 7,
    name: "Food G",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "0.6",
    price: { min: 220, max: 250 },
  },
  {
    id: 8,
    name: "Food H",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "1.6",
    price: { min: 50, max: 80 },
  },
  {
    id: 9,
    name: "Food I",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "0.6",
    price: { min: 10, max: 30 },
  },
  {
    id: 10,
    name: "Food J",
    image: image2,
    type: ["Local food", "Fast food"],
    distance: "0.6",
    price: { min: 300, max: 300 },
  },
  {
    id: 11,
    name: "Food K",
    image: image2,
    type: ["Local food", "Dessert"],
    distance: "0.6",
    price: { min: 100, max: 150 },
  },
  {
    id: 12,
    name: "Food L",
    image: image2,
    type: ["Local food", "Dessert"],
    distance: "0.6",
    price: { min: 120, max: 120 },
  },
  {
    id: 13,
    name: "Food M",
    image: image2,
    type: ["Local food", "Dessert"],
    distance: "0.6",
    price: { min: 90, max: 110 },
  },
];

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState([]);
  const [groupSelected, setGroupSelected] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);

  useEffect(() => {
    const fetchcategoryData = async () => {
      try {
        const category = await axios.get(
          `${NEXT_PUBLIC_BASE_API_URL}/category`
        );
        // console.log(category.data);
        setCategory(["All", ...category.data]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchcategoryData();
  }, []);

  // Pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Calculate the items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

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


  
  const filterRes = () => {
    return (
        <div className={styles.AllFilterContainer}>
            <div className={styles.CategoryContainer}>
                <div className={styles.Categoryheader}>Categories</div>
                <div className={styles.categoryComponents}>
                    {category.map((type, index) => (
                        <CustomCheckbox
                            key={index}
                            value={type.Name || type}
                            isSelected={groupSelected.includes(type.Name || type)} // Check if this category is selected
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "All") {
                                    // If "All" is selected, reset all other selections
                                    setGroupSelected(["All"]);
                                } else {
                                    // If another category is selected, remove "All" from selection
                                    setGroupSelected((prevSelected) => {
                                        if (prevSelected.includes("All")) {
                                            return [...prevSelected.filter((item) => item !== "All"), value];
                                        }
                                        return prevSelected.includes(value)
                                            ? prevSelected.filter((item) => item !== value)
                                            : [...prevSelected, value]; // Add the new category if not already selected
                                    });
                                }
                            }}
                        >
                            {type.Name || type}
                        </CustomCheckbox>
                    ))}
                </div>
            </div>
            <div className={styles.CategoryContainer}>
                <SliderPrice value={priceRange} onChange={setPriceRange} />
            </div>
            <div className={styles.CategoryContainer}>
                <SliderDistance />
            </div>
        </div>
    );
};

  
useEffect(() => {
  const filterData = () => {
    let filtered = [...data];

    // Filter by selected categories
    if (groupSelected.includes("All")) {
      filtered = [...data];
    } else if (groupSelected.length > 0) {
      filtered = filtered.filter((item) =>
        groupSelected.some((selectedCategory) =>
          item.type.includes(selectedCategory)
        )
      );
    }

    // Filter by search term (case insensitive and partial matches)
    if (searchTerm.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    filtered = filtered.filter((item) => {
      const { min, max } = item.price;
      return min >= priceRange[0] && max <= priceRange[1];
    });

    setFilteredResults(filtered);
  };

  filterData();
}, [searchTerm, groupSelected, data, priceRange]);


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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {currentItems.length > 0 ? (
                currentItems.map((card) => (
                  <div key={card.id}>
                    <HomeCard
                      id={card.id}
                      img={card.image}
                      name={card.name}
                      type={card.type}
                      distance={card.distance}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.noResultsMessage}>ไม่พบผลลัพธ์</div>
              )}
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