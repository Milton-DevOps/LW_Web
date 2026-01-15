'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../services/authService';
import { AdminDashboard } from '@/components';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push('/auth/login');
    }
  }, [router]);

  return <AdminDashboard colorMode="light" />;
}
