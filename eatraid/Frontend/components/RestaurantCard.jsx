'use client';
import styles from './RestaurantCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsHeartFill,BsHeart } from "react-icons/bs";


const RestaurantCard = (props) => {
    const { img, name, id } = props;
    return (
        <Link href={`/ProfileRestaurant/${id}`} className={styles.link_blog}>
            <div className={styles.content}>
                <div className={styles.main_content}>
                    <div className={styles.singleDest}>
                        <div className={styles.dastImage}>
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} />
                        </div>
                        <div className={styles.destFooter}>
                            <div className={styles.destText}>
                                {name}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;