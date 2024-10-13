import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderDistance.module.css';

function valuetext(value) {
    // แปลงค่าเป็นเมตรหรือกิโลเมตร
    return value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
}

export default function SliderDistance() {
    const [distance, setDistance] = React.useState(100); // กำหนดค่าเริ่มต้นที่ 100 เมตร

    const handleChange = (event, newValue) => {
        setDistance(newValue);
    };

    return (
        <Box className={styles.DistanceRange}>
            <div className={styles.distancelabel}>
                <div className={styles.DistanceHeader}>Distance</div>
                <div className={styles.distanceText}>{valuetext(distance)}</div>
            </div>
            <Slider
                size='big'
                aria-label="Distance"
                value={distance}
                onChange={handleChange}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={100}
                marks
                min={100}
                max={1000}
                color='secondary'
                className={styles.range}
            />
        </Box>
    );
}
