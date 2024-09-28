'use client';
import { useState } from 'react';
import styles from './menu.module.css';
import Navbar from '../../../components/Navbar';
import image1 from '../../../public/imgTest4.png';
import image2 from '../../../public/imgTest5.png';
import image3 from '../../../public/imgTest6.png';
import MenuCard from '../../../components/MenuCard';
import { BsChevronDoubleLeft, BsCheckLg,BsChevronDoubleRight, BsPlus,BsXSquareFill,BsUpload,BsImages,BsExclamationCircle,BsCheckCircleFill,BsFillTrashFill   } from "react-icons/bs";


const categoryDropdown = ["fastfood", "dessert", "noodle", "Cooked to order", "beverages", "Japanese", "Western", "Chinese",
    "Local food", "Quick meal", "healthy"]
// ข้อมูลปลอม
// backend นำข้อมูลมาใส่ตรง ตัวแปร data เลยนะ
const data = [
    { id: 1, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 2, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 3, name: 'food C', image: image3, type: 'Western', price: '50' },
    { id: 4, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 5, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 6, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 7, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 8, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 9, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 10, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 11, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 12, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 13, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 14, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 15, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 16, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 17, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 18, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 19, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 20, name: 'food B', image: image2, type: 'noodle', price: '50' },
    { id: 21, name: 'food A', image: image1, type: 'noodle', price: '50' },
    { id: 22, name: 'food B', image: image2, type: 'noodle', price: '50' }
];

export default function menu() {

    const [MenuImage, setMenuImage] = useState('');
    const [Imagefile, setImagefile] = useState('');
    const [error, setError] = useState('');
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State สำหรับสถานะการรอ
    const [isAddSuccess, setIsAddSuccess] = useState(false); // State สำหรับการเพิ่มสำเร็จ
    const [formData, setFormData] = useState({ foodname: '', type: '',price:'' });

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
            // ใช้ตัวแปร Imagefile คือ ตัวแปรเก็บค่ารูป อันนี้คือต้องดึงเข้าไปเก็บที่ back
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
        setInputValue(value.replace(/[^0-9]/g, ''));
    };

    // Modal edit popup
    const renderAlertModal = () => {
        return (
            <div id="logoutModal" className={styles.modal}>
                <form className={styles.modal_content} onSubmit={(e) => handleConfirm(e, id)}>
                    <div className={styles.container}>
                        <BsXSquareFill className={styles.close} onClick={() => setIsAlertModalOpen(false)} />
                        <h2 className={styles.headerTextModal}>Add Menu</h2>
                        {isLoading ? (
                            <p className={styles.wait}>Please wait...</p> // แสดงข้อความ "Please wait" เมื่ออยู่ระหว่างการโหลด
                        ) : isAddSuccess ? (
                            <div className={styles.successContainer}>
                                <p className={styles.SuccessfulText}><BsCheckCircleFill className={styles.CheckSuccess} />Successfully edited!</p>
                            </div>
                        ) : (
                            // ส่วนของการ input ข้อมูลใหม่ของ User ที่ต้องการ edit 
                            <div className={styles.EditContentContainer}>
                                <div className={styles.EditContentImg}>
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
                                            {categoryDropdown.map((category, index) => (
                                                <option key={index} value={category}>
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
                                                    setEditPrice(e.target.value);
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
                        <div className={styles.clearfix}>
                            {!isAddSuccess && (
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

    const OwnerID = 'ABCD'
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
                                <BsPlus className={styles.Plusicon}/>Add Menu
                            </button>
                        </div>
                    </div>

                    {currentItems.length > 0 ? (
                        <div className={styles.content_grid}>
                            {/* backend มาเชื่อมให้ใส่ข้อมูล restaurant.(ชื่อคอลัมน์) นะ */}
                            {currentItems.map((restaurant) => (
                                <MenuCard
                                    key={restaurant.id}
                                    id={restaurant.id}
                                    img={restaurant.image}
                                    name={restaurant.name}
                                    type={restaurant.type}
                                    price={restaurant.price}
                                    owner={OwnerID}
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