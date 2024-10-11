"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./info.module.css";
import { BsChevronDown } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

// import axios from "axios";
// import { NEXT_PUBLIC_BASE_API_URL } from '../../../src/app/config/supabaseClient.js';

// export default function Info() {
//   const router = useRouter();
//   const [userId, setUserId] = useState(null);
//   const [infoData, setInfoData] = useState(null);
//   const [defaultIsOpen, setDefaultIsOpen] = useState(false); // สถานะเปิดปิดตามเวลาปกติ

//   // เพิ่มสถานะสำหรับ override สถานะร้านค้า
//   const [overrideStatus, setOverrideStatus] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     businessDay: "",
//     openTimeHR: "",
//     openTimeMin: "",
//     closeTimeHR: "",
//     closeTimeMin: "",
//     contactCall: "",
//     contactLine: "",
//     location: "",
//     profileImage: "",
//   });

//   const [selectedOption, setSelectedOption] = useState("");
//   const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [profileImage, setProfileImage] = useState("");
//   const [imageFile, setImageFile] = useState("");
//   const [typerestaurant, setTyperestaurant] = useState("");

//   const time_hr = Array.from({ length: 24 }, (_, i) =>
//     String(i).padStart(2, "0")
//   );

//   const time_min = ["00", "15", "30", "45"];
//   const businessDays = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const getCurrentDateTime = () => {
//     return new Date();
//   };

//   const getTodayTime = (hour, minute) => {
//     const now = new Date();
//     now.setHours(parseInt(hour, 10));
//     now.setMinutes(parseInt(minute, 10));
//     now.setSeconds(0);
//     now.setMilliseconds(0);
//     return now;
//   };

//   useEffect(() => {
//     if (infoData) {
//       if (infoData.toggle_status !== null) {
//         setOverrideStatus(infoData?.toggle_status);
//       } else {
//         setOverrideStatus(defaultIsOpen ? 'open' : 'close');
//       }
//     }
//   }, [infoData, defaultIsOpen]);

//   useEffect(() => {
//     if (!infoData) return;

//     const checkIsOpen = () => {
//       const now = getCurrentDateTime();
//       const currentDay = now.getDay();
//       const isTodayOpen = selectedBusinessDays[currentDay];
//       if (!isTodayOpen) {
//         setDefaultIsOpen(false);
//         return;
//       }

//       const openTime = getTodayTime(formData.openTimeHR, formData.openTimeMin);
//       const closeTime = getTodayTime(formData.closeTimeHR, formData.closeTimeMin);

//       if (closeTime <= openTime) {
//         closeTime.setDate(closeTime.getDate() + 1);
//       }

//       if (now >= openTime && now <= closeTime) {
//         setDefaultIsOpen(true);
//       } else {
//         setDefaultIsOpen(false);
//       }
//     };

//     checkIsOpen();
//     const interval = setInterval(checkIsOpen, 60000);
//     return () => clearInterval(interval);
//   }, [infoData, selectedBusinessDays, formData]);

//   // ดึงข้อมูลผู้ใช้เมื่อ component mount
//   useEffect(() => {

//     const fetchData = async () => {
//       try {
//         const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
//           withCredentials: true,
//         });
//         if (user !== null && user.data.length > 0) {
//           console.log(user.data[0].Id);
//           setUserId(user.data[0].Id);
//         } else {
//           router.push(`/`);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     fetchData();
//   }, [router]);

//   // ดึงข้อมูลร้านเมื่อ userId ถูกตั้งค่า
//   useEffect(() => {
//     const fetchInfo = async () => {
//       if (!userId) return;
//       try {
//         const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showinfo`, {
//           params: { RestaurantId: userId },
//           withCredentials: true,
//         });
//         if (response.data && response.data.length > 0) {
//           console.log("Restaurant info:", response.data[0]);
//           const selectedDays = response.data[0].BusinessDay.split(',').map(day => day === 'true');
//           setSelectedBusinessDays(selectedDays);
//           setInfoData(response.data[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching restaurant info:", error);
//       }
//     }
//     fetchInfo();
//   }, [userId]);

