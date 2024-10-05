"use client";
import React, { useState, useEffect } from "react";
import styles from "./signupdetail.module.css";
import { BsChevronDown } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Topbar from "../../../components/Topbar";
import { useRouter } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

const categoryDropdown = ["Thai", "Japanese"]; //from backend
const time_hr = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const time_min = ["00", "15", "30", "45"];
const businessDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SignupDetail() {

  const [category, setCategory] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchcategoryData = async () => {
      try {
        const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/category`);
        // console.log(category.data);
        setCategory(category.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchcategoryData();
  }, []);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      console.log(JSON.parse(storedUserData));
    } else {
      router.push("/");  // Redirect to home if no user ID
    }
  }, []);

  // if (!userID) return router.push("/");  // กลับหน้า Home

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(categoryDropdown[0]);
  const [openTimeHR, setOpenTimeHR] = useState(time_hr[0]);
  const [openTimeMIN, setOpenTimeMIN] = useState(time_min[0]);
  const [closeTimeHR, setCloseTimeHR] = useState(time_hr[0]);
  const [closeTimeMIN, setCloseTimeMIN] = useState(time_min[0]);
  const [selectedBusinessDays, setSelectedBusinessDays] = useState(
    new Array(businessDays.length).fill(true)
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [Imagefile, setImagefile] = useState("");

  const [NameOwner, setNameOwner] = useState(""); //เก็บชื่อที่ตัวแปร NameOwner
  const [numberPhone, setNumberPhone] = useState(""); //เก็บเบอร์ที่ตัวแปร numberPhone
  const [LineContact, setLineContact] = useState(""); // เก็บไลน์ที่ตัวแปร numberPhone


  const handleChangeCategory = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChangeOpenTimeHR = (event) => {
    setOpenTimeHR(event.target.value);
  };

  const handleChangeOpenTimeMIN = (event) => {
    setOpenTimeMIN(event.target.value);
  };

  const handleChangeCloseTimeHR = (event) => {
    const newCloseTimeHR = event.target.value;
    if (parseInt(newCloseTimeHR) < parseInt(openTimeHR)) {
      setOpenTimeHR(newCloseTimeHR);
    }
    setCloseTimeHR(newCloseTimeHR);
  };

  const handleChangeCloseTimeMIN = (event) => {
    setCloseTimeMIN(event.target.value);
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const validateInputs = () => {
    if (!location || !selectedOption) {
      return "Please fill in all required fields.";
    }
    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImagefile(file);
      // backend เก็บรูปใช้ตัวแปร Imagefile 
    }
  };

  const handleConfirmClick = () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    console.log("Confirm button clicked");
    console.log("Selected business days:", selectedBusinessDays);
    console.log("Location:", location);

    const id = userData.id;
    const role = 'owner';
    const email = userData.email;
    const userID = { email, role, id }; // สร้าง object ที่รวม email, role และ id
    console.log("signup successful navigate to verify", userID);
    sessionStorage.setItem('userID', JSON.stringify(userID));
    router.push('/verify');
  };

  return (
    <div className={styles.mainBg}>
      <Topbar />
      <div className={styles.bigContainer}>
        <div className={styles.topContainer}>
          <button
            onClick={() => router.back()}
            className={styles.iconArrowStyle}
          >
            <FaArrowLeft />
          </button>
        </div>
        <h1 className={styles.title}>Sign Up - Restaurant</h1>
        <div className={styles.inputContainer}>
          <div className={styles.textfieldBigContainerL}>
            <div className={styles.rowContainer}>
              <div className={styles.picBigContainer}>
                <label className={styles.pictureContainer}>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  {!profileImage ? (
                    <div>
                      <AiOutlinePicture className={styles.iconPicStyle} />
                      <h2 className={styles.picText}>click to upload</h2>
                    </div>
                  ) : (
                    <Image
                      className={styles.uploadedImage}
                      src={profileImage}
                      alt="Uploaded"
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </label>
              </div>
              <div className={styles.colContainer}>
                <h2 className={styles.normalText}>Name</h2>

                <input name="Name"
                  value={NameOwner}
                  className={styles.textfieldStyle}
                  onChange={(e) => setNameOwner(e.target.value)}
                />

                <h2 className={styles.normalText}>Category</h2>
                <select
                  className={styles.ddTextfieldStyle}
                  value={selectedOption}
                  onChange={handleChangeCategory}
                >
                  <option value="" disabled>Select Type</option>
                  {category && category.map((items, index) => (
                    <option key={index} value={items.Id}>
                      {items.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.colContainer2}>
              <h2 className={styles.normalText}>Business days</h2>
              <div className={styles.dropdown} onClick={toggleDropdown}>
                <div className={styles.dropdownHeader}>
                  {selectedBusinessDays.every(Boolean)
                    ? "Everyday"
                    : "Selected Day(s)"}
                  <BsChevronDown />
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownList}>
                    {businessDays.map((day, index) => (
                      <div key={index} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          id={day}
                          checked={selectedBusinessDays[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <label htmlFor={day}>{day}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.rowContainer}>
              <div className={styles.colTime}>
                <h2 className={styles.normalText}>Open time</h2>
                <div className={styles.textfieldSubContainer}>
                  <select
                    className={styles.ddTextfieldStyle}
                    value={openTimeHR}
                    onChange={handleChangeOpenTimeHR}
                  >
                    {time_hr.map((hr, index) => (
                      <option key={index} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                  <h2 className={styles.normalText}> : </h2>
                  <select
                    className={styles.ddTextfieldStyle}
                    value={openTimeMIN}
                    onChange={handleChangeOpenTimeMIN}
                  >
                    {time_min.map((min, index) => (
                      <option key={index} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.colTime}>
                <h2 className={styles.normalText}>Close time</h2>
                <div className={styles.textfieldSubContainer}>
                  <select
                    className={styles.ddTextfieldStyle}
                    value={closeTimeHR}
                    onChange={handleChangeCloseTimeHR}
                  >
                    {time_hr.map((hr, index) => (
                      <option key={index} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                  <h2 className={styles.normalText}> : </h2>
                  <select
                    className={styles.ddTextfieldStyle}
                    value={closeTimeMIN}
                    onChange={handleChangeCloseTimeMIN}
                  >
                    {time_min.map((min, index) => (
                      <option key={index} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.textfieldBigContainerR}>
            <div className={styles.textfieldSubContainer}>
              <h2 className={styles.normalText}>Location</h2>
            </div>
            <textarea
              name="Location"
              className={styles.locationTextfield}
              rows={4}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                console.log(e.target.value);
              }}
            />
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${location}`}
                  frameborder="0"
                  className={styles.mapContainer}
                ></iframe>
              </div>
            </div>
            <div className={styles.rowContainer2}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colContact}>
                <div className={styles.rowContainer}>
                  <IoCall className={styles.iconStyle} />

                  <input name="Phone"
                    value={numberPhone}
                    className={styles.textfieldStyle}
                    onChange={(e) => setNumberPhone(e.target.value)}
                  />

                </div>
                <div className={styles.rowContainer}>
                  <FaLine className={styles.iconStyle} />

                  <input name="Line"
                    value={LineContact}
                    className={styles.textfieldStyle}
                    onChange={(e) => setLineContact(e.target.value)}
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
        <button className={styles.confirmButton} onClick={handleConfirmClick}>
          Confirm
        </button>
        <div className={styles.bottomContainer}>
          <h2 className={styles.bottomText}>Already have an account?</h2>
          <Link href="/login" className={styles.LoginButton}>
            Login
          </Link>
        </div>
        {errorMessage && (
          <div className={styles.ErrorChecking}>
            <span className={styles.Alerticon}>⚠️</span>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
