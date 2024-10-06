"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import { IoSearch } from "react-icons/io5";
import image1 from "../../public/imgTest1.png";
import image2 from "../../public/imgTest2.png";
import image3 from "../../public/imgTest3.png";

const data = [
  { id: 1, name: "food A", image: image1 },
  { id: 2, name: "food B", image: image2 },
  { id: 3, name: "food C", image: image3 },
  { id: 4, name: "food A", image: image1 },
  { id: 5, name: "food B", image: image2 },
];

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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
                onFocus={handleFocus} // จับเหตุการณ์ focus
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
            <randomCard/>
          </div>
          <div className={styles.List_wrapper}></div>
        </div>
      </div>
    </div>
  );
}
