'use client';
import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import { NEXT_PUBLIC_BASE_API_URL } from "./config/supabaseClient";

export default function Home() {

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <div className={styles.Container}>
        <div className={styles.Search_Filter_wrapper}>
          <div className={styles.search_wrapper}>

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