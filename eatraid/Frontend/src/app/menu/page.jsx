'use client';
import { useState } from 'react';
import styles from './menu.module.css';
import Navbar from '../../../components/Navbar';
import image1 from '../../../public/imgTest4.png';
import image2 from '../../../public/imgTest5.png';
import image3 from '../../../public/imgTest6.png';
import MenuCard from '../../../components/MenuCard';
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

// ข้อมูลปลอม
// backend นำข้อมูลมาใส่ตรง ตัวแปร data เลยนะ
const data = [
    { id: 1, name: 'food A', image: image1, type:'noodle',price:'50' },
    { id: 2, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 3, name: 'food C', image: image3, type:'Western',price:'50'  },
    { id: 4, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 5, name: 'food B', image: image2, type:'noodle',price:'50' },
    { id: 6, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 7, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 8, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 9, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 10, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 11, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 12, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 13, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 14, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 15, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 16, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 17, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 18, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 19, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 20, name: 'food B', image: image2, type:'noodle',price:'50'  },
    { id: 21, name: 'food A', image: image1, type:'noodle',price:'50'  },
    { id: 22, name: 'food B', image: image2, type:'noodle',price:'50'  }
];

export default function menu() {

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
                        Menu
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
                                    owner ={OwnerID}
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
        </div>
    );
}