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
                step={1000}  
                marks
                min={1000}
                max={10000}  
                color='secondary'
                className={styles.range}
            />
        </Box>
    );
}
