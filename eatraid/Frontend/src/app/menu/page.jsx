'use client';
import { useState,useEffect } from 'react';
import styles from './menu.module.css';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import image1 from '../../../public/imgTest4.png';
import image2 from '../../../public/imgTest5.png';
import image3 from '../../../public/imgTest6.png';
import MenuCard from '../../../components/MenuCard';
import { BsChevronDoubleLeft, BsCheckLg, BsChevronDoubleRight, BsPlus, BsXSquareFill, BsUpload, BsImages, BsExclamationCircle, BsCheckCircleFill, BsFillTrashFill } from "react-icons/bs";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from '../../../src/app/config/supabaseClient.js';


// ข้อมูลปลอม
const categoryDropdown = ["fastfood", "dessert", "noodle", "Cooked to order", "beverages", "Japanese", "Western", "Chinese",
    "Local food", "Quick meal", "healthy"]
// ข้อมูลปลอม
// backend ตอนดึงข้อมูลให้ดึงเข้ามาใส่ในตัวแปร data data ตอนนี้เป็นแค่ข้อมูลจำลอง 
// const data = [
    // { id: 1, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 2, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 3, name: 'food C', image: image3, type: 'Western', price: '50' },
    // { id: 4, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 5, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 6, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 7, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 8, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 9, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 10, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 11, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 12, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 13, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 14, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 15, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 16, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 17, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 18, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 19, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 20, name: 'food B', image: image2, type: 'noodle', price: '50' },
    // { id: 21, name: 'food A', image: image1, type: 'noodle', price: '50' },
    // { id: 22, name: 'food B', image: image2, type: 'noodle', price: '50' }
// ];

