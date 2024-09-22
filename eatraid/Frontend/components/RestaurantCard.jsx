'use client';
import { useState } from 'react'; // Import useState จาก React
import styles from './RestaurantCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsHeartFill, BsExclamationCircle, BsXSquareFill } from "react-icons/bs";

const RestaurantCard = (props) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Modal delete
    const renderLogoutModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content}>
                    <div className={styles.container}>
                        <BsExclamationCircle className={styles.Alerticon} />
                        <BsXSquareFill className={styles.close} onClick={() => setIsLogoutModalOpen(false)} />
                        <h2>Sign out</h2>
                        <p>Are you sure you want to Sign out?</p>

                        <div className={styles.clearfix}>
                            <button
                                type="button"
                                className={styles.cancelbtn}
                                onClick={() => setIsLogoutModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={styles.Logoutbtn}
                                onClick={() => {
                                    // คุณสามารถใส่ฟังก์ชันการ sign out ได้ที่นี่
                                    setIsLogoutModalOpen(false);
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

    const { img, name, id } = props;

    return (
        <>
            <div className={styles.content}>
                <div className={styles.main_content}>
                    <div className={styles.singleDest}>
                        {/* ลิงก์ครอบเนื้อหาของการ์ดเท่านั้น */}
                        <Link href={`/ProfileRestaurant/${id}`} className={styles.link_blog}>
                            <div className={styles.dastImage}>
                                <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={300} height={200} />
                            </div>
                            <div className={styles.dastFooter}>
                                <div className={styles.destText}>
                                    <p>{name}</p>
                                </div>
                            </div>
                        </Link>
                        <BsHeartFill
                            className={styles.heart_icon}
                            onClick={() => setIsLogoutModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Modal ที่แสดงเมื่อเปิด */}
            {isLogoutModalOpen && renderLogoutModal()}
        </>
    );
};

export default RestaurantCard;
