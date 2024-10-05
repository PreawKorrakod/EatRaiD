'use client';
import { useState, useEffect } from 'react';
import styles from './menu.module.css';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import MenuCard from '../../../components/MenuCard';
import { BsChevronDoubleLeft, BsCheckLg, BsChevronDoubleRight, BsPlus, BsXSquareFill, BsUpload, BsImages, BsExclamationCircle, BsCheckCircleFill, BsFillTrashFill } from "react-icons/bs";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from '../../../src/app/config/supabaseClient.js';



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
    const [errorMessage, setErrorMessage] = useState('');
    const [category, setCategory] = useState('');
    const [isUpdated, setIsUpdated] = useState(false); // เพิ่ม state นี้
    const [isAdd, setIsAdd] = useState(false); // เพิ่ม state นี้


    useEffect(() => {
        const fetchcategoryData = async () => {
            try {
                const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/category`);
                // console.log(category.data);
                setCategory(category.data);
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
                // console.log(user.data[0].Id);
                setUserId(user.data[0].Id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const fetchMenuData = async () => {
            if (!userId) return; // Wait until userId is set before fetching the menu data
            try {
                // Fetch menu data using the userId
                const menu = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showmenu`, {
                    params: { RestaurantId: userId },
                    withCredentials: true,
                });
                // console.log(menu.data);
                setData(menu.data);

                return () => {
                    setIsUpdated(false);
                    setIsAdd(false);
                };

            } catch (error) {
                console.error('Error fetching menu data:', error);
                // setError('Failed to fetch menu data.');
                alert('Failed to fetch menu data.');
            }
        };
        fetchMenuData();
    }, [userId, isAdd, isUpdated]); // เพิ่ม isUpdated ใน dependencies นี้

    const handleaddMenu = () => {
        setIsAdd(prev => !prev);
    };

    const handleMenuUpdate = (id, name, price, type, img) => {
        setData(prevData =>
            prevData.map(item =>
                item.Id === id ? { ...item, NameFood: name, Price: price, Type: type, MenuPic: img } : item
            )
        );
        setIsUpdated(prev => !prev);
    };



    // เอาข้อมูลมาใส่ใช้ตัวแปรนี้นะ เป็นการ check ว่า จะโชว์ปุ่ม edit ไหม
    const Userfromsession = userId
    const OwnerID = data[0]?.RestaurantId
    // console.log('User ID : ', Userfromsession)
    // console.log('Owner ID : ', OwnerID)

    const handleDelete = (restaurantId) => {
        setData((prevData) => prevData.filter((restaurant) => restaurant.Id !== restaurantId));
    };




    // จำลองการดึงค่า User ออกมาจาก Session เพื่อนำมาเช็คว่าควรมีปุ่ม edit ไหม ว่าตรงกับ OwnerID หรือเปล่า
    // ฟังก์ชันสำหรับการจัดการรูปภาพ ทำการแสดงภาพเดิม แล้วเมื่อการการ Upload ไฟล์รูปภาพใหม่ก็จะแสดงรูปอันใหม่
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImagefile(file);
            setErrorImg(''); // เคลียร์ error รูปภาพเมื่ออัปโหลดรูปใหม่
        }
    };




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // เคลียร์ error เมื่อมีการแก้ไขข้อมูล
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
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        // ตรวจสอบว่ามีไฟล์รูปภาพหรือไม่
        if (!Imagefile) {
            setErrorImg('Please upload an image.');
            return;
        }

        // ตรวจสอบข้อมูลอื่นๆ
        if (!formData.foodname || !formData.type || !formData.price) {
            setError('Please fill in all the fields.');
            return;
        }

        setIsLoading(true); // เริ่มการโหลด

        // สร้าง FormData สำหรับการอัปโหลดข้อมูลและไฟล์
        const formDataToSend = new FormData();
        formDataToSend.append('file', Imagefile); // ฟิลด์นี้ต้องตรงกับที่เซิร์ฟเวอร์คาดหวัง
        formDataToSend.append('RestaurantId', userId);
        formDataToSend.append('NameFood', formData.foodname);
        formDataToSend.append('TypeID', formData.type);
        formDataToSend.append('Price', formData.price);

        
        setErrorMessage(''); // รีเซ็ตข้อความข้อผิดพลาดก่อนเริ่ม
        setIsAddSuccess(false); // เริ่มจาก false เพื่อแน่ใจว่าไม่แสดงผลก่อนเวลา

        try {
            const addmenu = await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/addmenu`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            // อัปเดต data หลังเพิ่มเมนูสำเร็จ
            setData(prevData => [...prevData, {
                Id: addmenu.data.data[0].Id,
                NameFood: formData.foodname,
                Price: formData.price,
                Type: formData.type,
                MenuPic: addmenu.data.data[0].MenuPic
            }]);


            setIsLoading(true); // เริ่มการโหลด
            await new Promise((resolve) => setTimeout(resolve, 2000)); 
        
            setIsLoading(false); // หยุดการโหลด
            setIsAddSuccess(true); // แสดงข้อความเพิ่มเมนูสำเร็จ

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setErrorMessage(''); // รีเซ็ตข้อความข้อผิดพลาด
            setTimeout(() => {
                setIsAddSuccess(false); // ซ่อนข้อความ "Add success" หลังจากเวลาผ่านไป
                setIsAlertModalOpen(false);
            }, 2000); // ซ่อนข้อความหลังจาก 2 วินาที

            
            handleaddMenu();
            // รีเซ็ตข้อมูลฟอร์ม
            setFormData({ foodname: '', type: '', price: '' });
            setMenuImage('');
            setImagefile(null);


        } catch (err) {
            setIsLoading(false); // หยุดการโหลดถ้ามีข้อผิดพลาด
            setErrorMessage('Failed to add menu. Please try again.');
        }
    };
    

    // Modal Add popup
    const renderAlertModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content} onSubmit={handleConfirm}>

                    <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                    <h2 className={styles.headerTextModal}>Add Menu</h2>
                    {isLoading ? (
                        <div>
                            <p className={styles.wait}>Please wait...</p>
                        </div>
                    ) : errorMessage ? (
                        <div className={styles.successContainer}>
                            <p className={styles.errorText}><BsExclamationCircle className={styles.iconExc2} />{errorMessage}</p>
                        </div>
                    ) : isAddSuccess ? (
                        <div className={styles.successContainer}>
                            <p className={styles.SuccessfulText}><BsCheckCircleFill className={styles.CheckSuccess} />New Menu Added!</p>
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
                                        <option value="" disabled>Select Type</option>
                                        {category && category.map((items, index) => (
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
                                    disabled={isLoading || error || errorImg} // ปิดปุ่มเฉพาะเมื่อมีการโหลด หรือยังมี error อยู่
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
                                    onEdit={handleMenuUpdate}
                                    onRemove={handleDelete}
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