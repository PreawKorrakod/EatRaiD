import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { AiOutlinePicture } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import { FaLine } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import styles from "./Editinfo.module.css";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { NEXT_PUBLIC_BASE_API_URL } from '../src/app/config/supabaseClient.js';
import { user } from "@nextui-org/theme";
import { User } from "@nextui-org/react";
// import { u } from "@nextui-org/slider/dist/use-slider-a94a4c83";


const Editinfo = ({
  // userId,
  formData,
  setFormData,
  isModalOpen,
  setIsModalOpen,
  infoData,
  setInfoData,
  selectedBusinessDays,
  setSelectedBusinessDays
}) => {
  const [userId, setUserId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const businessDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
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


  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);

    setFormData({
      ...formData,
      businessDay: updatedCheckedState.map(day => day ? 'true' : 'false').join(',')
    });
  };



  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  console.log("formData", formData);

  console.log("userid", userId);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const user = await axios.get(`${NEXT_PUBLIC_BASE_API_URL}/user`, {
          withCredentials: true,
        });
        if (user !== null && user.data.length > 0) {
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
  }, []);

  // Calculate open days string
  const displayedOpenDays = selectedBusinessDays
    .map((isOpen, index) => (isOpen ? businessDays[index] : null))
    .filter(Boolean);

  let openDaysText = "";
  if (displayedOpenDays.length === 7) {
    openDaysText = "Everyday";
  } else if (displayedOpenDays.length < 4) {
    openDaysText = displayedOpenDays.join(", ");
  } else {
    const closedDays = businessDays.filter(
      (_, index) => !selectedBusinessDays[index]
    );
    openDaysText = "Everyday except " + closedDays.join(", ");
  }


  const handleSaveClick = async () => {
    console.log("formData:", formData.location);
    setIsPopupVisible(true);

    // Close the popup after 2 seconds
    setTimeout(() => {
        setIsModalOpen(false);
        setIsPopupVisible(false);
    }, 2000);

    const businessDayString = selectedBusinessDays.map(day => day ? 'true' : 'false').join(',');

    // Step 1: Get latitude and longitude from location before updating
  
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: formData.location,
                format: 'json',
                addressdetails: 1,
            }
        });

        // Check if we received a valid response
        if (response.data.length > 0) {
            const Latitude = response.data[0].lat;
            const Longitude = response.data[0].lon;
            console.log('Latitude:', Latitude);
            console.log('Longitude:', Longitude);

            // Update formData with the fetched latitude and longitude
            const updatedFormData = {
                ...formData,
                Latitude: Latitude,
                Longitude: Longitude,
            };
            console.log("Updated formData with coordinates:", updatedFormData);

            // Step 2: Prepare data for saving using updated coordinates
            const updateData = new FormData();
            updateData.append('id', updatedFormData.Id);
            updateData.append('RestaurantId', userId);
            updateData.append('name', updatedFormData.name);
            updateData.append('file', imageFile || updatedFormData.profileImage);
            updateData.append('businessDay', businessDayString);
            updateData.append('openTimeHR', updatedFormData.openTimeHR);
            updateData.append('openTimeMin', updatedFormData.openTimeMin);
            updateData.append('closeTimeHR', updatedFormData.closeTimeHR);
            updateData.append('closeTimeMin', updatedFormData.closeTimeMin);
            updateData.append('contactCall', updatedFormData.contactCall);
            updateData.append('contactLine', updatedFormData.contactLine);
            updateData.append('Latitude', Latitude); // Use updated latitude
            updateData.append('Longitude', Longitude); // Use updated longitude
            updateData.append('location', updatedFormData.location);

            // Step 3: Save data with updated latitude and longitude
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
                    Latitude: updatedInfoData.Latitude,
                    Longitude: updatedInfoData.Longitude,
                    ProfilePic: updateprofileImage,
                });

                console.log('YOWW_FORM', updatedFormData);
                console.log('YOWW_INFO', infoData);

            } catch (error) {
                console.error("Error saving data:", error);
                setErrorMessage("Failed to save data. Please try again.");
            }

        } else {
            setErrorMessage("Could not find location coordinates.");
            return;
        }
        
};





  const renderPopup = () => {
    if (!isPopupVisible) return null;
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div
            className={styles.closeIcon2}
            onClick={() => {
              setIsPopupVisible(false);
              setIsModalOpen(false);
            }}
          >
            <RxCross2 />
          </div>

          <FaCheckCircle className={styles.checkIcon} />
          <h2 className={styles.popupText}>Successfully saved!</h2>
        </div>
      </div>
    );
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      {renderPopup()} {/* Render the popup here */}
      <div className={styles.bigContainerM}>
        <div className={styles.closeIcon} onClick={handleCloseModal}>
          <RxCross2 />
        </div>
        <h1 className={styles.titleM}>Edit profile</h1>
        <div className={styles.inputContainerM}>
          <div className={styles.textfieldBigContainerLM}>
            {/* Upload Image Section */}
            <div className={styles.rowContainerM}>
              <div className={styles.colCon}>
                <div className={styles.picBigContainerM}>
                  <label className={styles.pictureContainerM}>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
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

              {/* Name and Contact Section */}
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

            {/* Business Days Dropdown */}
            <div className={styles.rowContainerCenterM}>
              <h2 className={styles.normalTextM}>Business days</h2>
              <div className={styles.dropdownM}>
                <div
                  className={styles.dropdownHeaderM}
                  onClick={toggleDropdown}
                >
                  {openDaysText}
                  <BsChevronDown className="chevron-icon" />
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

            {/* Open and Close Time Section */}
            <div className={styles.rowContainerCenter2M}>
              <h2 className={styles.normalTextM}>Open time</h2>
              <div className={styles.textfieldSubContainerM}>
                <input
                  className={styles.ddTextfieldStyleM}
                  type="number"
                  value={formData.openTimeHR}
                  min="0"
                  max="23"
                  step="1"
                  onChange={(e) =>
                    setFormData({ ...formData, openTimeHR: e.target.value })
                  }
                />
                <h2 className={styles.normalTextM}> : </h2>
                <input
                  className={styles.ddTextfieldStyleM}
                  type="number"
                  value={formData.openTimeMin}
                  min="0"
                  max="59"
                  step="15"
                  onChange={(e) =>
                    setFormData({ ...formData, openTimeMin: e.target.value })
                  }
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
                  step="1"
                  onChange={(e) =>
                    setFormData({ ...formData, closeTimeHR: e.target.value })
                  }
                />
                <h2 className={styles.normalTextM}>:</h2>
                <input
                  className={styles.ddTextfieldStyleM}
                  type="number"
                  value={formData.closeTimeMin}
                  min="0"
                  max="59"
                  step="15"
                  onChange={(e) =>
                    setFormData({ ...formData, closeTimeMin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className={styles.textfieldBigContainerRM}>
            <div className={styles.textfieldSubContainerM}>
              <h2 className={styles.normalTextM}>Location</h2>
            </div>
            <textarea
              name="Location"
              className={styles.locationTextfieldM}
              rows={4}
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  src={`https://maps.google.com/maps?output=embed&q=${encodeURIComponent(
                    formData.location
                  )}`}
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
          <button className={styles.closeButtonM} onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editinfo;
