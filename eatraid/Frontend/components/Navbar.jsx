'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { BsPersonCircle, BsBoxArrowRight, BsExclamationCircle, BsXSquareFill } from "react-icons/bs";
import Image from 'next/image';
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../src/app/config/supabaseClient";
import { useRouter } from "next/navigation";
import { getCookies } from 'cookies-next';
import imgTest from '../../Frontend/public/TestProfile.jpg';


export default function Navbar() {
    const [isOpen_Profile, setIsOpen_Profile] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserEmail, setIsEmailUser] = useState('');
    const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    const profileRef = useRef(null);
    const profileImage = '';



    useEffect(() => {
        // Fetch current user login status from backend when component mounts
        const fetchUserStatus = async () => {
            // const token = localStorage.getItem('accessToken');
            try {
                // รอค่าจาก fetch ด้วย await
                const token = await fetch(`${NEXT_PUBLIC_BASE_API_URL}/refresh`, {
                    method: 'POST',
                    credentials: 'include', // เพื่อให้แน่ใจว่าคุกกี้ถูกส่งไป
                });
                if (token.status !== 200) {
                    const errorData = await response.json();
                    console.error('Error refreshing access token:', errorData.message);
                };
                const data = await token.json();
                console.log("Token:", data.accessToken);

                const response = await fetch(`${NEXT_PUBLIC_BASE_API_URL}/getuserdata`, {
                  method: 'GET',
                  headers: {
                    "Authorization": `Bearer ${data.accessToken}`
                  },
                });

                const user = await response.json();
                if (response.ok) {
                  console.log('Success:', user);
                  console.log("User Role:", user[0]?.Role);
                  console.log("User Email:", user[0].Email);
                  setIsUserLoggedIn(token !== null);
                  setIsEmailUser(user[0].Email);
                  setIsOwnerLoggedIn(data[0]?.Role === "owner");
                } else {
                  console.error('Error:', data);
                }
            } catch (error) {
                console.error("Error fetching user status:", error);
            }

        };

        fetchUserStatus();

        // Handle click outside profile to close dropdown
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsOpen_Profile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ฟังก์ชัน Logout ตรงนี้เลยคับ
    const handleLogout = async () => {
        // const token = localStorage.getItem('accessToken');
        try {
            // ส่งคำขอ logout ไปยัง backend ก่อนล้าง localStorage
            const response = await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/logout`, {}, {
                withCredentials: true, // ตรวจสอบว่าใช้ cookies หรือ header อื่นๆ ที่เกี่ยวข้อง
            });

            if (response.status === 200) { // ตรวจสอบว่าการ logout สำเร็จ
                // ล้างข้อมูลใน localStorage หลัง logout สำเร็จ
                localStorage.clear();
                setIsUserLoggedIn(token !== null); // ทำให้ User ที่มีสถานะ login เป็นไม่ได้ login แล้ว
                setIsLogoutModalOpen(false); // ปิด modal สำหรับการยืนยันการ logout กรณี logout สำเร็จ
            } else {
                console.error('Failed to log out', response);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // ส่วนของ front ในการเปิดปิด dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsOpen_Profile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //Modal Logout
    const renderLogoutModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content}>
                    <div className={styles.container}>
                        <BsExclamationCircle className={styles.Alerticon} /><BsXSquareFill className={styles.close} onClick={() => setIsLogoutModalOpen(false)} />
                        <h2>Sign out</h2>
                        <p>Are you sure you want to Sign out?</p>

                        <div className={styles.clearfix}>
                            <button
                                className={styles.cancelbtn}
                                onClick={() => setIsLogoutModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.Logoutbtn}
                                onClick={() => {
                                    // เรียกใช้ฟังก์ชัน sign out ตรงนี้
                                    onClick = { handleLogout }
                                }}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className={styles.AllBar}>
            <div className={styles.Leftside}>
                <Link href={`/`} className={styles.Logo}>
                    EatRaiD
                </Link>
            </div>
            <div className={styles.Rightside}>
                {isUserLoggedIn ? (
                    isOwnerLoggedIn ? (
                        <div className={styles.Rightside_Owner}>
                            <Link href={`/`} className={styles.homebtn_User}>
                                Info
                            </Link>
                            <Link href={`/menu`} className={styles.favouritebtn}>
                                Menu
                            </Link>
                            <div>
                                <button className={styles.SignOutbtn} onClick={() =>
                                    setIsLogoutModalOpen(true)}>
                                    <BsBoxArrowRight size={30} className={styles.SignOuticon} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.Rightside_User}>
                            <Link href={`/`} className={styles.homebtn_User}>
                                Home
                            </Link>
                            <Link href={`/Favourite`} className={styles.favouritebtn}>
                                Favourite List
                            </Link>
                            <div
                                className={styles.profilebtn}
                                onClick={() => setIsOpen_Profile(!isOpen_Profile)}
                                ref={profileRef}
                            >
                                {profileImage ? (
                                    <Image
                                        src={imgTest}
                                        alt="Profile Picture"
                                        className={styles.profilePic}
                                    />
                                ) : (
                                    <BsPersonCircle className={styles.profileicon} />
                                )}
                                {isOpen_Profile && (
                                    <div className={styles.profile_content}>
                                        <div className={styles.profileImage}>
                                            {profileImage ? (
                                                <Image
                                                    src={imgTest}
                                                    alt="Profile Picture"
                                                    className={styles.profileicon}
                                                />
                                            ) : (
                                                <BsPersonCircle className={styles.profileicon_Content} />
                                            )}
                                        </div>
                                        <div className={styles.profileDetail}>
                                            Email: {isUserEmail}
                                            <div className={styles.SignOutSide}>
                                                <button className={styles.SignOutbtn_Profile} onClick={() => setIsLogoutModalOpen(true)}>
                                                    <BsBoxArrowRight size={25} className={styles.SignOuticon_Profile} />
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div className={styles.RightsideNoUser}>
                        <Link href={`/`} className={styles.homebtn}>
                            Home
                        </Link>
                        <Link href={`/login`}>
                            <button className={styles.loginbtn}>Login</button>
                        </Link>
                    </div>
                )}
            </div>

            {isLogoutModalOpen && renderLogoutModal()}
        </div>
    );
}