//   // ดึงประเภทร้านเมื่อ infoData ถูกตั้งค่า
//   useEffect(() => {
//     const fetchCategory = async () => {
//       if (!infoData?.RestaurantId) return;
//       try {
//         const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/typerestaurant`, {
//           params: { RestaurantId: infoData.RestaurantId },
//           withCredentials: true,
//         });
//         console.log("Restaurant Category:", category.data[0].TypeName);
//         const type = category.data.map((item) => item.TypeName);
//         setTyperestaurant(type.join('/'));
//       } catch (error) {
//         console.error('Error fetching restaurant category:', error);
//       }
//     };
//     fetchCategory();
//   }, [infoData?.RestaurantId]);

//   // ตั้งค่า formData เมื่อ infoData เปลี่ยนแปลง
//   useEffect(() => {
//     if (infoData) {
//       console.log("infoData:", infoData.id);
//       setFormData({
//         Id: infoData.id,
//         name: infoData.Name,
//         category: infoData.category,
//         openTimeHR: infoData.OpenTimeHr,
//         openTimeMin: infoData.OpenTimeMin,
//         closeTimeHR: infoData.CloseTimeHr,
//         closeTimeMin: infoData.CloseTimeMin,
//         contactCall: infoData.Tel,
//         contactLine: infoData.Line,
//         location: infoData.Location,
//         profileImage: infoData.ProfilePic,
//       });
//     }
//   }, [infoData]);

//   console.log("formData:", formData);

//   if (!infoData) {
//     return <div>Loading...</div>;
//   }

//   // กำหนดสถานะที่จะแสดง
//   const displayedIsOpen = overrideStatus !== null ? (overrideStatus === 'open') : defaultIsOpen;

//   // ฟังก์ชันจัดการการคลิก toggle
//   const toggleOverride = async () => {
//     const newStatus = overrideStatus === null ? (defaultIsOpen ? 'close' : 'open') : null;
//     setOverrideStatus(newStatus);
//     console.log('override', newStatus);

//     try {
//       await axios.put(`${NEXT_PUBLIC_BASE_API_URL}/toggle`, {
//         RestaurantId: userId,
//         toggle_status: newStatus,
//       });
//     } catch (error) {
//       console.error("Error updating override status:", error);
//       setErrorMessage("Failed to update status. Please try again.");
//     }
//   };

//   const handleEditClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleChangeCategory = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleChangeOpenTimeHR = (event) => {
//     setFormData({ ...formData, openTimeHR: event.target.value });
//   };

//   const handleChangeOpenTimeMIN = (event) => {
//     setFormData({ ...formData, openTimeMin: event.target.value });
//   };

//   const handleChangeCloseTimeHR = (event) => {
//     const newCloseTimeHR = event.target.value;
//     setFormData({ ...formData, closeTimeHR: newCloseTimeHR });
//   };

//   const handleChangeCloseTimeMIN = (event) => {
//     setFormData({ ...formData, closeTimeMin: event.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//         setFormData({ ...formData, profileImage: reader.result });
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert("Please upload a valid image file.");
//     }
//   };

//   console.log("type:", typerestaurant);
//   const handleSaveClick = async () => {
//     console.log("formData:", formData.Id);

//     const businessDayString = selectedBusinessDays.map(day => day ? 'true' : 'false').join(',');

//     const updateData = new FormData();
//     updateData.append('id', formData.Id);
//     updateData.append('RestaurantId', userId);
//     updateData.append('name', formData.name);
//     updateData.append('file', imageFile);
//     updateData.append('businessDay', businessDayString);
//     updateData.append('openTimeHR', formData.openTimeHR);
//     updateData.append('openTimeMin', formData.openTimeMin);
//     updateData.append('closeTimeHR', formData.closeTimeHR);
//     updateData.append('closeTimeMin', formData.closeTimeMin);
//     updateData.append('contactCall', formData.contactCall);
//     updateData.append('contactLine', formData.contactLine);
//     updateData.append('location', formData.location);

