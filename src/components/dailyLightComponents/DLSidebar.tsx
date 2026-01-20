'use client';

import React, { useState, useEffect } from 'react';
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
}

const DLSidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  onNavigate,
  activeSection = 'dashboard',
  onLogout
}) => {
  const colorScheme = colors;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.228 6.228 2 10.228 2 15s4.228 8.772 10 8.772 10-4.228 10-8.772c0-4.772-4.228-8.747-10-8.747z" />
        </svg>
      ),
      label: 'Books',
      id: 'books',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: 'Add Book',
      id: 'add-books',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z" />
        </svg>
      ),
      label: 'Members',
      id: 'members',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 15.5V11a6 6 0 00-9-5.197V5a2 2 0 00-2 2v12a2 2 0 002 2h4.268a2 2 0 011.897 1.13z" />
        </svg>
      ),
      label: 'Announcements',
      id: 'announcements',
    },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 md:top-16 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-64 transition-all duration-300 z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:top-0`}
        style={{
          backgroundColor: colorScheme.surface,
          borderRight: `1px solid ${colorScheme.border}`,
        }}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              data-section={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'font-semibold'
                  : 'hover:bg-opacity-50'
              }`}
              style={{
                backgroundColor: activeSection === item.id ? colors.primary : 'transparent',
                color: activeSection === item.id ? '#ffffff' : colorScheme.text,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t" style={{ borderColor: colorScheme.border }}>
          <Button
            onClick={onLogout}
            variant="secondary"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default DLSidebar;
