import Image from "next/image";
import styles from "./page.module.css";

import supabase from './config/supabaseClient.js';

export default function Home() {
  return (
    <div className={styles.page}>
      EatRaiD
      by Barley
      mairuuka
      kidtuengfan
    </div>
  );
}