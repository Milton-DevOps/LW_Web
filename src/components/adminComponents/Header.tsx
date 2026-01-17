'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import NotificationModal from './NotificationModal';
import EditProfileModal from './EditProfileModal';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300"
        style={{ backgroundColor: colorScheme.background }}
      >
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 gap-3 md:gap-6 overflow-x-auto">
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
              <div>
                <p className="font-bold text-xs md:text-sm" style={{ color: colorScheme.primary }}>
                  Light World
                </p>
                <p className="text-xs" style={{ color: colorScheme.textSecondary }}>
                  Mission Admin
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-xs md:max-w-md">
            <div
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: colorScheme.textSecondary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1 text-xs md:text-sm"
                style={{ color: colorScheme.text }}
              />
            </div>
          </div>

          {/* Right Section - Icons & User Menu */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Notification Icon */}
            <Button
              onClick={() => setIsNotificationModalOpen(true)}
              className="!p-2 md:!p-2.5 !bg-transparent relative hover:opacity-70"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: colorScheme.textSecondary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <div
                className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                style={{ backgroundColor: colorScheme.tertiary }}
              ></div>
            </Button>

            {/* User Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={toggleDropdown}
                className="flex items-center gap-1.5 md:gap-2.5 !p-1 md:!p-1.5 !bg-transparent hover:opacity-70"
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
              >
                {user?.profilePicture?.url ? (
                  <img
                    src={user.profilePicture.url}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: colorScheme.primary }}
                  >
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
                <span className="hidden md:block text-xs md:text-sm font-medium" style={{ color: colorScheme.text }}>
                  {user?.firstName} {user?.lastName}
                </span>
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="fixed right-6 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ 
                    backgroundColor: colorScheme.surface,
                    zIndex: 9999,
                    top: '64px',
                    width: '192px'
                  }}
                >
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:opacity-70"
                    style={{ color: colorScheme.text }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/auth/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:opacity-70"
                    style={{ color: colorScheme.text }}
                  >
                    Settings
                  </button>
                  <hr style={{ borderColor: colorScheme.border }} />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                      localStorage.removeItem('token');
                      router.push('/auth/login');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:opacity-70"
                    style={{ color: colorScheme.primary }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        colorMode={colorScheme}
      />
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        colorMode={colorScheme}
      />
    </>
  );
};

export default Header;

