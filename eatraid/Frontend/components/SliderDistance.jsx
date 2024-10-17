import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderDistance.module.css';

function valuetext(value) {
    return value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
}

export default function SliderDistance({ distanceValue, setDistanceValue }) {
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
                step={100}  // step ระยะ 100 เมตร
                marks
                min={100}
                max={1000}  // ค่า max เปลี่ยนเป็น 1000 เมตร (1 กิโลเมตร)
                color='secondary'
                className={styles.range}
            />
        </Box>
    );
}
