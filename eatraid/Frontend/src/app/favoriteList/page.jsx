'use client';
import styles from './favouriteList.module.css';
import Navbar from '../../../components/Navbar';
import RestaurantCard from '../../../components/RestaurantCard';
import image1 from '../../../public/imgTest2.png';
import image2 from '../../../public/imgTest3.png';
import image3 from '../../../public/imgTest1.png';

const data ={

}

export default function favoriteList() {
    return (
        <div className={styles.main}>
            <Navbar></Navbar>
            <div className={styles.container}>
                <div className={styles.Favourite_wrapper}>
                    <div className={styles.header}>
                        Favorite List
                    </div>
                    <div className={styles.content_grid}>
                        <RestaurantCard 
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
