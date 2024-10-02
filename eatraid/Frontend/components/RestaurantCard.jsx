'use client';
import { useState } from 'react';
import styles from './RestaurantCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsHeartFill, BsXSquareFill, BsFillTrashFill } from "react-icons/bs";
import { MdHeartBroken } from "react-icons/md";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../src/app/config/supabaseClient";

const RestaurantCard = (props) => {
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State สำหรับสถานะการรอ
    const [isSuccess, setIsSuccess] = useState(false); // State สำหรับการลบสำเร็จ

    // ฟังก์ชันลบ  backend ตรงนี้นะ
    const handleRemove = async () => {
        setIsLoading(true); // เริ่มโหลด เป็นการตั้งสถานะโหลดของ frontend 
        try {
            // อันนี้จำเป็นต้องวางไว้หลังจากลบข้อมูล โค้ดของ Backend ถ้าเกิดลบสำเร็จ
            const response = await axios.delete(`${NEXT_PUBLIC_BASE_API_URL}/delete-fav`, {
                data: { restaurant: id },
                withCredentials: true,
            });
            console.log(response.data.msg);
            setIsLoading(false);
            props.onRemove(props.id);
            setIsSuccess(true); // ลบสำเร็จ
            setTimeout(() => {
                setIsAlertModalOpen(false);
                setIsSuccess(false); // รีเซ็ตสถานะการลบสำเร็จ
            }, 2000); // ซ่อน modal หลังจากแสดงข้อความสำเร็จ 2 วินาที

        } catch (error) {
            setIsLoading(false); // หยุดโหลดถ้าเกิดข้อผิดพลาด
            alert("Error occurred while removing"); // แสดงข้อผิดพลาดถ้ามี
        }
    };

    // Modal delete
    const renderAlertModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content}>
                    <div className={styles.container}>
                        <MdHeartBroken className={styles.Alerticon} />
                        <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                        <h2>Unfavorite</h2>
                        {isLoading ? (
                            <p>Please wait...</p>
                        ) : isSuccess ? (
                            <p className={styles.SuccessfulText}>Successfully removed!</p>
                        ) : (
                            <p>Are you sure you want to unfavorite this restaurant?</p>
                        )}
                        <div className={styles.clearfix}>
                            {!isSuccess && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.cancelbtn}
                                        onClick={() => setIsAlertModalOpen(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.Removebtn}
                                        onClick={handleRemove}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Removing..." : "Yes, Remove"}
                                    </button>
                                </>
                            )}
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

                        <div className={styles.dastImage}>
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={300} height={200} />
                        </div>

                        <div className={styles.dastFooter}>
                            <Link href={`/ProfileRestaurant/${id}`} className={styles.link_blog2}>
                                <div className={styles.destText}>
                                    <p>{name}</p>
                                </div>
                            </Link>
                            <div className={styles.favorite}>
                                <BsHeartFill
                                    className={styles.heart_icon}
                                    onClick={() => setIsAlertModalOpen(true)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div >

            {isAlertModalOpen && renderAlertModal()}
        </>
    );
};

export default RestaurantCard;
