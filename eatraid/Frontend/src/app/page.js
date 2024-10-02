'use client';
import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import { General, supabase } from "../../session";
import React, { useContext } from 'react';
import Navbar from "../../components/Navbar";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../../src/app/config/supabaseClient";

export default function Home() {
  // const user = useContext(General);

  // console.log('supabase',user)

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