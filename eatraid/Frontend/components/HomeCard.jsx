'use client';
import styles from './HomeCard.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { MdLocationOn } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";


const HomeCard = (props) => {
    const { id, img, name, type, distance } = props;

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
                        <div className={styles.showDistance}>
                            <MdLocationOn className={styles.LocationIcon}/>{distance} km
                        </div>
                    </div>

                    <div className={styles.LinkResBtn}>
                        <Link href= {`restaurant/${id}`} className={styles.LinkBtn}>
                            More Details <BsArrowRight className={styles.iconMorDetail} />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default HomeCard;