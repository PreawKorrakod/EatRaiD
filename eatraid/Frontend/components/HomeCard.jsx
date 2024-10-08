'use client';
import styles from './HomeCard.module.css'
import Image from 'next/image';

const HomeCard = (props) => {
    const { id, img, name, type } = props;

    return (
        <div className={styles.card}>
            <div className={styles.main_content}>
                <div className={styles.singleDest}>

                    <div className={styles.dastImage}>
                        <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={300} height={200} />
                    </div>

                    <div className={styles.dastFooter}>
                        <div className={styles.destText}>
                            <p>{name}</p>
                        </div>
                        <div className={styles.showType}>
                            {type.map((t, index) => (
                                <span key={index} className={styles.typeComponent}>{t}</span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default HomeCard;