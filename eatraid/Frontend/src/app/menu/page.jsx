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
    { id: 1, name: 'Restaurant A', image: image1, type:'noodle',price:'50' },
    { id: 2, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 3, name: 'Restaurant C', image: image3, type:'noodle',price:'50'  },
    { id: 4, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 5, name: 'Restaurant B', image: image2, type:'noodle',price:'50' },
    { id: 6, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 7, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 8, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 9, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 10, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 11, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 12, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 13, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 14, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 15, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 16, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 17, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 18, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 19, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 20, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  },
    { id: 21, name: 'Restaurant A', image: image1, type:'noodle',price:'50'  },
    { id: 22, name: 'Restaurant B', image: image2, type:'noodle',price:'50'  }
];

export default function FavoriteList() {
    // Pagination settings
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of items to show per page

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
                                    img={restaurant.image}
                                    name={restaurant.name}
                                    type={restaurant.type}
                                    price={restaurant.price}
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