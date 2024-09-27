'use client';
import axios from 'axios';
import styles from './login.module.css';
import image1 from '../../../public/DecPic1.png';
import Topbar from '../../../components/Topbar';
import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { BsExclamationCircle, BsArrowLeft } from "react-icons/bs";
import { redirect, useRouter } from "next/navigation";

import { NEXT_PUBLIC_BASE_API_URL, NEXT_PUBLIC_BASE_WEB_URL } from '../../../src/app/config/supabaseClient.js';
import session from '../../../session';
import { json } from 'react-router-dom';
// import { General, supabase } from '../../../session';


export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();
    // const navigate = useNavigate();

    // const { session } = useContext(General);

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
            const res = await axios.post(`${NEXT_PUBLIC_BASE_API_URL}/login`, {
                email: formData.email,
                password: formData.password
            }, { withCredentials: true }); // for sending cookies

            if (res.data.accessToken) {
                console.log("Login success", res.data.user.id);
                // localStorage.setItem('accessToken',res.data.accessToken);
            }

            await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/getuserdata`, {
                headers: {
                    "Authorization": `Bearer ${res.data.accessToken}`
                }
            }).then((response) => {
                // localStorage.setItem('accessToken',res.data.accessToken);
                console.log("User_Data", response.data[0]);
                console.log("Role", response.data[0].Role);
                const role = response.data[0].Role;

                if (role === 'owner') {
                    router.push(`${NEXT_PUBLIC_BASE_WEB_URL}/info`);
                } else if (role === 'customer') {
                    router.push(`${NEXT_PUBLIC_BASE_WEB_URL}`);
                }


            });

        } catch (error) {
            console.log(error);
            // console.error('Error during login:', error);
            setError('Your email or password is incorrect. Try again.');
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
                            <Link href={`/signUpRole`} className={styles.Signup_link} >
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