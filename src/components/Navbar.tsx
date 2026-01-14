'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from './Button';
import { colors } from '@/constants/colors';

export const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Books', href: '/books' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogoutClick = () => {
    handleLogout();
    setIsProfileOpen(false);
    router.push('/');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const profilePictureUrl = user?.profilePicture?.url;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - colors from constants/colors.ts */}
            <Link
              href="/"
              className="flex-shrink-0 text-2xl font-bold bg-gradient-to-r from-[#cb4154] to-[#e09510] bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300"
            >
              LWM
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-white hover:text-[#cb4154] transition-colors duration-300 relative group"
                >
                  {link.label}
                  {/* Underline gradient uses colors from constants */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#cb4154] to-[#e09510] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Section - Auth & Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="animate-fadeIn"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      variant="primary"
                      size="sm"
                      className="animate-fadeIn hover:scale-105 transition-transform duration-300"
                    >
                      Join Us
                    </Button>
                  </Link>
                </>
              ) : (
                /* Profile Dropdown */
                <div ref={profileDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-300 animate-fadeIn"
                    title="User profile menu"
                    aria-label="User profile menu"
                  >
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt={user?.firstName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#cb4154]"
                      />
                    ) : (
                      /* Avatar background uses primary color from constants */
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cb4154] to-[#e09510] flex items-center justify-center text-sm font-bold text-white">
                        {getInitials()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-white hidden sm:inline">
                      {user?.firstName}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        isProfileOpen ? 'rotate-180' : ''
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
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-semibold text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <Link href="/auth/edit-profile">
                        <button
                          type="button"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#cb4154] hover:bg-opacity-20 transition-colors duration-300"
                          title="Edit profile"
                        >
                          Edit Profile
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 hover:bg-opacity-20 transition-colors duration-300 border-t border-gray-700"
                        title="Logout"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                title='menu'
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-300"
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isOpen
                        ? 'M6 18L18 6M6 6l12 12'
                        : 'M4 6h16M4 12h16M4 18h16'
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden animate-fadeIn">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 hover:text-[#cb4154] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-gray-700 px-2 py-3 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        className="w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="w-full"
                      >
                        Join Us
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/edit-profile"
                      className="block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="w-full px-3 py-2 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-[#cb4154] hover:bg-opacity-30 transition-colors duration-300">
                        Edit Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-3 py-2 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-red-600 hover:bg-opacity-30 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under navbar */}
      <div className="h-20"></div>
    </>
  );
};
