'use client';
import styles from './login.module.css';
import imageSide from '../../../public/DecPic.png';
import Topbar from '../../../components/Topbar';
import Link from 'next/link';
import Image from 'next/image';

export default function login() {
    return (
        <div className={styles.main}>
            <Topbar></Topbar>
            <div className={styles.container}>
                <div className={styles.From_Login}>
                    <div className={styles.From_Login_header}>
                        Log in
                    </div>
                    <div className={styles.From_Login_input}>
                        <div className={styles.From_Login_input_Email}>
                            <input className={styles.Loginblock}
                                placeholder="Email"
                                type="text"
                                name="username"
                                // value={formData.username}
                                // onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.From_Login_input_Password}>
                            <input className={styles.Loginblock}
                                placeholder="Password"
                                type="password"
                                name="password"
                                // value={formData.password}
                                // onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.Loginbtn_wrapper}>
                        <button className={styles.Loginbtn}>
                            Log in
                        </button>
                    </div>
                    <div className={styles.last_Login_container}>
                        <p>
                            Don't have an account?
                        </p>
                        <Link href={`/signup`}>
                            Sign up
                        </Link>
                    </div>
                </div>
                <div className={styles.Login_Picture}>
                    <Image></Image>
                </div>
            </div>
        </div>
    )
}