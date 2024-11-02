import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderDistance.module.css';

function valuetext(value) {
    return  `${Math.ceil(value / 1000)} Km`;; // แปลงเป็นกิโลเมตรสำหรับการแสดงผล
}

export default function SliderDistance({ distanceValue, setDistanceValue, maxDistance }) {
    const handleChange = (event, newValue) => {
        setDistanceValue(newValue);
    };

    return (
        <Box className={styles.DistanceRange}>
            <div className={styles.distancelabel}>
                <div className={styles.DistanceHeader}>Distance</div>
                <div className={styles.distanceText}>{valuetext(distanceValue)}</div>
            </div>
            <Slider
                size='big'
                aria-label="Distance"
                value={distanceValue}
                onChange={handleChange}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1000}
                marks
                min={1000}  // ค่าเริ่มต้นเป็น 1 กิโลเมตร
                max={maxDistance}// กำหนดค่า max ตาม maxDistance ที่คำนวณได้
                color='secondary'
                className={styles.range}
            />
        </Box>
    );
}
