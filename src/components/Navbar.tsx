'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, handleLogout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [isHydrated, setIsHydrated] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Books', href: '/books' },
    { label: 'Programs & Services', href: '/programs' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  // Set hydrated flag and use pathname from router
  useEffect(() => {
    setIsHydrated(true);
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
            ? 'bg-black/35 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10'
            : 'bg-black/50 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with enhanced animation */}
            <Link
              href="/"
              className="flex-shrink-0 group"
              onClick={() => setActiveLink('/')}
            >
              <div className="relative">
                <div className="text-3xl font-bold tracking-wider text-white group-hover:text-[#cb4154] transition-all duration-500 ease-out">
                  LWM
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e09510] group-hover:w-full transition-all duration-500 ease-out"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#cb4154] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation Links with enhanced animations */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`px-4 py-2 text-sm font-medium relative group transition-all duration-300 ${
                    activeLink === link.href
                      ? 'text-[#cb4154]'
                      : 'text-white hover:text-[#e09510]'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute inset-0 bg-white/5 rounded-lg scale-95 group-hover:scale-100 transition-transform duration-300"></div>
                  </div>
                  
                  {/* Active indicator */}
                  {activeLink === link.href && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-[#cb4154] rounded-full animate-pulse"></div>
                      <div className="w-8 h-0.5 bg-[#e09510] mt-1 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#e09510] group-hover:w-8 transition-all duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Right Section - Auth & Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login">
                    <Button
                      size="sm"
                      className="relative overflow-hidden group animate-fadeIn bg-transparent border border-white/30 text-white hover:border-[#cb4154] hover:text-[#cb4154] hover:scale-105 hover:shadow-lg hover:shadow-[#cb4154]/20 transition-all duration-500"
                    >
                      <span className="relative z-10">Login</span>
                      <div className="absolute inset-0 bg-[#cb4154] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      variant="primary"
                      size="sm"
                      className="relative overflow-hidden group animate-fadeIn bg-[#cb4154] border border-[#cb4154] text-white hover:bg-transparent hover:text-[#cb4154] hover:scale-105 hover:shadow-lg hover:shadow-[#cb4154]/30 transition-all duration-500"
                    >
                      <span className="relative z-10">Join Us</span>
                      <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </Button>
                  </Link>
                </>
              ) : (
                /* Profile Dropdown with enhanced animations */
                <div ref={profileDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsAnimating(true);
                      setTimeout(() => setIsAnimating(false), 300);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 animate-fadeIn ${
                      isProfileOpen 
                        ? 'bg-white/20 shadow-lg shadow-white/10' 
                        : 'hover:bg-white/10'
                    } ${isAnimating ? 'scale-95' : ''}`}
                    title="User profile menu"
                    aria-label="User profile menu"
                  >
                    <div className="relative">
                      {profilePictureUrl ? (
                        <img
                          src={profilePictureUrl}
                          alt={user?.firstName}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#cb4154] shadow-lg"
                        />
                      ) : (
                        <div className="relative w-9 h-9 rounded-full bg-[#cb4154] flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {getInitials()}
                          <div className="absolute inset-0 rounded-full border-2 border-[#e09510] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:inline">
                      {user?.firstName}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white transition-all duration-500 ${
                        isProfileOpen ? 'rotate-180 text-[#e09510]' : ''
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

                  {/* Enhanced Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden animate-dropdown">
                      <div className="relative">
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#cb4154] to-transparent"></div>
                        
                        <div className="px-5 py-4 border-b border-white/10">
                          <p className="text-sm font-semibold text-white flex items-center">
                            <span className="mr-2">👤</span>
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <span className="mr-2">✉️</span>
                            {user?.email}
                          </p>
                        </div>
                        
                        <div className="py-2">
                          <Link href="/auth/edit-profile">
                            <button
                              type="button"
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full text-left px-5 py-3 text-sm text-white hover:bg-[#cb4154]/20 hover:text-[#cb4154] transition-all duration-300 flex items-center group"
                              title="Edit profile"
                            >
                              <span className="mr-3 text-lg">⚙️</span>
                              <span>Edit Profile</span>
                              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                            </button>
                          </Link>
                          <div className="px-5 py-1">
                            <div className="h-px bg-white/10"></div>
                          </div>
                          <button
                            type="button"
                            onClick={handleLogoutClick}
                            className="w-full text-left px-5 py-3 text-sm text-white hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 flex items-center group"
                            title="Logout"
                          >
                            <span className="mr-3 text-lg">🚪</span>
                            <span>Logout</span>
                            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                title='menu'
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group"
              >
                <span className={`w-5 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-white mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-[#cb4154] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isOpen && (
            <div className="md:hidden animate-slideDown">
              <div className="px-2 pt-3 pb-4 space-y-1 border-t border-white/10 mt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveLink(link.href);
                    }}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      activeLink === link.href
                        ? 'bg-[#cb4154]/20 text-[#cb4154] border-l-4 border-[#cb4154]'
                        : 'text-white hover:bg-white/10 hover:text-[#e09510] hover:pl-6'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-3">•</span>
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Enhanced Mobile Auth Buttons */}
              <div className="border-t border-white/10 px-2 py-4 space-y-3 bg-black/50 rounded-b-xl">
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
                        className="w-full bg-transparent border border-white/30 text-white hover:border-[#cb4154] hover:text-[#cb4154] hover:scale-[1.02] transition-all duration-300"
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
                        className="w-full bg-[#cb4154] border border-[#cb4154] text-white hover:bg-transparent hover:text-[#cb4154] hover:scale-[1.02] transition-all duration-300"
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
                      <button className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-[#cb4154]/30 hover:text-[#cb4154] transition-all duration-300 flex items-center justify-center">
                        <span className="mr-2">⚙️</span>
                        Edit Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-red-500/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};