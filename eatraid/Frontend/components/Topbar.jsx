'use client';

import styles from './Topbar.module.css';
import Link from 'next/link';

export default function Topbar() {
    return (
        <div className={styles.AllBar}>
            <div className={styles.Leftside}>
                <Link href={`/`} className={styles.Logo}>
                    EatRaiD
                </Link>
            </div>
        </div>
    )
}