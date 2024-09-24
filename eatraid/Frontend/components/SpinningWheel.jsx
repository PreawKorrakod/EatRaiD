'use client';
import React, { useState } from 'react';
import styles from './SpinningWheel.module.css'; // ให้สร้างไฟล์ CSS แยกต่างหาก

const SpinningWheel = ({ options }) => {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');

  const spin = () => {
    const randomDegree = Math.floor(Math.random() * 360) + 3600; // หมุนอย่างน้อย 10 รอบ
    setRotation(randomDegree);
    setTimeout(() => {
      const selectedOptionIndex = Math.floor((randomDegree % 360) / (360 / options.length));
      setResult(options[selectedOptionIndex]);
    }, 4000); // รอให้หมุนเสร็จแล้วถึงจะกำหนดผล
  };

  return (
    <div className={styles.wheelContainer}>
      <div 
        className={styles.wheel} 
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4s ease-out' }}
        onClick={spin}
      >
        {options.map((option, index) => (
          <div 
            key={index} 
            className={styles.slice} 
            style={{ transform: `rotate(${(360 / options.length) * index}deg)` }}
          >
            {option}
          </div>
        ))}
      </div>
      <div className={styles.centerButton} onClick={spin}>Spin</div>
      <div className={styles.arrow}>↑</div> {/* ลูกศรแสดงผล */}
      {result && <div className={styles.result}>Result: {result}</div>} {/* แสดงผลลัพธ์ */}
    </div>
  );
};

export default SpinningWheel;
