'use client';
import styles from './RestaurantCard.module.css';
import Link from 'next/link';


const RestaurantCard = (props) => {
    const { img, title, name } = props;
    return (
        <Link href={`/ProfileRestaurant/${name}`} className={styles.link_blog}>
            <div className={styles.content}>
                <div className={styles.main_content}>

                    <div className={styles.singleDest}>
                        <div className={styles.dastImage}>
                            <img src={img} alt="" className={styles.Imagecover} />
                        </div>
                        <div className={styles.destFooter}>
                            <div className={styles.destText}>
                                {title}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;