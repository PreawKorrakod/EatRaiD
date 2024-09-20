'use client';
import styles from './login.module.css';
import image1 from '../../../public/DecPic1.png';
import Topbar from '../../../components/Topbar';
import Link from 'next/link';
import Image from 'next/image';

export default function login() {

    // เมื่อผู้ใช้พิมพ์ข้อมูลในช่อง input ข้อมูลจะถูกเก็บอยู่ใน formData
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // ฟังก์ชันนี้ทำงานเมื่อมีการเปลี่ยนแปลงในช่อง input (email/password)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Backend
        try {

        } catch (error) {

        }
    };

    return (
        <div className={styles.main}>
            <Topbar></Topbar>
            <div className={styles.content_wrapper}>
                <div className={styles.container}>
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
                                    name="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </form>
                        <div className={styles.Loginbtn_wrapper}>
                            <button
                                type='submit'
                                className={styles.Loginbtn}>
                                Log in
                            </button>
                        </div>
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
                            objectFit="cover" ></Image>
                    </div>
                </div>
            </div>
        </div>
    )
}