import styles from "./page.module.css";
import Navbar from "../../components/Navbar";
// import supabase from './config/supabaseClient.js';
import './globals.css';
import './signupRestaurantDetail/signupRestaurantDetail';
import SignupRestaurantDetail from "./signupRestaurantDetail/signupRestaurantDetail";
// import SignupRestaurantDetail from "./signupRestaurantDetail/signupRestaurantDetail";
import SignUpRole from "./signUpRole/signUpRole";


export default function Home() {
  // console.log(supabase);
  return (
    <div >
      {/* <Navbar></Navbar> */}
      {/* <SignupRestaurantDetail/> */}
      <SignUpRole/>
    </div>
  );
}