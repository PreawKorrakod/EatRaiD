import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
// import supabase from './config/supabaseClient.js';
import './globals.css';
import './signupRestaurantDetail';
import SignupRestaurantDetail from "./signupRestaurantDetail";

export default function Home() {
  // console.log(supabase);
  return (
    <div >
      {/* <Navbar></Navbar> */}
      <SignupRestaurantDetail/>
    </div>
  );
}