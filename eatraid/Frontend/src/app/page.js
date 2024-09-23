import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import supabase from './config/supabaseClient.js';
import Navbar from "../../components/Navbar";

export default function Home() {
  console.log(supabase);
  return (
    <div className={styles.page}>
      {/* <Topbar></Topbar> */}
      <Navbar></Navbar>
      EatRaiD
      by Barley
      mairuuka
      kidtuengfan
    </div>
  );
}