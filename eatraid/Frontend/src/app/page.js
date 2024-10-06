"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import HomeCard from "../../components/HomeCard";
import { IoSearch } from "react-icons/io5";
import image1 from "../../public/imgTest1.png";
import image2 from "../../public/imgTest2.png";
import image3 from "../../public/imgTest3.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

const data = [
  { id: 1, name: "food A", image: image1, type: "noodle" },
  { id: 2, name: "food B", image: image2, type: "fastfood" },
  { id: 3, name: "food C", image: image3, type: "fastfood" },
  { id: 4, name: "food A", image: image1, type: "order to cooked" },
  { id: 5, name: "food B", image: image2, type: "noodle" },
];

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.Container}>
        <div className={styles.Search_Filter_wrapper}>
          <from className={styles.search_wrapper}>
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
          </from>
          <div className={styles.Filter_wrapper}>
            <div className={styles.Filter_header}>Filter Restaurant</div>
            <div className={styles.Filter_Contaniner}></div>
          </div>
        </div>
        <div className={styles.List_Containner}>
          <div className={styles.random_wrapper}>
            <div className={styles.slider}>
              <Carousel responsive={responsive} style={{ zIndex: "900" }}>
                {data.map((card) => {
                  return (
                    <div key={card.id}>
                      <HomeCard
                        img={card.image}
                        name={card.name}
                        type={card.type}
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
                    All Restaurant
                    <div className={styles.ShowSelect}>
                      Select{" "}
                      <div className={styles.Showlength}>{data.length}</div>
                    </div>
                  </div>
                  <div className={styles.subtitle}>
                    Uncheck to remove from random
                  </div>
                </div>
                <div className={styles.listRes}>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
