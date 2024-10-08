"use client";
import { useState, useEffect } from "react";
import styles from "./info.module.css";
import { BsChevronDown } from "react-icons/bs";
import { FaLine } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { AiOutlinePicture } from "react-icons/ai";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";


import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from '../../../src/app/config/supabaseClient.js';

export default function Info() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

  // const [openTimeHR, setOpenTimeHR] = useState(formData.openTimeHR);
  // const [openTimeMIN, setOpenTimeMIN] = useState(formData.openTimeMin);
  // const [closeTimeHR, setCloseTimeHR] = useState(formData.closeTimeHR);
  // const [closeTimeMIN, setCloseTimeMIN] = useState(formData.closeTimeMin);
  const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState(formData.location);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [typerestaurant, setTyperestaurant] = useState("");
  const categoryDropdown = ["Thai", "Japanese"]; // from backend

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

  useEffect(() => {

    const fetchData = async () => {
      try {
        const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
          withCredentials: true,
        });
        if (user !== null) {
          console.log(user.data[0].Id);
          setUserId(user.data[0].Id);
        } else {
          router.push(`/`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/showinfo`, {
          params: { RestaurantId: userId },
          withCredentials: true,
        });
        if (response.data) {
          console.log("Restaurant info:", response.data[0]);
          const selectedDays = response.data[0].BusinessDay.split(',').map(day => day === 'true');
          setSelectedBusinessDays(selectedDays);
          setInfoData(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    }
    fetchInfo();
  }, [userId]);


  console.log("infoData:", infoData?.RestaurantId);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/typerestaurant`, {
          params: { RestaurantId: infoData?.RestaurantId },
          withCredentials: true,
        });
        console.log("Restaurant Category:", category.data[0].TypeName);
        const type = category.data.map((item) => item.TypeName);
        setTyperestaurant(type.join('/'));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [infoData?.RestaurantId]);

  useEffect(() => {
    if (infoData) {
      console.log("infoData:", infoData.id);
      setFormData({
        Id: infoData.id,
        name: infoData.Name,
        category: infoData.category,
        // businessDay: openday,
        openTimeHR: infoData.OpenTimeHr,
        openTimeMin: infoData.OpenTimeMin,
        closeTimeHR: infoData.CloseTimeHr,
        closeTimeMin: infoData.CloseTimeMin,
        contactCall: infoData.Tel,
        contactLine: infoData.Line,
        location: infoData.Location,
        profileImage: infoData.ProfilePic,
      });
      // setSelectedOption(infoData.category);
      // setOpenTimeHR(infoData.OpenTimeHR);
      // setOpenTimeMIN(infoData.OpenTimeMin);
      // setCloseTimeHR(infoData.CloseTimeHR);
      // setCloseTimeMIN(infoData.CloseTimeMin);
      // setLocation(infoData.Location);
    }
  }, [infoData]);

  console.log("formData:", formData);


  if (!infoData) {
    return <div>Loading...</div>;
  }

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleOpenStatus = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleChangeCategory = (event) => {
    setSelectedOption(event.target.value);
  };


  // const handleChangeOpenTimeHR = (event) => {
  //   setOpenTimeHR(event.target.value);
  // };

  // const handleChangeOpenTimeMIN = (event) => {
  //   setOpenTimeMIN(event.target.value);
  // };

  // const handleChangeCloseTimeHR = (event) => {
  //   const newCloseTimeHR = event.target.value;
  //   if (parseInt(newCloseTimeHR) < parseInt(openTimeHR)) {
  //     setOpenTimeHR(newCloseTimeHR);
  //   }
  //   setCloseTimeHR(newCloseTimeHR);
  // };

  // const handleChangeCloseTimeMIN = (event) => {
  //   setCloseTimeMIN(event.target.value);
  // };

  const handleChangeOpenTimeHR = (event) => {
    setFormData({ ...formData, openTimeHR: event.target.value });
  };

  const handleChangeOpenTimeMIN = (event) => {
    setFormData({ ...formData, openTimeMin: event.target.value });
  };

  const handleChangeCloseTimeHR = (event) => {
    const newCloseTimeHR = event.target.value;
    // Optional: Add validation logic if needed
    setFormData({ ...formData, closeTimeHR: newCloseTimeHR });
  };

  const handleChangeCloseTimeMIN = (event) => {
    setFormData({ ...formData, closeTimeMin: event.target.value });
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type.startsWith("image/")) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setImageFile(file);
  //   } else {
  //     alert("Please upload a valid image file.");
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file || file.type.startsWith("image/")) {
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


  console.log("type:", typerestaurant);
  const handleSaveClick = async () => {
    console.log("formData:", formData.Id);

    const businessDayString = selectedBusinessDays.map(day => day ? 'true' : 'false').join(',');

    const updateData = new FormData();
    updateData.append('id', formData.Id);
    updateData.append('RestaurantId', userId);
    updateData.append('name', formData.name);
    updateData.append('file', imageFile);
    updateData.append('businessDay', businessDayString);
    updateData.append('openTimeHR', formData.openTimeHR);
    updateData.append('openTimeMin', formData.openTimeMin);
    updateData.append('closeTimeHR', formData.closeTimeHR);
    updateData.append('closeTimeMin', formData.closeTimeMin);
    updateData.append('contactCall', formData.contactCall);
    updateData.append('contactLine', formData.contactLine);
    updateData.append('location', formData.location);

    try {
      const res = await axios.put(`${NEXT_PUBLIC_BASE_API_URL}/editprofile`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log("Profile", res.data.data[0].ProfilePic);
      console.log("Data saved successfully:", res.data.RestaurantData[0]);
      const updatedInfoData = res.data.RestaurantData[0];
      const updateprofileImage = res.data.data[0].ProfilePic;
      setInfoData({
        Id: updatedInfoData.id,
        Name: updatedInfoData.Name,
        BusinessDay: updatedInfoData.BusinessDay,
        OpenTimeHr: updatedInfoData.OpenTimeHr,
        OpenTimeMin: updatedInfoData.OpenTimeMin,
        CloseTimeHr: updatedInfoData.CloseTimeHr,
        CloseTimeMin: updatedInfoData.CloseTimeMin,
        Tel: updatedInfoData.Tel,
        Line: updatedInfoData.Line,
        Location: updatedInfoData.Location,
        ProfilePic: updateprofileImage,
      });
      if (res.status === 200) {
        handleCloseModal();
      }

    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("Failed to save data. Please try again.");
    }
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
    openday.push('Everyday');
  } else if (beforeshow_open.length < 4) {
    openday.push(beforeshow_open.join(', '));
  } else if (beforeshow_open.length >= 4) {
    openday.push("Everyday except " + beforeshow_close.join(', '));
  }

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };


  const Modal = () => {
    if (!isModalOpen) return null;
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h1 className={styles.titleM}>Edit profile</h1>
          <div className={styles.bigContainerM}>
            <div className={styles.inputContainerM}>
              <div className={styles.textfieldBigContainerLM}>
                <div className={styles.rowContainerM}>
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
                          <h2 className={styles.picTextM}>click to upload</h2>
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
                    <h2 className={styles.normalTextM}>Category</h2>
                    <select
                      className={styles.ddTextfieldStyleM}
                      value={selectedOption}
                      onChange={handleChangeCategory}
                    >
                      {categoryDropdown.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.colContainer2M}>
                  <h2 className={styles.normalTextM}>Business days</h2>
                  <div className={styles.dropdownM} onClick={toggleDropdown}>
                    <div className={styles.dropdownHeaderM}>
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
                <div className={styles.rowContainerM}>
                  <div className={styles.colTimeM}>
                    <h2 className={styles.normalTextM}>Open time</h2>
                    <div className={styles.textfieldSubContainerM}>
                      <select
                        className={styles.ddTextfieldStyleM}
                        value={formData.openTimeHR}
                        onChange={handleChangeOpenTimeHR}
                      >
                        {time_hr.map((hr, index) => (
                          <option key={index} value={hr}>
                            {hr}
                          </option>
                        ))}
                      </select>
                      <select
                        className={styles.ddTextfieldStyleM}
                        value={formData.openTimeMin}
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
                  <div className={styles.colTimeM}>
                    <h2 className={styles.normalTextM}>Close time</h2>
                    <div className={styles.textfieldSubContainerM}>
                      <select
                        className={styles.ddTextfieldStyleM}
                        value={formData.closeTimeHR}
                        onChange={handleChangeCloseTimeHR}
                      >
                        {time_hr.map((hr, index) => (
                          <option key={index} value={hr}>
                            {hr}
                          </option>
                        ))}
                      </select>
                      <h2 className={styles.normalTextM}> : </h2>
                      <select
                        className={styles.ddTextfieldStyleM}
                        value={formData.closeTimeMin}
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

              <div className={styles.textfieldBigContainerRM}>
                <div className={styles.textfieldSubContainerM}>
                  <h2 className={styles.normalTextM}>Location</h2>
                </div>
                <textarea
                  name="Location"
                  className={styles.locationTextfieldM}
                  rows={4}
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                  }}
                />
                <div className="mapouter">
                  <div className="gmap_canvas">
                    <iframe
                      src={`https://maps.google.com/maps?output=embed&q=${infoData.location}`}
                      frameBorder="0"
                      className={styles.mapContainerM}
                    ></iframe>
                  </div>
                </div>
                <div className={styles.rowContainer2M}>
                  <h2 className={styles.normalTextM}>Contact</h2>
                  <div className={styles.colContactM}>
                    <div className={styles.rowContainerM}>
                      <IoCall className={styles.iconStyleM} />
                      <input
                        name="Phone"
                        className={styles.textfieldStyleM}
                        value={formData.contactCall}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactCall: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.rowContainerM}>
                      <FaLine className={styles.iconStyleM} />
                      <input
                        name="Line"
                        className={styles.textfieldStyleM}
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
      </div>
    );
  };

  return (
    <div className={styles.mainBg}>
      <Navbar />
      <div className={styles.profileCon}>
        <Image
          className={styles.uploadedImage}
          src={infoData.ProfilePic}
          alt="Uploaded"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.bigContainer}>
        {/* <button className={styles.editButton} onClick={handleEditClick}>
          Edit Profile
        </button> */}
        <div className={styles.rowCon1}>
          <div className={styles.toggleContainer}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={toggleOpenStatus}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.statusText}>
              {isOpen ? "Open" : "Close"}
            </span>
          </div>
          <button className={styles.editButton} onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
        <h1 className={styles.title}>{infoData.Name}</h1>

        <div className={styles.rowCon}>
          <div className={styles.halfCon}>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Category</h2>
              <h2 className={styles.normalText4}>{typerestaurant}</h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Business day</h2>
              <h2 className={styles.normalText2}>{openday}</h2>

            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Open time</h2>
              <h2 className={styles.normalText3}>
                {infoData.OpenTimeHr} : {infoData.OpenTimeMin}
              </h2>
              <h2 className={styles.normalText1}>Close time</h2>
              <h2 className={styles.normalText2}>
                {infoData.CloseTimeHr} : {infoData.CloseTimeMin}
              </h2>
            </div>
            <div className={styles.rowCon}>
              <h2 className={styles.normalText}>Contact</h2>
              <div className={styles.colCon}>
                <div className={styles.rowCon}>
                  <IoCall className={styles.icon} />
                  <h2 className={styles.normalText2}>{infoData.Tel}</h2>
                </div>
                <div className={styles.rowCon}>
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