export default function menu() {
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState([]);
    const [MenuImage, setMenuImage] = useState('');
    const [Imagefile, setImagefile] = useState('');
    const [error, setError] = useState('');
    const [errorImg, setErrorImg] = useState('');
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State สำหรับสถานะการรอ
    const [isAddSuccess, setIsAddSuccess] = useState(false); // State สำหรับการเพิ่มสำเร็จ
    const [formData, setFormData] = useState({ foodname: '', type: '', price: '' });
    const categoryDropdownWithDefault = ["Select type", ...categoryDropdown];
    const [errorMessage, setErrorMessage] = useState('');
    const [category,setCategory] = useState('');

    useEffect(() => {
        const fetchcategoryData = async () => {
            try {
                const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/category`);
                console.log(category.data);
                setCategory(category);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchcategoryData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
                    withCredentials: true, 
                });
                console.log(user.data[0].Id);
                setUserId(user.data[0].Id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []); // Empty array means this runs once on component mount

    useEffect(() => {
        const fetchMenuData = async () => {
            if (!userId) return; // Wait until userId is set before fetching the menu data
            try {
                // Fetch menu data using the userId
                const menu = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showmenu`, {
                    params: { RestaurantId: userId },
                    withCredentials: true,
                });
                console.log(menu.data);
                setData(menu.data);
            } catch (error) {
                console.error('Error fetching menu data:', error);
                // setError('Failed to fetch menu data.');
                alert('Failed to fetch menu data.');
            }
        };
        fetchMenuData();
    }, [userId]); 



    // เอาข้อมูลมาใส่ใช้ตัวแปรนี้นะ เป็นการ check ว่า จะโชว์ปุ่ม edit ไหม
    const Userfromsession = userId
    const OwnerID = data[0]?.RestaurantId
    console.log('User ID : ', Userfromsession)
    console.log('Owner ID : ', OwnerID)

    // จำลองการดึงค่า User ออกมาจาก Session เพื่อนำมาเช็คว่าควรมีปุ่ม edit ไหม ว่าตรงกับ OwnerID หรือเปล่า
    // ฟังก์ชันสำหรับการจัดการรูปภาพ ทำการแสดงภาพเดิม แล้วเมื่อการการ Upload ไฟล์รูปภาพใหม่ก็จะแสดงรูปอันใหม่
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // รับค่ารูปภาพเที่เข้ามาใหม่
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImagefile(file);
            // ใช้ตัวแปร file คือ ตัวแปรเก็บค่ารูป อันนี้คือต้องดึงเข้าไปเก็บที่ back
        }
    }



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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



    // Backend เชื่อม Addmenu ตรงนี้
    // ในการรับข้อมูลให้ใช้ formData.foodname formData.type formData.price ได้เลย
    const handleConfirm = async (e) => {
        e.preventDefault();
        if (!Imagefile) { // เป็นการเช็คว่ามีไฟล์รูปภาพหรือเปล่า
            setErrorImg('Please upload an image.');
            return;
        }

        if (error) return; // ไม่ให้ดำเนินการถ้ามี error

        setIsLoading(true); // ตั้งค่าสถานะกำลังโหลด
        setError(''); // ล้าง error ก่อนเริ่มส่งข้อมูล

        try {
            // จำลองการส่งข้อมูลไปยัง backend
            await new Promise((resolve) => setTimeout(resolve, 2000)); // รอ 2 วินาทีเพื่อจำลองการโหลด

            setIsAddSuccess(true); // ตั้งค่าสถานะสำเร็จ
            setIsLoading(false); // หยุดโหลด
            setErrorMessage(''); // รีเซ็ตข้อความข้อผิดพลาด
            console.log('Add menu name : ', formData.foodname)
            console.log('Add menu type : ', formData.type)
            console.log('Add menu price : ', formData.price)
            setIsAlertModalOpen(false)

        } catch (err) {
            setIsLoading(false); // หยุดโหลดถ้ามีข้อผิดพลาด
            setErrorMessage('Failed to add menu. Please try again.');
        }
    };


    // Modal Add popup
    const renderAlertModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content} onSubmit={(e) => handleConfirm(e, id)}>

                    <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                    <h2 className={styles.headerTextModal}>Add Menu</h2>
                    {isLoading ? (
                        <div>
                            <p className={styles.wait}>loading...</p>
                        </div>
                    ) : isAddSuccess ? (
                        <div className={styles.successContainer}>
                            <p className={styles.SuccessfulText}><BsCheckCircleFill className={styles.CheckSuccess} />Successfully edited!</p>
                        </div>
                    ) : errorMessage ? (
                        <div className={styles.successContainer}>
                            <p className={styles.errorText}><BsExclamationCircle className={styles.iconExc2} />{errorMessage}</p>
                        </div>
                    ) : (
                        // ส่วนของการ input ข้อมูลใหม่ของ User ที่ต้องการ edit 
                        <div className={styles.ContentContainer}>
                            <div className={styles.ContentImg}>
                                <div className={styles.Menudisplay}>
                                    {/* Input สำหรับรูปภาพเมนู */}
                                    {MenuImage ? (
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
                                        name="foodname"
                                        value={formData.foodname}
                                        onChange={handleChange}
                                        placeholder="Food name"
                                        className={styles.inputContainer}
                                        required />
                                </div>

                                {/* Input สำหรับประเภทเมนู */}
                                <div className={styles.inputNamefood}>
                                    <span className={styles.titleStyles}>Type :</span>
                                    <select
                                        className={styles.optionTextStyles}
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        {categoryDropdownWithDefault.map((category, index) => (
                                            <option key={index} value={category === "Select type" ? "" : category} disabled={category === "Select type"}>
                                                {category}
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
                                            name="price"
                                            value={formData.price}
                                            onChange={(e) => {
                                                handleInput(e);
                                                handleChange(e);
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
                    {errorImg ? (
                        <p className={styles.errorImg}>
                            <BsExclamationCircle className={styles.iconExc} />
                            {errorImg}
                        </p>
                    ) : null}
                    <div className={styles.clearfix}>
                        {!isAddSuccess && (
                            <>
                                <button
                                    type="submit"
                                    className={styles.Confirmbtn}
                                    disabled={isLoading || error || errorImg} // ปิดปุ่มระหว่างการโหลดหรือตอนที่มี error
                                    onClick={(e) => handleConfirm(e)} // เรียกใช้ฟังก์ชัน Confirm เมื่อกดปุ่ม
                                >
                                    {isLoading ? "Adding..." : "Add"}
                                </button>
                                <button
                                    type="button"
                                    className={styles.Canclebtn}
                                    onClick={() => setIsAlertModalOpen(false)}
                                    disabled={isLoading} // ปิดปุ่มระหว่างการโหลด
                                >
                                    {isLoading ? "Cancle" : "Cancle"}
                                </button>
                            </>
                        )}
                    </div>

                </form>
            </div>
        );
    };


    // Pagination settings
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Number of items to show per page

    // Calculate the items to display based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Handle page changes
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate the page numbers
    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.Favourite_wrapper}>
                    <div className={styles.header}>
                        <div className={styles.headerText}>
                            Menu
                        </div>
                        <div className={styles.AddContainer}>
                            <button
                                className={styles.Addbtn}
                                onClick={() => setIsAlertModalOpen(true)}>
                                <BsPlus className={styles.Plusicon} />Add Menu
                            </button>
                        </div>
                    </div>

                    {currentItems.length > 0 ? (
                        <div className={styles.content_grid}>
                            {/* backend มาเชื่อมให้ใส่ข้อมูล restaurant.(ชื่อคอลัมน์) นะ */}
                            {currentItems.map((restaurant) => (
                                <MenuCard
                                    key={restaurant.Id}
                                    id={restaurant.Id}
                                    img={restaurant.MenuPic ? restaurant.MenuPic : null} 
                                    name={restaurant.NameFood}
                                    type={restaurant.Type.Name}
                                    price={restaurant.Price}
                                    owner={OwnerID}
                                    user={Userfromsession}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.content_empty}>
                            <p className={styles.emptyMessage}>No menu added yet.</p>
                        </div>
                    )}
                    {/* Pagination Controls */}
                    {data.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                <BsChevronDoubleLeft className={styles.Arrow} />
                            </button>

                            {renderPageNumbers()}

                            <button
                                className={styles.pageButton}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <BsChevronDoubleRight className={styles.Arrow} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isAlertModalOpen && renderAlertModal()}
        </div>
    );
}