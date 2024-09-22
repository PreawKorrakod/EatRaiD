'use client';
import { useState } from 'react';
import styles from './MenuCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { BsPencilSquare, BsXSquareFill, BsFillTrashFill } from "react-icons/bs";

const MenuCard = (props) => {

    const { img, name, type, price } = props;

    return (
        <>
            <div className={styles.content}>
                <div className={styles.main_content}>
                    <div className={styles.singleDest}>
                        <div className={styles.dastImage}>
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} width={300} height={200} />
                        </div>
                        <div className={styles.dastSide}>
                            <div className={styles.foodname}>
                                {name}
                            </div>
                            <div className={styles.typefood}>
                                {type}
                            </div>
                            <div className={styles.menu_buttom}>
                                <div className={styles.pricefood}>
                                    price {price} ฿
                                </div>
                                <button className={styles.Editfood}>
                                    <BsPencilSquare />
                                    Edit
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default MenuCard;