import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePicture } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import { FaLine } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import styles from "./Editinfo.module.css"; // Import styles from CSS Module

const Editinfo = ({ userId, formData, setFormData, isModalOpen, setIsModalOpen }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const businessDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [selectedBusinessDays, setSelectedBusinessDays] = useState([]);

    // Initialize selectedBusinessDays from formData when the component mounts
    
    useEffect(() => {
        if (formData.selectedBusinessDays) {
            setSelectedBusinessDays(formData.selectedBusinessDays);
        } else {
            setSelectedBusinessDays(new Array(7).fill(false)); // ค่าเริ่มต้นถ้าไม่มีข้อมูล
        }
    }, [formData.selectedBusinessDays]);

    // Function to handle closing the modal
    const handleCloseModal = () => {
        console.log("Modal close button clicked");
        setIsModalOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
        }
    };

    const handleChangeOpenTimeHR = (e) => {
        setFormData({ ...formData, openTimeHR: e.target.value });
    };

    const handleChangeOpenTimeMIN = (e) => {
        setFormData({ ...formData, openTimeMin: e.target.value });
    };

    const handleChangeCloseTimeHR = (e) => {
        setFormData({ ...formData, closeTimeHR: e.target.value });
    };

    const handleChangeCloseTimeMIN = (e) => {
        setFormData({ ...formData, closeTimeMin: e.target.value });
    };

    const handleCheckboxChange = (index) => {
        const updatedDays = [...selectedBusinessDays];
        updatedDays[index] = !updatedDays[index];
        setSelectedBusinessDays(updatedDays);
        // Update formData with the selected days
        setFormData({ ...formData, selectedBusinessDays: updatedDays });
    };

    const handleSaveClick = () => {
        const updatedFormData = {
            ...formData,
            selectedBusinessDays: selectedBusinessDays
        };
        console.log("Data saved:", updatedFormData);
        setIsModalOpen(false);
        // Add backend data submission logic here if necessary
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

    if (!isModalOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.bigContainerM}>
                {/* Close icon */}
                <div className={styles.closeIcon} onClick={handleCloseModal}>
                    <RxCross2 />
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
                                    onClick={() => document.querySelector(`input[type="file"]`).click()}
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
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <h2 className={styles.normalTextM}>Contact</h2>
                                <div className={styles.rowContainerM}>
                                    <div className={styles.contactBoxM}>
                                        <IoCall className={styles.iconStyleM} />
                                        <input
                                            name="Phone"
                                            className={styles.textfieldStyleContactM}
                                            value={formData.contactCall}
                                            onChange={(e) => setFormData({ ...formData, contactCall: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, contactLine: e.target.value })}
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
                                    step="1"
                                    onChange={handleChangeOpenTimeHR}
                                />
                                <h2 className={styles.normalTextM}> : </h2>
                                <input
                                    className={styles.ddTextfieldStyleM}
                                    type="number"
                                    value={formData.openTimeMin}
                                    min="0"
                                    max="59"
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
                                    step="1"
                                    onChange={handleChangeCloseTimeHR}
                                />
                                <h2 className={styles.normalTextM}>:</h2>
                                <input
                                    className={styles.ddTextfieldStyleM}
                                    type="number"
                                    value={formData.closeTimeMin}
                                    min="0"
                                    max="59"
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
                            name="Location"
                            className={styles.locationTextfieldM}
                            rows={4}
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <div className="mapouter">
                            <div className="gmap_canvas">
                                <iframe
                                    src={`https://maps.google.com/maps?output=embed&q=${encodeURIComponent(formData.location)}`}
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
                    {/* Close button */}
                    <button className={styles.closeButtonM} onClick={handleCloseModal}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Editinfo;
