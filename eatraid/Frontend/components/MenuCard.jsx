'use client';
import { useState } from 'react';
import styles from './MenuCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsPencilSquare, BsXSquareFill, BsFillTrashFill, BsCheckLg, BsUpload } from "react-icons/bs";

const categoryDropdown = ["Thai", "Japanese"];

const MenuCard = (props) => {

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State สำหรับสถานะการรอ
    const [isSuccess, setIsSuccess] = useState(false); // State สำหรับการลบสำเร็จ
    const [MenuImage, setMenuImage] = useState('');
    const [Imagefile, setImagefile] = useState('');


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImagefile(file);
        }
    };


    // ฟังก์ชันลบ  backend ตรงนี้นะ
    const handleRemove = async () => {
        setIsLoading(true); // เริ่มโหลด เป็นการตั้งสถานะโหลดของ frontend 
        try {
            await 
             // เวลา 2 วินาทีจำลองการลบ สามารถเขียนโค้ด Backend ข้อมูลตรงนี้ได้
            new Promise((resolve) =>
                setTimeout(resolve, 2000));
            // เป็นการจำลอง

            // อันนี้จำเป็นต้องวางไว้หลังจากลบข้อมูล โค้ดของ Backend ถ้าเกิดลบสำเร็จ
            setIsLoading(false); // หยุดโหลด
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
                        <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                        <h2 className={styles.headerTextModal}>Edit Menu</h2>
                        {isLoading ? (
                            <p>Please wait...</p>
                        ) : isSuccess ? (
                            <p className={styles.SuccessfulText}>Successfully delete!</p>
                        ) : (
                            <form className={styles.EditContentContainer}>

                                <div className={styles.EditContentImg}>
                                    <div className={styles.Menudisplay}>
                                        {MenuImage ? (
                                            <Image
                                                className={styles.MenuPicContainer}
                                                alt="Profile"
                                                src={MenuImage}
                                                layout="fill"
                                                objectFit="cover" 
                                            />
                                        ) : (
                                            <div className={styles.MenuPicContainer}>No Picture</div>
                                        )}
                                    </div>
                                    <label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                        <div className={styles.Uploadbtn}><BsUpload className={styles.iconUpload} />Upload Picture</div>
                                    </label>
                                </div>

                                <div className={styles.EditContentInput}>
                                    <div className={styles.inputNamefood}>
                                        Name : <input type="text" placeholder="Your text here" className={styles.inputContainer} />
                                    </div>

                                    <div className={styles.inputNamefood}>
                                        Type :  <select
                                            className={styles.optionTextStyles}

                                        >
                                            {categoryDropdown.map((category, index) => (
                                                <option key={index} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.inputPricefood}>
                                        Price : <input type="text" placeholder="Your text here" className={styles.inputPricefoodText} /> ฿
                                    </div>
                                </div>

                            </form>
                        )}
                        <div className={styles.clearfix}>
                            {!isSuccess && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.cancelbtn}
                                        disabled={isLoading}
                                    >
                                        <BsCheckLg className={styles.Checkicon} />
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.Removebtn}
                                        onClick={handleRemove}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Removing..." : <><BsFillTrashFill className={styles.Deleteicon} /> Delete</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    const { id, img, name, type, price, ownerID } = props;

    return (
        <>
            <div className={styles.content}>
                <div className={styles.main_content}>
                    <div className={styles.singleDest}>
                        <div className={styles.dastImage}>
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} />
                        </div>
                        <div className={styles.dastSide}>
                            <div className={styles.textinfo}>
                                <div className={styles.foodname}>
                                    <h5>{name}</h5>
                                </div>
                                <div className={styles.typefood}>
                                    {type}
                                </div>
                                <div className={styles.pricefood}>
                                    Price {price} ฿
                                </div>
                            </div>
                            <div className={styles.menu_buttom}>
                                <button
                                    className={styles.Editfood}
                                    onClick={() => setIsAlertModalOpen(true)} >
                                    <BsPencilSquare className={styles.Editicon} />
                                    Edit
                                    {/* ต้องส่งค่า id ของอาหารว่าเป็นอาหารไอดีไหน */}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {isAlertModalOpen && renderAlertModal()}
        </>
    );
};

export default MenuCard;