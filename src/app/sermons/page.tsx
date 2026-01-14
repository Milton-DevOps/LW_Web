'use client';

import React from 'react';
import { colors } from '../../constants/colors';
import styles from '../pages.module.css';

export default function Sermons() {
  return (
    <div className={`${styles.minHeightScreen} ${styles.bgSurface} ${styles.paddingRem}`}>
      <div className={styles.maxWidthContainer}>
        <h1 className={`${styles.textDark} ${styles.marginBottomRem}`}>Sermons</h1>
        <p className={`${styles.textSecondary} ${styles.lineHeightNormal}`}>
          Listen to inspiring sermons from our spiritual leaders and expand your spiritual journey.
        </p>
      </div>
    </div>
  );
}
