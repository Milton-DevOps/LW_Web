'use client';

import React from 'react';
import { colors } from '../../constants/colors';
import styles from '../pages.module.css';

export default function Projects() {
  return (
    <div className={`${styles.minHeightScreen} ${styles.bgSurface} ${styles.paddingRem}`}>
      <div className={styles.maxWidthContainer}>
        <h1 className={`${styles.textDark} ${styles.marginBottomRem}`}>Projects</h1>
        <p className={`${styles.textSecondary} ${styles.lineHeightNormal}`}>
          Explore our ongoing projects and initiatives that are making a difference around the world.
        </p>
      </div>
    </div>
  );
}