//     try {
//       const res = await axios.put(`${NEXT_PUBLIC_BASE_API_URL}/editprofile`, updateData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       });
//       console.log("Profile", res.data.data[0].ProfilePic);
//       console.log("Data saved successfully:", res.data.RestaurantData[0]);
//       const updatedInfoData = res.data.RestaurantData[0];
//       const updateprofileImage = res.data.data[0].ProfilePic;
//       setInfoData({
//         Id: updatedInfoData.id,
//         Name: updatedInfoData.Name,
//         BusinessDay: updatedInfoData.BusinessDay,
//         OpenTimeHr: updatedInfoData.OpenTimeHr,
//         OpenTimeMin: updatedInfoData.OpenTimeMin,
//         CloseTimeHr: updatedInfoData.CloseTimeHr,
//         CloseTimeMin: updatedInfoData.CloseTimeMin,
//         Tel: updatedInfoData.Tel,
//         Line: updatedInfoData.Line,
//         Location: updatedInfoData.Location,
//         ProfilePic: updateprofileImage,
//       });
//       if (res.status === 200) {
//         handleCloseModal();
//         // setOverrideStatus(null);
//       }

//     } catch (error) {
//       console.error("Error saving data:", error);
//       setErrorMessage("Failed to save data. Please try again.");
//     }
//   };

//   const openday = [];

//   const beforeshow_open = [];
//   const beforeshow_close = [];
//   selectedBusinessDays.forEach((day, index) => {
//     if (day) {
//       beforeshow_open.push(businessDays[index]);
//     } else {
//       beforeshow_close.push(businessDays[index]);
//     }
//   });
//   if (beforeshow_open.length === 7) {
//     openday.push('Everyday');
//   } else if (beforeshow_open.length < 4) {
//     openday.push(beforeshow_open.join(', '));
//   } else if (beforeshow_open.length >= 4) {
//     openday.push("Everyday except " + beforeshow_close.join(', '));
//   }

//   const handleCheckboxChange = (index) => {
//     const updatedCheckedState = selectedBusinessDays.map((item, i) =>
//       i === index ? !item : item
//     );
//     setSelectedBusinessDays(updatedCheckedState);
//   };

