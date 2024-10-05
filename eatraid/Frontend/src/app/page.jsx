'use client';
import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import { IoSearch } from "react-icons/io5";
import { NEXT_PUBLIC_BASE_API_URL } from "./config/supabaseClient";

export default function Home() {

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.Container}>
        <div className={styles.Search_Filter_wrapper}>
          <div className={styles.search_wrapper}>
            <form className={styles.SearchBox}>
              <div className={styles.Search_inside}>
                <IoSearch size={25} className={styles.icon_Search} type='submit' />
                <input
                  type="text"
                  // value={searchQuery}
                  placeholder="Search here..."
                  className={styles.inputSearch}
                />
              </div>
              <button type='submit' className={styles.SearchBox_btn}>Search</button>
            </form>
          </div>
          <div className={styles.Filter_wrapper}>

          </div>
        </div>
        <div className={styles.Spinning_List_wrapper}>
          <div className={styles.Spinning_wrapper}>

          </div>
          <div className={styles.List_wrapper}>

          </div>
        </div>
      </div>
    </div>
  );
}