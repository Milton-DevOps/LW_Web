'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser } from '../../services/authService';
import MediaDepartmentDashboard from '@/components/mediaComponents/MediaDepartmentDashboard';

export default function MediaDepartmentPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    // Check if user is authenticated
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Check if user is head of department or admin
    if (user?.role !== 'head_of_department' && user?.role !== 'admin') {
      router.push('/');
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <MediaDepartmentDashboard />;
}
