'use client';
import logo from '../public/LOGO.png';
import styles from './Topbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Topbar() {
    return (
        <div className={styles.AllBar}>
            <div className={styles.Leftside}>
                <Link href={`/`} className={styles.logotitle}>
                    <div className={styles.Logo}>
                        <Image src={logo} alt='logoEatraiD' width={1000} height={1000} className={styles.logoImage} />
                    </div>
                </Link>
                <Link href={`/`} className={styles.LinkText}>
                    <h1 className={styles.logotext}>EaiRaiD</h1>
                </Link>
            </div>
        </div>
    )
}