import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './SliderPrice.module.css';

function valuetext(value) {
  return `${value} บาท`;
}

const minDistance = 10;

export default function SliderPrice({ value, onChange }) {
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
        max={300} // Adjust this to match your data's price range
        step={10}
        color='secondary'
        className={styles.Range}
      />
    </Box>
  );
}
