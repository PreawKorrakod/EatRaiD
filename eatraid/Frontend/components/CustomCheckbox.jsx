'use client';
import React from 'react';
import { useCheckbox, Chip, VisuallyHidden } from "@nextui-org/react";
import styles from './CustomCheckbox.module.css'; 

export const CustomCheckbox = (props) => {
    const {
        children,
        isSelected,
        isFocusVisible,
        getBaseProps,
        getLabelProps,
        getInputProps,
    } = useCheckbox({
        ...props
    })

    // กำหนด className ตามสถานะของ checkbox
    const baseClass = `${styles.checkboxBase} ${isSelected ? styles.checkboxSelected : ''} ${isFocusVisible ? styles.checkboxFocusVisible : ''}`;
    const contentClass = `${styles.checkboxContent} ${isSelected ? styles.checkboxSelectedContent : ''}`;

    return (
        <label {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <Chip
                classNames={{
                    base: baseClass,
                    content: contentClass,
                }}
                color="primary"
                variant="faded"
                {...getLabelProps()}
            >
                {children ? children : isSelected ? "Enabled" : "Disabled"}
            </Chip>
        </label>
    );
}
