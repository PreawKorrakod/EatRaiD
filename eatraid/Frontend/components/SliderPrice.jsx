import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderPrice.module.css';

function valuetext(value) {
  return `${value} บาท`;
}

const minDistance = 10;

export default function SliderPrice() {
  // กำหนด state สำหรับ value1
  const [value1, setValue1] = React.useState([100, 300]); // ตั้งค่าเริ่มต้น

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    // ตรวจสอบ thumb ว่าเป็นตัวไหนและปรับค่าให้มี minDistance
    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  return (
    <Box className={styles.DistanceRange}>
      <div className={styles.PriceLabel}>
        <div className={styles.PriceHeader}>Price</div>
        <div className={styles.ShowPrice}>{value1[0]} ฿ - {value1[1]} ฿</div>
      </div>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        min={0}      
        max={300}    
        step={10}    
        color='secondary'
        className={styles.Range}
      />
    </Box>
  );
}
