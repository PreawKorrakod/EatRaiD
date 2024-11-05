import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderDistance.module.css';
import { orange } from '@mui/material/colors';

function valuetext(value) {
    return `${(value >= 1000) ? Math.ceil(value / 1000) : value} ${(value >= 1000) ? 'Km' : 'm'}`;
}
const primary = orange[800];

export default function SliderDistance({ distanceValue, setDistanceValue, maxDistance }) {
    const handleChange = (event, newValue) => {
        setDistanceValue(newValue);
    };

    // กำหนดค่า step ตามระยะ maxDistance
    // const step = maxDistance < 1000 ? 10 : maxDistance <= 5000 ? 500 : 1000;

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
                min={1000} // เริ่มจาก 100 เมตรถ้าระยะทางสั้น
                // max={maxDistance} // กำหนดค่า max ตาม maxDistance ที่คำนวณได้
                max={maxDistance}
                color={primary}
                className={styles.range}
            />
        </Box>
    );
}
