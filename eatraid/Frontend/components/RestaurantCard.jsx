'use client';
import { useState } from 'react';
import styles from './RestaurantCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsHeartFill, BsXSquareFill, BsFillTrashFill, BsArrowRight } from "react-icons/bs";
import { MdHeartBroken } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
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


    const { id, img, name, type } = props;

    return (
        <>

            <div className={styles.main_content}>
                {/* <Tooltip title={type.join(', ')} placement="top"></Tooltip> */}
                <Tooltip title={type.join(', ')} placement="top">
                    <div className={styles.singleDest}>

                        <div className={styles.dastImage}>
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={2300} height={2200} />
                        </div>

                        <div className={styles.dastFooter}>
                            <div className={styles.destText}>
                                <p>{name}</p>

                                <div className={styles.favorite}>
                                    <BsHeartFill
                                        className={styles.heart_icon}
                                        onClick={() => setIsAlertModalOpen(true)}
                                    />
                                </div>
                            </div>
                            <div className={styles.showType}>
                                {type.slice(0, 2).map((t, index) => (
                                    <span key={index} className={styles.typeComponent}>{t}</span>
                                ))}
                                {type.length > 2 && <span className={styles.moreText}>+{type.length - 2} more</span>}
                            </div>
                        </div>

                        <div className={styles.LinkResBtn}>
                            <Link href={`restaurant/${id}`} className={styles.LinkBtn}>
                                More Details <BsArrowRight className={styles.iconMorDetail} />
                            </Link>
                        </div>

                    </div>
                </Tooltip>
            </div>


            {isAlertModalOpen && renderAlertModal()}
        </>
    );
};

export default RestaurantCard;

