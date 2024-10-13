'use client';
import styles from './footer.module.css';
import logo from '../public/LOGO.png';
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';



export default function Footer() {
    
    return (
        <div className={styles.main}>
            <div className={styles.upperFooter}>
                <div className={styles.ContactUS_container}>
                    <div className={styles.titleContact}>
                        <p className={styles.title}>Contact Us</p>
                    </div>
                    <div className={styles.Contact_wrapper}>
                        <FaPhone className={styles.ContactIcon} />
                        <p className={styles.ConatactText}>XX-XXXX-XXXX</p>
                    </div>
                    <div className={styles.Contact_wrapper}>
                        <MdMail className={styles.ContactIcon} />
                        <p className={styles.ConatactText}>Eatraid_Contact@email.com</p>
                    </div>
                    <Link href='https://www.kmutnb.ac.th/' className={styles.Location_wrapper}>
                        <FaLocationDot className={styles.ContactIcon} />
                        <p className={styles.ConatactText}>King Mongkut's University of Technology North Bangkok</p>
                    </Link>
                </div>
                <div className={styles.logo_container}>
                    <div className={styles.ImageCover}>
                        <Image src={logo} alt='EatraidLOGO' className={styles.imageLOGO} width={1000} height={1500} />
                    </div>
                </div>
            </div>
            <div className={styles.lowerFooter}>
                <div>Copyright © 2024 EatraiD App. All rights reserved.</div>
            </div>
        </div>
    )
}