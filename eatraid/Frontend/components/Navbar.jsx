'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { BsPersonCircle, BsBoxArrowRight,  BsExclamationCircle, BsXSquareFill } from "react-icons/bs";
import Image from 'next/image';



export default function Navbar() {
    const [isOpen_Profile, setIsOpen_Profile] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); 

    const profileRef = useRef(null);

    useEffect(() => {
        // Fetch current user login status from backend when component mounts
        const fetchUserStatus = async () => {
            try {
                const response = await fetch('/api/user-status'); // Fetch user login status
                const data = await response.json();
                setIsUserLoggedIn(data.isLoggedIn);
                setIsOwnerLoggedIn(data.isOwner);
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
        try {
           
           
            if (response.ok) {
                setIsUserLoggedIn(false); // ทำให้ User ที่มีสถานะ login เป็นไม่ได้ login แล้ว
                setIsLogoutModalOpen(false); // ปิด model สำหรับการยืนยันการ logout กรณี logout สำเร็จ
            } else {
                console.error('Failed to log out');
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
                        <BsExclamationCircle className={styles.Alerticon}/><BsXSquareFill className={styles.close} onClick={() => setIsLogoutModalOpen(false)}/>
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
                                    onClick={handleLogout}
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
                                {profileImageUrl ? (
                                    <Image
                                        src={profileImageUrl}
                                        alt="Profile Picture"
                                        className={styles.profilePic}
                                    />
                                ) : (
                                    <BsPersonCircle className={styles.profileicon} />
                                )}
                                {isOpen_Profile && (
                                    <div className={styles.profile_content}>
                                        <div className={styles.profileImage}>
                                            {profileImageUrl ? (
                                                <Image
                                                    src={profileImageUrl}
                                                    alt="Profile Picture"
                                                    className={styles.profileicon}
                                                />
                                            ) : (
                                                <BsPersonCircle className={styles.profileicon_Content} />
                                            )}
                                        </div>
                                        <div className={styles.profileDetail}>
                                            Email: {Email_User}
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
