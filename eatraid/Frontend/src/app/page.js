import styles from "./page.module.css";

import supabase from './config/supabaseClient.js';

export default function Home() {
  console.log(supabase);
  return (
    <div className={styles.page}>
      EatRaiD
      by Barley
      mairuuka
      kidtuengfan
    </div>
  );
}