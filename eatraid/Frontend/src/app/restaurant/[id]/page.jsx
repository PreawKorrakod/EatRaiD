"use client";
import { useState, useEffect } from "react";
import styles from "./restaurant.module.css";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Navbar from "../../../../components/Navbar";
// import { useRouter } from "../../../../.next/router";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import MenuCard from "../../../../components/MenuCard";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
// import image1 from "../../../public/imgTest4.png";
// import image2 from "../../../public/imgTest5.png";
// import image3 from "../../../public/imgTest6.png";
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from '../../../../src/app/config/supabaseClient.js';

// Data array
// const data = [
//   { id: 1, name: "food A", image: image1, type: "noodle", price: "50" },
//   { id: 2, name: "food B", image: image2, type: "noodle", price: "50" },
//   { id: 3, name: "food C", image: image3, type: "Western", price: "50" },
//   { id: 4, name: "food C", image: image3, type: "Western", price: "50" },
//   { id: 5, name: "food B", image: image2, type: "noodle", price: "50" },
//   { id: 6, name: "food C", image: image3, type: "Western", price: "50" },
//   { id: 7, name: "food C", image: image3, type: "Western", price: "50" },
//   // ... more items
// ];

export default function restaurant({ params }) {
  // const router = useRouter();
  // Pagination settings
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
  const [fav, setFav] = useState([]);
  const [typerestaurant, setTyperestaurant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to show per page

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
          className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ""
            }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };


  const [infoData, setInfoData] = useState(null);
  const [defaultIsOpen, setDefaultIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overrideStatus, setOverrideStatus] = useState(null);

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

  useEffect(() => {
    if (infoData) {
      if (infoData.toggle_status !== null) {
        setOverrideStatus(infoData?.toggle_status);
      } else {
        setOverrideStatus(defaultIsOpen ? 'open' : 'close');
      }
    }
  }, [infoData, defaultIsOpen]);

  useEffect(() => {
    axios.get(`${NEXT_PUBLIC_BASE_API_URL}/get-fav-restaurant`, {
      params: { RestaurantId: params.id },
      withCredentials: true
    })
      .then((res) => {
        setFav(res.data);
      })
  }, [params.id]);

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

      const openTime = getTodayTime(infoData.OpenTimeHr, infoData.OpenTimeMin);
      const closeTime = getTodayTime(infoData.CloseTimeHr, infoData.CloseTimeMin);

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
  }, [infoData, selectedBusinessDays]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {

        const menu = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showmenu`, {
          params: { RestaurantId: params.id },
          withCredentials: true,
        });

        console.log(menu.data);
        setData(menu.data);

      } catch (error) {
        console.error('Error fetching menu data:', error);
        alert('Failed to fetch menu data.');
      }
    };
    fetchMenuData();
  }, [params.id]);

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
          console.log("No user data found.");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true); // Show loading
      if (!params.id) return;
      try {
        const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showinfo`, {
          params: { RestaurantId: params.id },
          withCredentials: true,
        });
        if (response.data && response.data.length > 0) {
          console.log("Restaurant info:", response.data[0]);
          const selectedDays = response.data[0].BusinessDay.split(',').map(day => day === 'true');
          setSelectedBusinessDays(selectedDays);
          setInfoData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);

      } finally {
        setLoading(false); // Hide loading
      }
    }

    fetchInfo();
  }, [params.id]);



  useEffect(() => {
    const fetchCategory = async () => {
      if (!infoData?.RestaurantId) return;
      try {
        const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/typerestaurant`, {
          params: { RestaurantId: params.id },
          withCredentials: true,
        });
        // console.log("Restaurant Category:", category.data.map((item) => item.TypeName));
        const type = category.data.map((item) => item.TypeName);
        console.log("Type:", type);
        setTyperestaurant(type.join(', '));
      } catch (error) {
        console.error('Error fetching restaurant category:', error);
      }
    };
    fetchCategory();
  }, [infoData?.RestaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }


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
    openday.push('Everyday');
  } else if (beforeshow_open.length < 4) {
    openday.push(beforeshow_open.join(', '));
  } else if (beforeshow_open.length >= 4) {
    openday.push("Everyday except " + beforeshow_close.join(', '));
  }


  if (!infoData) {
    return <div>Loading...</div>;
  }

  console.log("infoData", infoData);

  const displayedIsOpen = overrideStatus !== null ? (overrideStatus === 'open') : defaultIsOpen;

  const handleFavClick = async () => {
    console.log("isLikedByUser", isLikedByUser);
    if (!userId) {
      alert('Please login to favorite this restaurant.');
      return;
    } else {
      try {
        let res;
        if (isLikedByUser) {
          res = await axios.delete(`${NEXT_PUBLIC_BASE_API_URL}/delete-fav`, {
            data: { user: userId, restaurant: params.id },
            withCredentials: true,
          });
          setFav(prevFav => prevFav.filter(f => f.UserId !== userId));
        } else {
          res = await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/add-to-fav`, {
            user: userId,
            restaurant : params.id,
          }, {
            withCredentials: true,
          });
          setFav(prevFav => [...prevFav, { UserId: userId }]);
        }
      } catch (error) {
        console.error('Error updating favorite:', error);
      }
    }
  };

  console.log("fav", fav);

  const isLikedByUser = fav.some(({ UserId }) => UserId === userId);

  const statusClass =
    infoData?.toggle_status === "open" ? styles.statusOpen : styles.statusClosed;
  const statusText = infoData?.toggle_status === "open" ? "Open" : "Close";

  return (
    <div className={styles.mainBg}>
      <Navbar />
      <div className={styles.scrollableContainer}>

        <div className={styles.bigContainer}>
          <div className={styles.profileCon}>
            <Image
              className={styles.uploadedImage}
              src={infoData.ProfilePic}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <button className={styles.editButton} onClick={handleFavClick}>
            Favorite
            {isLikedByUser ? (
              <IoHeartSharp className={styles.favoriteIcon} />
            ) : (
              <IoHeartOutline className={styles.favoriteIcon} />
            )}
          </button>
          <div className={styles.rowCon2}>
            <h1 className={styles.title}>{infoData.Name}</h1>
            <GoDotFill className={`${styles.iconDot} ${statusClass}`} />
            <span className={`${styles.statusText} ${statusClass}`}>
              {infoData?.toggle_status === 'open' && "Open"}
              {infoData?.toggle_status === 'close' && "Close"}
              {infoData?.toggle_status === null && (displayedIsOpen ? "Open" : "Close")}
            </span>
          </div>
          <div className={styles.rowCon}>
            <div className={styles.halfCon}>
              <div className={styles.rowCon}>
                <h2 className={styles.normalText}>Category</h2>
                <h2 className={styles.normalText4}>{typerestaurant}</h2>
              </div>
              <div className={styles.rowCon}>
                <h2 className={styles.normalText}>Business day</h2>
                <h2 className={styles.normalText2}>{openday}</h2>
              </div>
              <div className={styles.rowCon}>
                <h2 className={styles.normalText}>Open time</h2>
                <h2 className={styles.normalText3}>
                  {infoData.OpenTimeHr} : {infoData.OpenTimeMin}
                </h2>
                <h2 className={styles.normalText1}>Close time</h2>
                <h2 className={styles.normalText2}>
                  {infoData.CloseTimeHr} : {infoData.CloseTimeMin}
                </h2>
              </div>
              <div className={styles.rowCon}>
                <h2 className={styles.normalText}>Contact</h2>
                <div className={styles.colCon}>
                  <div className={styles.rowCon}>
                    <IoCall className={styles.icon} />
                    <h2 className={styles.normalText2}>
                      {infoData.Tel}
                    </h2>
                  </div>
                  <div className={styles.rowCon}>
                    <FaLine className={styles.icon} />
                    <h2 className={styles.normalText2}>
                      {infoData.Line}
                    </h2>
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

        <div className={styles.MenuContainer}>
          <div className={styles.Menuheader}>Menu</div>
          {currentItems.length > 0 ? (
            <div className={styles.content_grid}>
              {/* backend มาเชื่อมให้ใส่ข้อมูล restaurant.(ชื่อคอลัมน์) นะ */}
              {currentItems.map((restaurant) => (
                <MenuCard
                  key={restaurant.Id}
                  id={restaurant.Id}
                  img={restaurant.MenuPic ? restaurant.MenuPic : null}
                  name={restaurant.NameFood}
                  type={restaurant.Type.Name}
                  price={restaurant.Price}
                  role="customer"
                // role = 'owner'
                />
              ))}
            </div>
          ) : (
            <div className={styles.content_empty}>
              <p className={styles.emptyMessage}>No menu added yet.</p>
            </div>
          )}
          {/* Pagination Controls */}
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