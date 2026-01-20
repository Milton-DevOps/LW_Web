'use client';

import React from 'react';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (section: string) => void;
  activeSection?: string;
  onLogout?: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  onClose,
  onNavigate,
  activeSection = 'dashboard',
  onLogout
}) => {
  const colorScheme = colors;

  const menuItems: MenuItem[] = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
        </svg>
      ),
      label: 'Dashboard',
      id: 'dashboard',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
        </svg>
      ),
      label: 'Manage Sermons',
      id: 'sermons',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Live Sessions',
      id: 'live',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z" />
        </svg>
      ),
      label: 'Manage Members',
      id: 'members',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      label: 'Announcements',
      id: 'announcements',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: 'Church Projects',
      id: 'projects',
    },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 md:top-16 bottom-0 transition-all duration-300 z-40 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-48 md:w-56 lg:w-64
        `}
        style={{
          backgroundColor: colorScheme.surface,
          borderRight: `1px solid ${colorScheme.border}`,
        }}
      >
        {/* Navigation Menu */}
        <nav className="hidden lg:flex flex-col space-y-1 py-2 sm:py-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item.id)}
              data-section={item.id}
              className="w-full group relative justify-between px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: activeSection === item.id
                  ? colorScheme.primary
                  : colorScheme.background,
                color: activeSection === item.id
                  ? '#ffffff'
                  : colorScheme.text,
              }}
            >
              <div
                className="flex-shrink-0 p-2 rounded-lg transition-transform duration-300"
                style={{
                  backgroundColor: activeSection === item.id
                    ? 'rgba(255, 255, 255, 0.2)'
                    : colorScheme.primary,
                  color: '#ffffff',
                }}
              >
                {item.icon}
              </div>
              <span className="font-medium flex-1 text-left truncate">
                {item.label}
              </span>
              {item.badge && (
                <span
                  className="ml-2 flex-shrink-0 px-2 py-1 text-xs font-bold rounded-full"
                  style={{
                    backgroundColor: colorScheme.tertiary,
                    color: colorScheme.background,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-3"
          style={{ borderColor: colorScheme.border }}
        >
          <Button
            onClick={onLogout}
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            🗝 LOGOUT
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
