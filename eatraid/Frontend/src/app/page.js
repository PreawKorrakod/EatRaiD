import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
import supabase from './config/supabaseClient.js';

export default function Home() {
  console.log(supabase);
  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      EatRaiD
      by Barley
      mairuuka
      kidtuengfan
    </div>
  );
}