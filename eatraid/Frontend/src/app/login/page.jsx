'use client';
import styles from './login.module.css';
import image1 from '../../../public/DecPic1.png';
import Topbar from '../../../components/Topbar';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { BsExclamationCircle,BsArrowLeft } from "react-icons/bs";

export default function login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!formData.email || !formData.password) {
            setError('Please fill in both email and password.');
            return;
        }

        // Reset error message
        setError('');

        // Backend
        try {
            // ตัวอย่างการจำลอง error จาก backend หากข้อมูลไม่ถูกต้อง
            const loginSuccessful = false; // แทนการเช็ค backend

            if (!loginSuccessful) {
                setError('Your email or password is incorrect. Try again.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.main}>
            <Topbar></Topbar>
            <div className={styles.content_wrapper}>
                <div className={styles.container}>
                    <Link href={`/`}>
                        <BsArrowLeft className={styles.back_icon} />
                    </Link>
                    <div className={styles.From_Login}>
                        <div className={styles.From_Login_header}>
                            Log in
                        </div>
                        <form className={styles.From_Login_input} onSubmit={handleSubmit}>
                            Email
                            <div className={styles.From_Login_input_Email}>
                                <input className={styles.Loginblock}
                                    placeholder="Email"
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            Password
                            <div className={styles.From_Login_input_Password}>
                                <input className={styles.Loginblock}
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {error && (
                                <div className={styles.ErrorChecking}>
                                    <BsExclamationCircle className={styles.Alerticon} />
                                    {error}
                                </div>
                            )}
                            <div className={styles.Loginbtn_wrapper}>
                                <button
                                    type="submit"
                                    className={styles.Loginbtn}>
                                    Log in
                                </button>
                            </div>
                        </form>
                        <div className={styles.last_Login_container}>
                            <p>
                                Don't have an account?
                            </p>
                            <Link href={`/signup`} className={styles.Signup_link} >
                                Sign up
                            </Link>
                        </div>
                    </div>
                    <div className={styles.Login_Picture}>
                        <Image src={image1}
                            width={500}
                            height={500}
                            objectFit="cover" />
                    </div>
                </div>
            </div>
        </div>
    );
}