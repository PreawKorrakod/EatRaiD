'use client';
import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import { General, supabase } from "../../session";
import React, { useContext } from 'react';

export default function Home() {
  const user = useContext(General);

  console.log('supabase',user)
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