export default function Info() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [defaultIsOpen, setDefaultIsOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    businessDay: "",
    openTimeHR: "",
    openTimeMin: "",
    closeTimeHR: "",
    closeTimeMin: "",
    contactCall: "",
    contactLine: "",
    location: "",
    profileImage: "",
  });

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [typerestaurant, setTyperestaurant] = useState("");

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

  const getCurrentDateTime = () => {
    return new Date();
  };

  const getTodayTime = (hour, minute) => {
    const now = new Date();
    now.setHours(parseInt(hour, 10));
    now.setMinutes(parseInt(minute, 10));
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  // Mock data for testing
  const mockUserData = {
    data: [{ Id: "123" }],
  };

  const mockInfoData = {
    id: "1",
    Name: "Test Restaurant",
    BusinessDay: "true,true,true,true,true,true,true",
    OpenTimeHr: "09",
    OpenTimeMin: "00",
    CloseTimeHr: "21",
    CloseTimeMin: "00",
    Tel: "123456789",
    Line: "@testline",
    Location: "kmutnb",
    ProfilePic: "/DecPic.png",
    toggle_status: null,
  };

  const mockCategoryData = [
    { TypeName: "Noodle" },
    { TypeName: "Pizza" },
    { TypeName: "Rice" },
    { TypeName: "Italian" },
  ];

  useEffect(() => {
    // Simulating fetching user data
    setUserId(mockUserData.data[0].Id);
  }, []);

  useEffect(() => {
    if (userId) {
      // Simulating fetching restaurant info
      setInfoData(mockInfoData);
      const selectedDays = mockInfoData.BusinessDay.split(",").map(
        (day) => day === "true"
      );
      setSelectedBusinessDays(selectedDays);
    }
  }, [userId]);

  useEffect(() => {
    if (infoData) {
      // Simulating fetching category data
      const type = mockCategoryData.map((item) => item.TypeName);
      setTyperestaurant(type.join("/"));
    }
  }, [infoData]);

  useEffect(() => {
    if (infoData) {
      if (infoData.toggle_status !== null) {
        setOverrideStatus(infoData?.toggle_status);
      } else {
        setOverrideStatus(defaultIsOpen ? "open" : "close");
      }
    }
  }, [infoData, defaultIsOpen]);

  useEffect(() => {
    if (!infoData) return;

    const checkIsOpen = () => {
      const now = getCurrentDateTime();
      const currentDay = now.getDay();
      const isTodayOpen = selectedBusinessDays[currentDay];
      if (!isTodayOpen) {
        setDefaultIsOpen(false);
        return;
      }

      const openTime = getTodayTime(formData.openTimeHR, formData.openTimeMin);
      const closeTime = getTodayTime(
        formData.closeTimeHR,
        formData.closeTimeMin
      );

      if (closeTime <= openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      if (now >= openTime && now <= closeTime) {
        setDefaultIsOpen(true);
      } else {
        setDefaultIsOpen(false);
      }
    };

    checkIsOpen();
    const interval = setInterval(checkIsOpen, 60000);
    return () => clearInterval(interval);
  }, [infoData, selectedBusinessDays, formData]);

  // Set formData when infoData changes
  useEffect(() => {
    if (infoData) {
      setFormData({
        Id: infoData.id,
        name: infoData.Name,
        category: infoData.category,
        openTimeHR: infoData.OpenTimeHr,
        openTimeMin: infoData.OpenTimeMin,
        closeTimeHR: infoData.CloseTimeHr,
        closeTimeMin: infoData.CloseTimeMin,
        contactCall: infoData.Tel,
        contactLine: infoData.Line,
        location: infoData.Location,
        profileImage: infoData.ProfilePic,
      });
    }
  }, [infoData]);

  if (!infoData) {
    return <div>Loading...</div>;
  }

  // Determine displayed status
  const displayedIsOpen =
    overrideStatus !== null ? overrideStatus === "open" : defaultIsOpen;

  // Toggle function
  const toggleOverride = async () => {
    const newStatus =
      overrideStatus === null ? (defaultIsOpen ? "close" : "open") : null;
    setOverrideStatus(newStatus);

    // Simulated update without axios
    console.log("override", newStatus);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeCategory = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChangeOpenTimeHR = (event) => {
    setFormData({ ...formData, openTimeHR: event.target.value });
  };

  const handleChangeOpenTimeMIN = (event) => {
    setFormData({ ...formData, openTimeMin: event.target.value });
  };

  const handleChangeCloseTimeHR = (event) => {
    const newCloseTimeHR = event.target.value;
    setFormData({ ...formData, closeTimeHR: newCloseTimeHR });
  };

  const handleChangeCloseTimeMIN = (event) => {
    setFormData({ ...formData, closeTimeMin: event.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSaveClick = async () => {
    const businessDayString = selectedBusinessDays
      .map((day) => (day ? "true" : "false"))
      .join(",");

    // Simulated save without axios
    console.log("Saved data:", {
      ...formData,
      businessDay: businessDayString,
      file: imageFile,
    });

    // Update infoData with mock data
    setInfoData({
      ...infoData,
      Name: formData.name,
      BusinessDay: businessDayString,
      OpenTimeHr: formData.openTimeHR,
      OpenTimeMin: formData.openTimeMin,
      CloseTimeHr: formData.closeTimeHR,
      CloseTimeMin: formData.closeTimeMin,
      Tel: formData.contactCall,
      Line: formData.contactLine,
      Location: formData.location,
      ProfilePic: profileImage || infoData.ProfilePic,
    });
    handleCloseModal();
  };

  const openday = [];
  const beforeshow_open = [];
  const beforeshow_close = [];
  selectedBusinessDays.forEach((day, index) => {
    if (day) {
      beforeshow_open.push(businessDays[index]);
    } else {
      beforeshow_close.push(businessDays[index]);
    }
  });
  if (beforeshow_open.length === 7) {
    openday.push("Everyday");
  } else if (beforeshow_open.length < 4) {
    openday.push(beforeshow_open.join(", "));
  } else if (beforeshow_open.length >= 4) {
    openday.push("Everyday except " + beforeshow_close.join(", "));
  }

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };

  // end here

  const Modal = () => {
    if (!isModalOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.bigContainerM}>
        <div className={styles.closeIcon} onClick={() => setIsModalOpen(false)}>
          <RxCross2/>
        </div>
          <h1 className={styles.titleM}>Edit profile</h1>
          <div className={styles.inputContainerM}>
            <div className={styles.textfieldBigContainerLM}>
              <div className={styles.rowContainerM}>
                <div className={styles.colCon}>
                  <div className={styles.picBigContainerM}>
                    <label className={styles.pictureContainerM}>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                        required
                      />
                      {!formData.profileImage ? (
                        <div>
                          <AiOutlinePicture className={styles.iconPicStyleM} />
                        </div>
                      ) : (
                        <Image
                          className={styles.uploadedImageM}
                          src={formData.profileImage}
                          alt="Uploaded"
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                    </label>
                  </div>
                  <h2
                    className={styles.picUploadText}
                    onClick={() =>
                      document.querySelector(`input[type="file"]`).click()
                    }
                  >
                    click to upload
                  </h2>
                </div>

                <div className={styles.colContainerM}>
                  <h2 className={styles.normalTextM}>Name</h2>
                  <input
                    name="Name"
                    className={styles.textfieldStyleM}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <h2 className={styles.normalTextM}>Contact</h2>
                  {/* <div className={styles.colContactM}> */}
                  <div className={styles.rowContainerM}>
                    <div className={styles.contactBoxM}>
                      <IoCall className={styles.iconStyleM} />
                      <input
                        name="Phone"
                        className={styles.textfieldStyleContactM}
                        value={formData.contactCall}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactCall: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.rowCon}>
                    <div className={styles.contactBoxM}>
                      <FaLine className={styles.iconStyleM} />
                      <input
                        name="Line"
                        className={styles.textfieldStyleContactM}
                        value={formData.contactLine}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactLine: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.rowContainerCenterM}>
                <h2 className={styles.normalTextM}>Business days</h2>
                <div className={styles.dropdownM}>
                  <div
                    className={styles.dropdownHeaderM}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {openday}
                    <BsChevronDown />
                  </div>
                  {dropdownOpen && (
                    <div className={styles.dropdownListM}>
                      {businessDays.map((day, index) => (
                        <div key={index} className={styles.checkboxM}>
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

              <div className={styles.rowContainerCenter2M}>
                <h2 className={styles.normalTextM}>Open time</h2>
                <div className={styles.textfieldSubContainerM}>
                  <input
                    className={styles.ddTextfieldStyleM}
                    type="number"
                    value={formData.openTimeHR}
                    min="0"
                    max="23"
                    step="01"
                    onChange={handleChangeOpenTimeHR}
                  />
                  <h2 className={styles.normalTextM}> : </h2>
                  <input
                    className={styles.ddTextfieldStyleM}
                    type="number"
                    value={formData.openTimeMin}
                    min="0"
                    max="45"
                    step="15"
                    onChange={handleChangeOpenTimeMIN}
                  />
                </div>
              </div>
              <div className={styles.rowContainerCenter2M}>
                <h2 className={styles.normalTextM}>Close time</h2>
                <div className={styles.textfieldSubContainerM}>
                  <input
                    className={styles.ddTextfieldStyleM}
                    type="number"
                    value={formData.closeTimeHR}
                    min="0"
                    max="23"
                    step="01"
                    onChange={handleChangeCloseTimeHR}
                  />
                  <h2 className={styles.normalTextM}>:</h2>
                  <input
                    className={styles.ddTextfieldStyleM}
                    type="number"
                    value={formData.closeTimeMin}
                    min="0"
                    max="45"
                    step="15"
                    onChange={handleChangeCloseTimeMIN}
                  />
                </div>
              </div>
            </div>

            <div className={styles.textfieldBigContainerRM}>
              <div className={styles.textfieldSubContainerM}>
                <h2 className={styles.normalTextM}>Location</h2>
              </div>
              <textarea
                // ref={locationRef}
                name="Location"
                className={styles.locationTextfieldM}
                rows={4}
                value={formData.location}
                // onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                }}
              />
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    src={`https://maps.google.com/maps?output=embed&q=${formData.location}`}
                    frameBorder="0"
                    className={styles.mapContainerM}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rowCon2}>
            <button className={styles.saveButtonM} onClick={handleSaveClick}>
              Save
            </button>
            <button
              className={styles.closeButtonM}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // main page
  return (
    <div className={styles.mainBg}>
      <Navbar />
      <div className={styles.bigContainer}>
        <div className={styles.profileCon}>
          <Image
            className={styles.uploadedImage}
            src={infoData.ProfilePic || "/default-profile.png"} // รูป fallback
            alt="Uploaded"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* <button className={styles.editButton} onClick={handleEditClick}>
          Edit Profile
        </button> */}
        <div className={styles.rowCon1}>
          <button className={styles.editButton} onClick={handleEditClick}>
            <div className={styles.rowCon2}>
              <FiEdit3 className={styles.editIcon} />
              Edit Profile
            </div>
          </button>
        </div>
        <div className={styles.rowCon3}>
          <h1 className={styles.title}>{infoData.Name || "Restaurant Name"}</h1>
          <div className={styles.toggleContainer}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={
                  overrideStatus !== null
                    ? overrideStatus === "open"
                    : displayedIsOpen
                }
                onChange={toggleOverride}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.statusText}>
              {overrideStatus === "open" && "Open"}
              {overrideStatus === "close" && "Close"}
              {overrideStatus === null && (displayedIsOpen ? "Open" : "Close")}
            </span>
          </div>
        </div>

        <div className={styles.rowCon}>
          <div className={styles.halfCon}>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Category</h2>
              {/* back แยกด้วยไรมาใส่ใน split */}
              {typerestaurant.split("/").map((category, index) => (
                <h2 key={index} className={styles.normalText4}>
                  {category.trim()}
                </h2>
              ))}
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Business day</h2>
              <h2 className={styles.normalText2}>{openday}</h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Time</h2>
              <div className={styles.rowCon2}>
                <h2 className={styles.normalText3}>
                  {infoData.OpenTimeHr} : {infoData.OpenTimeMin} -
                </h2>
                <h2 className={styles.normalText5}>
                  {infoData.CloseTimeHr} : {infoData.CloseTimeMin}
                </h2>
              </div>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colCon}>
                <div className={styles.rowCon2}>
                  <IoCall className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.Tel}</h2>
                </div>
                <div className={styles.rowCon2}>
                  <FaLine className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.Line}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.halfCon}>
            <h2 className={styles.normalText}>Location</h2>
            <h2 className={styles.locationCon}>{infoData.Location}</h2>
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${infoData.Location}`}
                  frameBorder="0"
                  className={styles.mapCon}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <Modal />}
    </div>
  );
}
