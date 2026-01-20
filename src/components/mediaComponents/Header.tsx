'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const colorScheme = colors;
  const { user, handleLogout } = useAuthContext();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=;path=/;max-age=0';
    document.cookie = 'user_role=;path=/;max-age=0';
    router.push('/auth/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 gap-3 md:gap-6">
        {/* Left Section - Menu Toggle & Logo */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Button
            onClick={onMenuToggle}
            className="lg:hidden !p-2 !bg-transparent"
            aria-label="Toggle menu"
            style={{ color: colorScheme.primary }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>

          {/* Church Logo and Name */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm"
              style={{ backgroundColor: colorScheme.primary }}
            >
              LW
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm md:text-base font-bold">Light World</h1>
              <p
                className="text-xs"
                style={{ color: colorScheme.textSecondary }}
              >
                Department Head
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Go to Home Button */}
          <Link href="/">
            <button
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold text-white bg-[#e09510] hover:bg-[#d88409] transition-colors duration-300 flex items-center gap-2"
              title="Go to Home"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-8-4l4-2" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
          </Link>
        </div>

        {/* Profile Dropdown - Moved to the right section */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0" ref={dropdownRef}>
          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              onClick={toggleDropdown}
              className="!p-2 !bg-transparent flex items-center gap-2"
              style={{ color: colorScheme.text }}
            >
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm"
                style={{ backgroundColor: colorScheme.primary }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p
                  className="text-xs"
                  style={{ color: colorScheme.textSecondary }}
                >
                  {user?.role === 'head_of_department' ? 'Department Head' : user?.role}
                </p>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <div className="p-3 border-b" style={{ borderColor: colorScheme.border }}>
                  <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p
                    className="text-xs"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      router.push('/auth/edit-profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:rounded-lg transition-all"
                    style={{
                      color: colorScheme.text,
                      backgroundColor: `${colorScheme.primary}10`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colorScheme.primary}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colorScheme.primary}10`;
                    }}
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => {
                      router.push('/auth/password-reset');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:rounded-lg transition-all mt-1"
                    style={{
                      color: colorScheme.text,
                      backgroundColor: `${colorScheme.primary}10`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colorScheme.primary}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colorScheme.primary}10`;
                    }}
                  >
                    Change Password
                  </button>
                </div>

                <div className="border-t p-2" style={{ borderColor: colorScheme.border }}>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:rounded-lg transition-all"
                    style={{
                      backgroundColor: '#ff6b6b20',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff6b6b30';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff6b6b20';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
