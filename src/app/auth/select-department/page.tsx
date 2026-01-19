'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';
import { colors } from '../../../constants/colors';
import { getUser } from '../../../services/authService';
import styles from '../auth.module.css';

export default function SelectDepartment() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is a head_of_department
    const user = getUser();
    if (!user || user.role !== 'head_of_department') {
      // Redirect to login if not authorized
      router.push('/auth/login');
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  const handleNext = () => {
    if (!selectedDepartment) {
      alert('Please select a department');
      return;
    }

    setLoading(true);

    // Navigate based on selected department
    if (selectedDepartment === 'audio_visual') {
      window.location.href = '/mediaDepartment';
    } else if (selectedDepartment === 'daily_light_books') {
      window.location.href = '/dailyLightDepartment';
    }
  };

  if (!isAuthorized) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <p className="text-center">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authFormSection}>
          <h2 className={styles.authTitle}>
            SELECT YOUR DEPARTMENT
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Please select the department you manage
          </p>

          <div className="space-y-4">
            {/* Audio Visual Department Checkbox */}
            <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#cb4154] transition-colors" style={{ backgroundColor: selectedDepartment === 'audio_visual' ? '#f5e6e8' : 'white' }}>
              <input
                type="checkbox"
                checked={selectedDepartment === 'audio_visual'}
                onChange={() => setSelectedDepartment(selectedDepartment === 'audio_visual' ? null : 'audio_visual')}
                className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-[#cb4154]"
              />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Audio Visual Department</p>
                <p className="text-sm text-gray-600">Manage live streams, videos, and media content</p>
              </div>
            </label>

            {/* Daily Light and Books Department Checkbox */}
            <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#cb4154] transition-colors" style={{ backgroundColor: selectedDepartment === 'daily_light_books' ? '#f5e6e8' : 'white' }}>
              <input
                type="checkbox"
                checked={selectedDepartment === 'daily_light_books'}
                onChange={() => setSelectedDepartment(selectedDepartment === 'daily_light_books' ? null : 'daily_light_books')}
                className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer accent-[#cb4154]"
              />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Daily Light & Books Department</p>
                <p className="text-sm text-gray-600">Manage devotionals, books, and daily content</p>
              </div>
            </label>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => router.push('/auth/login')}
              variant="secondary"
              className="flex-1"
              disabled={loading}
            >
              Back to Login
            </Button>
            <Button
              onClick={handleNext}
              variant="primary"
              className="flex-1"
              disabled={loading || !selectedDepartment}
            >
              {loading ? 'Loading...' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
