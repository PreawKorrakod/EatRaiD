import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import supabase from './config/supabaseClient.js';

export default function Home() {
  console.log(supabase);
  return (
    <div className={styles.page}>
      <Topbar></Topbar>
      EatRaiD
      by Barley
      mairuuka
      kidtuengfan
    </div>
  );
}