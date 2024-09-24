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
                            <Image src={img} alt={`Restaurant ${name}`} className={styles.Imagecover} />
                        </div>
                        <div className={styles.dastSide}>
                            <div className={styles.textinfo}>
                                <div className={styles.foodname}>
                                    <h5>{name}</h5>
                                </div>
                                <div className={styles.typefood}>
                                    {type}
                                </div>
                                <div className={styles.pricefood}>
                                    Price {price} ฿
                                </div>
                            </div>
                            <div className={styles.menu_buttom}>
                                <button className={styles.Editfood}>
                                    <BsPencilSquare className={styles.Editicon} />
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