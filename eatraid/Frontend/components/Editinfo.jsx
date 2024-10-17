import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePicture } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import { FaLine } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import styles from "./Editinfo.module.css";
import { FaCheckCircle } from "react-icons/fa";

const Editinfo = ({
  userId,
  formData,
  setFormData,
  isModalOpen,
  setIsModalOpen,
  openday,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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
    if (file) {
      setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedState = selectedBusinessDays.map((item, i) =>
      i === index ? !item : item
    );
    setSelectedBusinessDays(updatedCheckedState);
  };

  const handleSaveClick = () => {
    setIsPopupVisible(true);
    console.log("Data saved:", formData);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Set selectedBusinessDays based on openday prop
  useEffect(() => {
    const selectedDays = formData.businessDay
      .split(",")
      .map((day) => day === "true");
    setSelectedBusinessDays(selectedDays);
  }, [formData.businessDay]);

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

          <FaCheckCircle className={styles.checkIcon}/>
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
