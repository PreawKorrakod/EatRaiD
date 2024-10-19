'use client';
import styles from './HomeCard.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { MdLocationOn } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import Tooltip from '@mui/material/Tooltip';


const HomeCard = (props) => {
    const { id, img, name, type, distance } = props;

    return (

        <div className={styles.main_content}>
            <Tooltip title={type.join(', ')} placement="top">
                <div className={styles.singleDest}>

                    <div className={styles.dastImage}>
                        <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={2300} height={2200} />
                    </div>

                    <div className={styles.dastFooter}>
                        <div className={styles.destText}>
                            <p>{name}</p>
                        </div>

                        <div className={styles.showType}>
                            {type.slice(0, 2).map((t, index) => (
                                <span key={index} className={styles.typeComponent}>{t}</span>
                            ))}
                            {type.length > 2 && <span className={styles.moreText}>+{type.length - 2} more</span>}
                        </div>

                        {distance === "N/A" ? '' : (
                            <div className={styles.showDistance}>
                                <MdLocationOn className={styles.LocationIcon} />{distance} km
                            </div>
                        )}
                    </div>

                    <div className={styles.LinkResBtn}>
                        <Link href={`restaurant/${id}`} className={styles.LinkBtn}>
                            More Details <BsArrowRight className={styles.iconMorDetail} />
                        </Link>
                    </div>

                </div>
            </Tooltip>
        </div>

    )
}
export default HomeCard;