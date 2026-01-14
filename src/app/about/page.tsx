'use client';

import React from 'react';
import { colors } from '../../constants/colors';
import styles from '../pages.module.css';

export default function About() {
  return (
    <div className={`${styles.minHeightScreen} ${styles.bgSurface} ${styles.paddingRem}`}>
      <div className={styles.maxWidthContainer}>
        <h1 className={`${styles.textDark} ${styles.marginBottomRem}`}>About Us</h1>
        <p className={`${styles.textSecondary} ${styles.lineHeightNormal}`}>
          Welcome to Light World Mission. Our organization is dedicated to spreading light and hope around the world.
        </p>
      </div>
    </div>
  );
}
