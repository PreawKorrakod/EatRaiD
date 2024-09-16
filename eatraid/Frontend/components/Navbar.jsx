import styles from './Navbar.module.css'
import Link from 'next/link'

export default function Navbar() {
    return (
        <div className={styles.AllBar}>
            <div className={styles.Leftside}>
                <div className={styles.Logo}>

                </div>
            </div>
            <div className={styles.Rightside}>
                <Link href={`/`}>
                    <span>
                        Home
                    </span>
                </Link>
                <Link href={`/`}>
                    <button>
                        Login
                    </button>
                </Link>
            </div>
        </div>
    )
}
