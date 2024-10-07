'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { BsPersonCircle, BsBoxArrowRight, BsExclamationCircle, BsXSquareFill } from "react-icons/bs";
import Image from 'next/image';
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../src/app/config/supabaseClient";
import imgTest from '../../Frontend/public/TestProfile.jpg';
import { useRouter } from "next/navigation";


export default function Navbar() {
    const [isOpen_Profile, setIsOpen_Profile] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserEmail, setIsEmailUser] = useState('');
    const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    const profileRef = useRef(null);
    const router = useRouter();


    useEffect(() => {
        // Fetch current user login status from backend when component mounts
        const fetchUserStatus = async () => {
            try {
                const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
                    withCredentials: true,
                });
                if (user) {
                    console.log('Success:', user);
                    console.log("User Role:", user.data[0].Role);
                    console.log("User Email:", user.data[0].Email);
                    setIsUserLoggedIn(user !== null);
                    setIsEmailUser(user.data[0].Email);
                    setIsOwnerLoggedIn(user.data[0].Role === "owner");
                } else {
                    console.log('Failed:', user);
                };
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

    function getInitials(isUserEmail) {
        const name = isUserEmail.split('@')[0]; // ตัดเอาส่วนชื่อก่อน @
        const initials = name.split('.').map(n => n[0].toUpperCase()).join(''); // ดึงตัวแรกของแต่ละส่วน
        return initials;
    }

    // ฟังก์ชัน Logout ตรงนี้เลยคับ
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/logout`, {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log('Logout successful');
                setIsLogoutModalOpen(false);
                setIsUserLoggedIn(false);
                setIsEmailUser('');
                setIsOwnerLoggedIn(false);

            } else {
                console.error('Logout failed');
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
                                type="button"
                                className={styles.Logoutbtn}
                                onClick={handleLogout}
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
                <Link href={isOwnerLoggedIn ? `/info` : `/`}className={styles.Logo}>
                    EatRaiD
                </Link>
            </div>
            <div className={styles.Rightside}>
                {isUserLoggedIn ? (
                    isOwnerLoggedIn ? (
                        <div className={styles.Rightside_Owner}>
                            <Link href={`/info`} className={styles.homebtn_User}>
                                Info
                            </Link>
                            <Link href={`/menu`} className={styles.favouritebtn}>
                                Menu
                            </Link>
                            <div>
                                <button className={styles.SignOutbtn} onClick={() =>
                                    setIsLogoutModalOpen(true)}>
                                    <BsBoxArrowRight size={25} className={styles.SignOuticon} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.Rightside_User}>
                            <Link href={`/`} className={styles.homebtn_User}>
                                Home
                            </Link>
                            <Link href={`/favoriteList`} className={styles.favouritebtn}>
                                Favourite List
                            </Link>
                            <div
                                className={styles.profilebtn}
                                onClick={() => setIsOpen_Profile(!isOpen_Profile)}
                                ref={profileRef}
                            >
                                {isUserEmail ? (
                                    <div className={styles.profileInitials}>
                                        {getInitials(isUserEmail)}
                                    </div>
                                ) : (
                                    <BsPersonCircle className={styles.profileicon} />
                                )}
                                {isOpen_Profile && (
                                    <div className={styles.profile_content}>
                                        <div className={styles.profileImage}>
                                            {isUserEmail ? (
                                                <div className={styles.profileInitials2}>
                                                    {getInitials(isUserEmail)}
                                                </div>
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
