'use client';
import styles from './HomeCard.module.css'
import Image from 'next/image';

const HomeCard = (props) => {
    const { id, img, name } = props;

    return (
        <div className={styles.card}>
            <div className={styles.main_content}>
                <div className={styles.singleDest}>

                    <div className={styles.dastImage}>
                        <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={300} height={200} />
                    </div>

                    <div className={styles.dastFooter}>
                        <div className={styles.link_blog2}>
                            <div className={styles.destText}>
                                <p>{name}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default HomeCard;