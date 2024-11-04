import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderPrice.module.css';
import { orange } from '@mui/material/colors';

function valuetext(value) {
  return `${value} บาท`;
}

const primary = orange[800];
const minDistance = 10;

export default function SliderPrice({ value, maxPrice, onChange }) {
  // ฟังก์ชันเพื่อคำนวณค่า step ตาม maxPrice
  const getStepValue = (maxPrice) => {
    if (maxPrice <= 100) {
      return 1; // สำหรับราคาต่ำสุด
    } else if (maxPrice <= 1000) {
      return 10; // สำหรับราคาไม่เกิน 1000 บาท
    } else if (maxPrice <= 10000) {
      return 100; // สำหรับราคาไม่เกิน 10000 บาท
    }
    return 1000; // สำหรับราคาเกิน 10000 บาท
  };

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      onChange([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <Box className={styles.DistanceRange}>
      <div className={styles.PriceLabel}>
        <div className={styles.PriceHeader}>Price</div>
        <div className={styles.ShowPrice}>{value[0]} ฿ - {value[1]} ฿</div>
      </div>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        min={0} // Adjust this if necessary
        max={maxPrice} // Adjust this to match your data's price range
        step={getStepValue(maxPrice)} // ใช้ฟังก์ชันเพื่อกำหนดค่า step
        color={primary}
        className={styles.Range}
      />
    </Box>
  );
}
