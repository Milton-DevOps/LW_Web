'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';

interface HeaderProps {
  colorMode?: 'light' | 'dark';
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ colorMode = 'light', onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = colors[colorMode];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div className="flex items-center justify-between px-6 py-4 gap-6">
        {/* Left Section - Menu Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Button
            onClick={onMenuToggle}
            className="lg:hidden !p-2 !bg-transparent"
            aria-label="Toggle menu"
            style={{ color: colorScheme.primary }}
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md">
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300"
            style={{ backgroundColor: colorScheme.surface }}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
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
              className="bg-transparent outline-none flex-1 text-sm"
              style={{ color: colorScheme.text }}
            />
          </div>
        </div>

        {/* Right Section - Icons & User Menu */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notification Icon */}
          <Button
            className="!p-2.5 !bg-transparent relative hover:opacity-70"
            aria-label="Notifications"
          >
            <svg
              className="w-6 h-6"
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
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: colorScheme.tertiary }}
            ></div>
          </Button>

          {/* User Menu Dropdown */}
          <div className="relative">
            <Button
              onClick={toggleDropdown}
              className="flex items-center gap-2.5 !p-1.5 !bg-transparent hover:opacity-70"
              aria-expanded={isDropdownOpen ? 'true' : 'false'}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: colorScheme.primary }}
              >
                RW
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: colorScheme.text }}>
                ROBERT WILLIAM
              </span>
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: colorScheme.text }}
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: colorScheme.text }}
                >
                  Settings
                </a>
                <hr style={{ borderColor: colorScheme.border }} />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm transition-colors duration-200"
                  style={{ color: colorScheme.primary }}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

