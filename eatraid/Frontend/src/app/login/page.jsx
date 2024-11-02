'use client';
import axios from 'axios';
import styles from './login.module.css';
import image1 from '../../../public/LOGO.png';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { BsExclamationCircle, BsArrowLeft } from "react-icons/bs";
import { redirect, useRouter } from "next/navigation";
import { NEXT_PUBLIC_BASE_API_URL, NEXT_PUBLIC_BASE_WEB_URL } from '../../../src/app/config/supabaseClient.js';
import session from '../../../session';
import { json } from 'react-router-dom';



export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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
            await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/login`, {
                email: formData.email,
                password: formData.password
            }, { withCredentials: true }).then((res) => {
                console.log("Login success", res.data.user.id);
            });

            const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
                withCredentials: true,
            });

            const user = response.data[0];
            const role = user.Role
            console.log("Info:", user);
            console.log("role:", role);
            setIsLoading(true);
            if (role === 'owner') {
                router.push(`${NEXT_PUBLIC_BASE_WEB_URL}/info`);
            } else {
                router.push(`${NEXT_PUBLIC_BASE_WEB_URL}`);
            }

            
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
        }
    };



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.main}>
            <Navbar></Navbar>
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
                                    className={`${styles.Loginbtn} ${isLoading ? styles.loading : ''}`}
                                    disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Log in'}
                                </button>
                            </div>
                        </form>
                        <div className={styles.last_Login_container}>
                            <p>
                                Don't have an account?
                            </p>
                            <Link href={`/signUpRole`} className={styles.Signup_link} >
                                Sign up
                            </Link>
                        </div>
                    </div>
                    <div className={styles.Login_pic_wrapper}>
                        <div className={styles.logoPicture}>
                            <Image src={image1}
                                width={800}
                                height={500}
                                className={styles.logoimg}
                                alt="Logo" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}