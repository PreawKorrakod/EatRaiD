"use client";
import React, { useState } from "react";
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
import { MdLocationOn } from "react-icons/md";
import Link from "next/link";

const data = [
  {
    id: 1,
    name: "food AEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
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
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const showRes = () => {
    return data.map((item) => (
      <div key={item.id} className={styles.restaurantItem}>
        <div className={styles.resTmageCover}>
          <Image
            src={item.image.src}
            alt={item.name}
            className={styles.resImage}
            width={300}
            height={300}
          />
        </div>
        <div className={styles.Resinfo}>
          <Link href='' className={styles.nameRes}>{item.name}</Link>
          <div className={styles.typeRes}>
            {item.type.map((t, index) => (
              <span className={styles.typeComponents} key={index}>
                {t}
              </span>
            ))}
          </div>
          <div className={styles.showDistance}>
            <MdLocationOn className={styles.LocationIcon} />
            {item.distance} km
          </div>
        </div>
        <div className={styles.ResSelect}>
          <input type="Checkbox" />
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.Container}>
        <div className={styles.Search_Filter_wrapper}>
          <form className={styles.search_wrapper}>
            <div
              className={`${styles.SearchBox} ${
                isFocused ? styles.active : ""
              }`}
            >
              <div className={styles.Search_inside}>
                <IoSearch
                  size={25}
                  className={styles.icon_Search}
                  type="submit"
                />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className={styles.inputSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <button type="submit" className={styles.SearchBox_btn}>
              Search
            </button>
          </form>
          <div className={styles.Filter_wrapper}>
            <div className={styles.Filter_header}>Filter Restaurant</div>
            <div className={styles.Filter_Contaniner}></div>
          </div>
        </div>
        <div className={styles.List_Containner}>
          <div className={styles.random_wrapper}>
            <div className={styles.slider}>
              <Carousel
                responsive={responsive}
                style={{ zIndex: "900" }}
                autoPlay={true}
              >
                {data.map((card) => {
                  return (
                    <div key={card.id}>
                      <HomeCard
                        // เป็น id ร้านอาหาร ฝากส่ง id ร้านอาหารให้ด้วยคับ จะเอาไปไว้หลัง URL สำหรับเข้าถึงแต่ละ profile ของร้านอาหาร
                        id={card.id}
                        img={card.image}
                        name={card.name}
                        type={card.type}
                        distance={card.distance}
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
            <div className={styles.RandomContainer}>
              <button className={styles.Randombtn}>
                <span>
                  <GiPerspectiveDiceSixFacesRandom
                    size={25}
                    className={styles.randomicon}
                  />
                  Random
                </span>
              </button>
            </div>
            <div className={styles.Res_wrapper}>
              <div className={styles.AllmenuContaniner}>
                <div className={styles.Allmenu_header}>
                  <div className={styles.title}>
                    <div className={styles.Lefttitle}>
                      All Restaurant{" "}
                      <div className={styles.Showlength}>{data.length}</div>
                    </div>
                    <div className={styles.SelectChoice}>
                      <input
                        type="checkbox"
                        className={styles.Checkboxinput}
                        width={25}
                        height={25}
                      />
                      <div className={styles.SelectText}>Select All</div>
                    </div>
                  </div>
                  <div className={styles.subtitle}>
                    Uncheck to remove from random
                  </div>
                </div>
                <div className={styles.listRes}>{showRes()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
