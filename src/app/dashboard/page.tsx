'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../services/authService';
import { colors } from '../../constants/colors';
import styles from '../pages.module.css';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className={`${styles.minHeightScreen} ${styles.flexCenter} ${styles.bgSurface}`}>
      <div className={styles.cardContainer}>
        <h1 className={`${styles.textDark} ${styles.marginBottomRem}`}>Dashboard</h1>
        <p className={styles.textSecondary}>Welcome to your dashboard</p>
      </div>
    </div>
  );
}
