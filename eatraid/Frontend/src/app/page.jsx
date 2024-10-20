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
    location: "kmutnb",
    price: { min: 30, max: 90 },
    coordinates: { latitude: 13.7503, longitude: 100.5503 },
  },
  {
    id: 2,
    name: "Food B",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 100, max: 150 },
    coordinates: { latitude: 0, longitude: 0 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 3,
    name: "Food C",
    image: image3,
    type: ["noodle", "Fast food"],
    location: "kmutnb",
    price: { min: 100, max: 250 },
    coordinates: { latitude: 10, longitude: 0 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 4,
    name: "Food D",
    image: image1,
    type: ["noodle", "Fast food"],
    location: "kmutnb",
    price: { min: 80, max: 150 },
    coordinates: { latitude: 13.7503, longitude: 100.5503 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 5,
    name: "Food E",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 20, max: 60 },
    coordinates: { latitude: 13.7504, longitude: 100.5504 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 6,
    name: "Food F",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 150, max: 300 },
    coordinates: { latitude: 13.7505, longitude: 100.5505 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 7,
    name: "Food G",
    image: image2,
    type: ["Local food", "Fast food", "healthy"],
    location: "kmutnb",
    price: { min: 220, max: 250 },
    coordinates: { latitude: 13.7506, longitude: 100.5506 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 8,
    name: "Food H",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 50, max: 80 },
    coordinates: { latitude: 13.7507, longitude: 100.5507 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 9,
    name: "Food I",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 10, max: 30 },
    coordinates: { latitude: 13.7508, longitude: 100.5508 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 10,
    name: "Food J",
    image: image2,
    type: ["Local food", "Fast food"],
    location: "kmutnb",
    price: { min: 300, max: 300 },
    coordinates: { latitude: 13.7509, longitude: 100.5509 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 11,
    name: "Food K",
    image: image2,
    type: ["Local food", "Dessert"],
    location: "kmutnb",
    price: { min: 100, max: 150 },
    coordinates: { latitude: 13.7510, longitude: 100.5510 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 12,
    name: "Food L",
    image: image2,
    type: ["Local food", "Dessert"],
    location: "kmutnb",
    price: { min: 120, max: 120 },
    coordinates: { latitude: 13.7511, longitude: 100.5511 }, // ค่าที่ใกล้เคียง
  },
  {
    id: 13,
    name: "Food M",
    image: image2,
    type: ["Local food", "Dessert"],
    location: "kmutnb",
    price: { min: 90, max: 110 },
    coordinates: { latitude: 13.7512, longitude: 100.5512 }, // ค่าที่ใกล้เคียง
  },
];


export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState([]);
  const [groupSelected, setGroupSelected] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [distanceValue, setDistanceValue] = useState(1000); // ระยะทางเริ่มต้น
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [locationFetched, setLocationFetched] = useState(false);
  const [randomResult, setRandomResult] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]); // เก็บรายการที่ถูกสลับ
  const [shufflingCards, setShufflingCards] = useState([]); // เก็บการ์ดที่แสดงในขณะสุ่ม


  const handleRandomize = () => {
    if (filteredResults.length === 0) return; // ตรวจสอบว่ามีผลลัพธ์หรือไม่
    setIsShuffling(true);
    setIsRandomizing(true);

    const shuffleCards = [...filteredResults];
    setShufflingCards(shuffleCards); // ตั้งค่า shufflingCards ให้มีการ์ดทั้งหมด

    // ฟังก์ชันสุ่มสลับตำแหน่งแบบ Fisher-Yates
    for (let i = shuffleCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffleCards[i], shuffleCards[j]] = [shuffleCards[j], shuffleCards[i]];
    }

    setShuffledCards(shuffleCards); // ตั้งค่ารายการที่สลับ
    let shuffleInterval = setInterval(() => {
      // สลับการ์ดไปเรื่อยๆ
      setShufflingCards(prevCards => {
        const newCards = [...prevCards];

        // สลับตำแหน่งใน newCards
        for (let i = newCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
        }

        return newCards;
      });
    }, 200); // เปลี่ยนแปลงทุก 200ms (สามารถปรับได้)

    // หยุดการสลับและแสดงผลลัพธ์สุ่มหลังจาก 2 วินาที
    setTimeout(() => {
      clearInterval(shuffleInterval);
      const randomCard = shuffleCards[Math.floor(Math.random() * shuffleCards.length)];
      setRandomResult(randomCard);
      setIsShuffling(false);
      setIsRandomizing(false);
    }, 2000); // เวลาสุ่มที่ต้องการ
  };



  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log('Location : ', latitude, longitude)
          setLocationFetched(true); // ระบุว่าตำแหน่งได้รับแล้ว
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // รัศมีของโลกในกิโลเมตร
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // ระยะทางในเมตร
  };


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
          <SliderDistance
            distanceValue={distanceValue}
            setDistanceValue={(newDistance) => {
              setDistanceValue(newDistance);
              if (!locationFetched) {
                getUserLocation(); // ขอ location เมื่อเริ่มเลื่อน slider
              }
            }}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const filterData = () => {
      let filtered = [...data];

      if (!groupSelected.includes("All")) {
        filtered = filtered.filter(item =>
          groupSelected.some(category => item.type.includes(category))
        );
      }

      if (searchTerm.length > 0) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      filtered = filtered.filter(item =>
        item.price.min >= priceRange[0] && item.price.max <= priceRange[1]
      );

      if (locationFetched) {
        filtered = filtered.filter(item => {
          const distance = getDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.coordinates.latitude,
            item.coordinates.longitude
          );
          return distance <= distanceValue;
        });
      }

      setFilteredResults(filtered);
    };

    filterData();
  }, [searchTerm, groupSelected, priceRange, distanceValue, userLocation, locationFetched]);


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
              <button className={styles.Randombtn} onClick={handleRandomize} disabled={isRandomizing}>
                <GiPerspectiveDiceSixFacesRandom className={styles.randomicon} size={25} />
                <span>{isRandomizing ? 'Randomizing...' : 'Random'}</span>
              </button>
            </div>

            <div className={styles.ShowResForRandom}>
              {isRandomizing ? (
                shufflingCards.length > 0 ? (
                  shufflingCards.map((card) => (
                    <HomeCard
                      key={card.id}
                      id={card.id}
                      img={card.image}
                      name={card.name}
                      type={card.type}
                      distance={locationFetched
                        ? getDistance(userLocation.latitude, userLocation.longitude, card.coordinates.latitude, card.coordinates.longitude).toFixed(2)
                        : "N/A"}
                    />
                  ))
                ) : (
                  filteredResults.map((card) => (
                    <HomeCard
                      key={card.id}
                      id={card.id}
                      img={card.image}
                      name={card.name}
                      type={card.type}
                      distance={locationFetched
                        ? getDistance(userLocation.latitude, userLocation.longitude, card.coordinates.latitude, card.coordinates.longitude).toFixed(2)
                        : "N/A"}
                    />
                  ))
                )
              ) : randomResult ? (

                <HomeCard
                  id={randomResult.id}
                  img={randomResult.image}
                  name={randomResult.name}
                  type={randomResult.type}
                  distance={locationFetched
                    ? getDistance(userLocation.latitude, userLocation.longitude, randomResult.coordinates.latitude, randomResult.coordinates.longitude).toFixed(2)
                    : "N/A"}
                />

              ) : filteredResults.length > 0 ? (
                filteredResults.map((card) => (
                  <div key={card.id}>
                    <HomeCard
                      id={card.id}
                      img={card.image}
                      name={card.name}
                      type={card.type}
                      distance={locationFetched
                        ? getDistance(userLocation.latitude, userLocation.longitude, card.coordinates.latitude, card.coordinates.longitude).toFixed(2)
                        : "N/A"}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.noResultsMessage}>No results found.</div>
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