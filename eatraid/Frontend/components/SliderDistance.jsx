import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderDistance.module.css';

function valuetext(value) {
    return `${value}°C`;
}

export default function SliderDistance() {
    return (
        <Box className={styles.DistanceRange}>
            <Slider
                size='big'
                aria-label="Temperature"
                defaultValue={30}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={10}
                marks
                min={10}
                max={110}
                color='secoundery'
            />
        </Box>
    );
}
