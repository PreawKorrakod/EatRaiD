"use client";
import styles from "./signupUser.module.css";
import image1 from "../../../public/DecPic1.png";
import Topbar from "../../../components/Topbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BsX, BsCheck, BsArrowLeft } from "react-icons/bs";

export default function signupUser() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const minPasswordLength = 6;

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const isPasswordValid = password.length >= minPasswordLength;
    const isPasswordMatching = password === confirmPassword && isPasswordValid;

    return (
        <div className={styles.main}>
            <Topbar></Topbar>
            <div className={styles.content_wrapper}>
                <div className={styles.container}>
                    <Link href={`/SignupRole`}>
                        <BsArrowLeft className={styles.back_icon} />
                    </Link>
                    <div className={styles.From_Login}>
                        <div className={styles.From_Login_header}>Sign up - User</div>
                        <form className={styles.From_Login_input}>
                            Email
                            <div className={styles.From_Login_input_Email}>
                                <input
                                    className={styles.Loginblock}
                                    placeholder="Email"
                                    type="text"
                                    name="email"
                                    required
                                />
                            </div>
                            Password
                            <div className={styles.From_Login_input_Password}>
                                <input
                                    className={styles.Loginblock}
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <div className={styles.passwordCheckIcon}>
                                    {isPasswordValid ? (
                                        <>
                                            <BsCheck className={styles.checkIcon} />
                                            <p className={styles.passwordSuccess}>
                                                Password is valid.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <BsX className={styles.xIcon} />
                                            <p className={styles.passwordWarning}>
                                                {minPasswordLength - password.length} more character(s)
                                                needed.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            Confirm Password
                            <div className={styles.From_Login_input_ConfirmPassword}>
                                <input
                                    className={styles.Loginblock}
                                    placeholder="Confirm Password"
                                    type="password"
                                    name="confirm_password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                                <div className={styles.passwordCheckIcon}>
                                    {/* แสดงผลเมื่อเริ่มกรอก confirmPassword */}
                                    {confirmPassword && (
                                        isPasswordMatching ? (
                                            <>
                                                <BsCheck className={styles.checkIcon} />
                                                <p className={styles.passwordSuccess}>
                                                    Passwords match.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <BsX className={styles.xIcon} />
                                                <p className={styles.passwordWarning}>
                                                    Passwords do not match.
                                                </p>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className={styles.Loginbtn_wrapper}>
                                <button
                                    type="submit"
                                    className={styles.Loginbtn}
                                    disabled={password.length < minPasswordLength || !isPasswordMatching}
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                        <div className={styles.last_Login_container}>
                            <p>Already have an account?</p>
                            <Link href={`/login`} className={styles.Signup_link}>
                                Log in
                            </Link>
                        </div>
                    </div>
                    <div className={styles.Login_Picture}>
                        <Image src={image1} alt="Sign-up illustration" className={styles.imageSide} />
                    </div>
                </div>
            </div>
        </div>
    );
}
