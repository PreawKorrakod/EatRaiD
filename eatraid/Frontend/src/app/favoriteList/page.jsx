'use client';
import { useState,useEffect } from 'react';
import styles from './favouriteList.module.css';
import Navbar from '../../../components/Navbar';
import RestaurantCard from '../../../components/RestaurantCard';
import image1 from '../../../public/imgTest2.png';
import image2 from '../../../public/imgTest3.png';
import image3 from '../../../public/imgTest1.png';
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import axios from 'axios';
import { NEXT_PUBLIC_BASE_API_URL } from "../../app/config/supabaseClient";
import Image from 'next/image';
import Footer from '../../../components/footer';


// ข้อมูลปลอม
// backend นำข้อมูลมาใส่ตรง ตัวแปร data เลยนะ

const type = ['ABCDEFG','B','D']

export default function FavoriteList() {
    // Pagination settings
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Number of items to show per page
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/get-fav-list`, { withCredentials: true });
                console.log('Success:', response.data);
                console.log('type',response.data[0].Restaurant.Menu);
                setData(response.data); // เก็บข้อมูลที่ได้รับ
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Calculate the items to display based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleDelete = (restaurantId) => {
        setData((prevData) => prevData.filter((restaurant) => restaurant.RestaurantId !== restaurantId));
    };

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
                        Favorite List
                    </div>
                    {currentItems.length > 0 ? (
                        <div className={styles.content_grid}>
                            {/* backend มาเชื่อมให้ใส่ข้อมูล restaurant.(ชื่อคอลัมน์) นะ */}
                            {currentItems.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.RestaurantId}
                                    id={restaurant.RestaurantId}
                                    img={restaurant.User?.ProfilePic ? restaurant.User.ProfilePic : "https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/Menu/Menu_4_8034dbe4-bbdf-40b6-9b8e-fe7691ad9500.jpeg"}
                                    name={restaurant.Restaurant?.Name}
                                    type={restaurant.Restaurant?.Menu?.map((menu) => menu.Type?.Name)}
                                    onRemove={handleDelete} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.content_empty}>
                              <p className={styles.emptyMessage}>No favorite restaurants added yet.</p>
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
            <Footer></Footer>
        </div>
    );
}