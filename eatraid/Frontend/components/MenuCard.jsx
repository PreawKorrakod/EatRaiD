'use client';
import { useState, useEffect } from 'react';
import styles from './MenuCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsPencilSquare, BsXSquareFill, BsFillTrashFill, BsCheckLg, BsUpload, BsImages, BsExclamationCircle, BsCheckCircleFill } from "react-icons/bs";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../src/app/config/supabaseClient";



const MenuCard = (props) => {

    // เป็นค่า props ที่ดึงมา  // User เป็นตัวแปร User สร้างมาเก็บค่าของ User/owner ที่กำลัง  เพื่อเอามาเทียบว่าเท่ากับ owner ไหม ถ้าไม่ตรงจะไม่ขึ้นปุ่ม edit
    // const { id, img, name, type, price, owner, user, onEdit } = props;
    const { id, img, name, type, price, owner, role, onEdit } = props;


    const [selectedMenu, setSelectedMenu] = useState({ name, type, price, img });// เก็บค่าข้อมูลเดิมก่อนที่จะทำการ Edit ใหม่

    // เก็บค่าข้อมูลใหม่ ให้ Back เอาค่าที่ได้รับการ edit ไปใช้ได้เลย
    const [editName, setEditName] = useState(selectedMenu.name);
    const [editPrice, setEditPrice] = useState(selectedMenu.price);
    const [editType, setEditType] = useState(selectedMenu.type);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State สำหรับสถานะการรอ
    const [isSuccess, setIsSuccess] = useState(false); // State สำหรับการลบสำเร็จ
    const [isEditSuccess, setIsEditSuccess] = useState(false); // State สำหรับการแก้ไขสำเร็จ
    const [MenuImage, setMenuImage] = useState(img || '');
    const [Imagefile, setImagefile] = useState('');
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [category, setCategory] = useState('');


    useEffect(() => {
        const fetchcategoryData = async () => {
            try {
                const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/category`);
                console.log(category.data);
                setCategory(category);

                // ค้นหา id ของ category ที่ตรงกับ typeName (type) และตั้งเป็นค่าเริ่มต้นของ editType
                const matchedCategory = category.data.find(item => item.Name === type);
                if (matchedCategory) {
                    setEditType(matchedCategory.Id); // ตั้งค่า editType เป็น id ที่ตรงกับ typeName
                }
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };
        fetchcategoryData();
    }, [type]);



    const handleEditClick = () => {
        setSelectedMenu({ name, type, price, img });
        setIsAlertModalOpen(true);
    };

    // ฟังก์ชันสำหรับการจัดการรูปภาพ ทำการแสดงภาพเดิม แล้วเมื่อการการ Upload ไฟล์รูปภาพใหม่ก็จะแสดงรูปอันใหม่
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagefile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
            console.log("Selected Image File:", file);
        }
    };



    const handleRemove = async (cardId) => {
        setErrorMessage(''); // รีเซ็ตข้อความข้อผิดพลาด
        setIsSuccess(false); // ตั้งเป็น false ก่อนที่จะทำการลบ
        setIsLoading(true); // เริ่มการโหลด

    
        try {
            // ลบข้อมูล
            await axios.delete(`${NEXT_PUBLIC_BASE_API_URL}/deletemenu`, {
                data: { id: cardId },
                withCredentials: true
            });

            // แสดงข้อความสำเร็จ
            setIsLoading(false);
            setIsSuccess(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Delete successful"); // ตรวจสอบการลบสำเร็จ

    
            // แสดงข้อความสำเร็จเป็นระยะเวลา (ปรับค่าที่นี่)
            setTimeout(() => {
                setIsSuccess(false); // รีเซ็ตสถานะสำเร็จ
            }, 5000); // แสดงนาน 5 วินาที

            // อัปเดตสถานะ
            props.onRemove(cardId); // เรียกฟังก์ชันที่จัดการการลบใน parent component
    
        } catch (error) {
            setIsLoading(false); // หยุดโหลดถ้ามีข้อผิดพลาด
            setErrorMessage('Error occurred while deleting'); // ตั้งค่าข้อความข้อผิดพลาด
            console.error(error);
        }
    };

    // ฟังก์ชัน edit ตรงนี้นะ
    const handleConfirm = async (event, cardId) => {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }

        setIsLoading(true); // เริ่มโหลดเมื่อกดปุ่ม Confirm
        await new Promise((resolve) => setTimeout(resolve, 2000)); // จำลองการรอ 2 วินาที

        const formData = new FormData();
        formData.append('file', Imagefile); // 'file' ต้องตรงกับที่ Backend คาดหวัง
        formData.append('id', cardId);
        formData.append('name', editName);
        formData.append('price', editPrice);
        formData.append('type', editType);


        try {
            const res = await axios.put(`${NEXT_PUBLIC_BASE_API_URL}/editmenu`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            console.log(res.data);

            setSelectedMenu({ name: editName, price: editPrice, type: editType, img: res.data[0].MenuPic });

            console.log("Name:", editName);
            console.log("Price:", editPrice);
            console.log("Type:", editType);
            console.log("Image:", Imagefile);

            onEdit({ id: cardId, name: editName, price: editPrice, type: editType, img: res.data[0].MenuPic });


            // setIsLoading(true); // เริ่มโหลดเมื่อกดปุ่ม Confirm

            // await new Promise((resolve) => setTimeout(resolve, 2000)); // จำลองการรอ 2 วินาที

            setIsLoading(false); // หยุดโหลด
            setIsEditSuccess(true); // แก้ไขสำเร็จ
            setTimeout(() => {
                console.log(`แก้ไขเมนูที่ id: ${cardId}`);
                setIsAlertModalOpen(false);
                setIsEditSuccess(false); // รีเซ็ตสถานะสำเร็จ
            }, 3000); // ซ่อน modal หลังจากแสดงข้อความสำเร็จ 2 วินาที
        } catch (error) {
            setIsLoading(false); // หยุดโหลดถ้ามีข้อผิดพลาด
            setErrorMessage('Error occurred while editing'); // ตั้งค่าข้อความข้อผิดพลาด
            console.error(error);
        }
    };

    // เป็นฟังก์ชันตรวจสอบ input ของ User ตรงส่วน Price ของ frontend ไม่มีอะไรต้องดึง
    const handleInput = (event) => {
        let value = event.target.value;

        // ตรวจสอบว่ากรอกเป็นตัวอักษรหรือตัวเลข
        if (/[^0-9]/g.test(value)) {
            setError('Please enter numbers only.');
        }
        // ตรวจสอบว่าเริ่มต้นด้วย 0 แต่ไม่ใช่เพียงเลข 0 ตัวเดียว
        else if (value.length > 1 && value.startsWith('0')) {
            setError('Please do not enter numbers starting with 0.');
        }
        else {
            setError('');
        }

        // กรองเฉพาะตัวเลข และลบเลข 0 นำหน้า (ยกเว้น 0 ตัวเดียว)
        event.target.value = value.replace(/[^0-9]/g, '');
    };




    // Modal edit popup
    const renderAlertModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content} onSubmit={(e) => handleConfirm(e, id)}>
                    <div className={styles.container}>
                        <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                        <h2 className={styles.headerTextModal}>Edit Menu</h2>
                        {isLoading ? (
                            <p className={styles.wait}>Please wait...</p>
                        ) : isSuccess ? (
                            <div className={styles.successContainer}>
                                <p className={styles.SuccessfulText}><BsCheckCircleFill className={styles.CheckSuccess} />Successfully deleted!</p>
                            </div>
                        ) : isEditSuccess ? (
                            <div className={styles.successContainer}>
                                <p className={styles.SuccessfulText}><BsCheckCircleFill className={styles.CheckSuccess} />Successfully edited!</p>
                            </div>
                        ) : errorMessage ? (
                            <div className={styles.successContainer}>
                                <p className={styles.errorText}><BsExclamationCircle className={styles.iconExc2} />{errorMessage}</p>
                            </div>
                        ) : (
                            // ส่วนของการ input ข้อมูลใหม่ของ User ที่ต้องการ edit 
                            <div className={styles.EditContentContainer}>
                                <div className={styles.EditContentImg}>
                                    <div className={styles.Menudisplay}>
                                        {/* Input สำหรับรูปภาพเมนู */}
                                        {MenuImage ? (
                                            // อันนี้รูปเดิมที่มาจากค่า props ไม่ต้องแก้อะไร
                                            <Image
                                                className={styles.MenuPicContainer}
                                                alt="Menu"
                                                src={MenuImage}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <div className={styles.MenuPicContainer}><BsImages className={styles.Imageicon} />No Picture</div>
                                        )}
                                    </div>
                                    <label>
                                        {/* เป็นส่วนที่มีการเรียกใช้งาน handleFileChange ที่เอาไว้ render รูป ไป get URL รูปตรงฟังก์ชันได้เลย ไม่มีอะไรต้องดึง
                                        ในส่วนนี้*/}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleFileChange} // ฟังก์ชันนี้จะถูกเรียกเมื่อเลือกไฟล์ใหม่
                                            required
                                        />
                                        <div className={styles.Uploadbtn}><BsUpload className={styles.iconUpload} />Upload Picture</div>
                                    </label>
                                </div>


                                <div className={styles.EditContentInput}>
                                    <div className={styles.inputNamefood}>
                                        <span className={styles.titleStyles}>Name :</span>
                                        <input
                                            type="text"
                                            value={editName}
                                            // ให้เอาค่าของ editName ไปอัปเดตตาราง
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Food name"
                                            className={styles.inputContainer}
                                            required />
                                    </div>

                                    {/* Input สำหรับประเภทเมนู */}
                                    <div className={styles.inputNamefood}>
                                        <span className={styles.titleStyles}>Type :</span>
                                        <select
                                            className={styles.optionTextStyles}
                                            value={editType}
                                            onChange={(e) => setEditType(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled> Select Type </option>
                                            {category.data && category.data.map((items, index) => (
                                                <option key={index} value={items.Id}>
                                                    {items.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.inputNamefood}>
                                        <span className={styles.titleStyles}>Price :</span>
                                        <div className={styles.PriceBox}>
                                            <input
                                                type="text"
                                                placeholder="Price"
                                                className={styles.inputContainer}
                                                value={editPrice}
                                                onChange={(e) => {
                                                    setEditPrice(e.target.value);
                                                    handleInput(e);
                                                }}
                                                required
                                            />
                                        </div>
                                        ฿
                                    </div>
                                    {error && <p className={styles.error}>< BsExclamationCircle className={styles.iconExc} />{error}</p>} {/* แสดงคำเตือนหากมี */}
                                </div>
                            </div>
                        )}
                        <div className={styles.clearfix}>
                            {!isSuccess && !isEditSuccess && (
                                <>
                                    <button
                                        type="submit"
                                        className={styles.Confirmbtn}
                                        disabled={isLoading || error} // ปิดปุ่มระหว่างการโหลดหรือตอนที่มี error
                                        onClick={(e) => handleConfirm(e, id)} // เรียกใช้ฟังก์ชัน Confirm เมื่อกดปุ่ม
                                    >
                                        <BsCheckLg className={styles.Checkicon} />
                                        {isLoading ? "Confirming..." : "Confirm"}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.Removebtn}
                                        onClick={() => handleRemove(id)} // ส่ง id ของ Card ที่ต้องการลบ
                                        disabled={isLoading} // ปิดปุ่มระหว่างการโหลด
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




    return (
        <>
            <div className={styles.content}>
                <div className={styles.main_content}>
                    <div className={styles.singleDest}>
                        <div className={styles.dastImage}>
                            {MenuImage ?
                                (<Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover}
                                    width={500}
                                    height={950}
                                />) : (
                                    <div className={styles.MenuPicContainer}><BsImages className={styles.Imageicon} />No Picture</div>
                                )
                            }
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
                                {/* check ว่ามีปุ่ม edit ไหม */}
                                { role === 'owner' ? <button
                                    className={styles.Editfood}
                                    onClick={() => handleEditClick()} >
                                    <BsPencilSquare className={styles.Editicon} />
                                    Edit
                                </button> : ''}
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