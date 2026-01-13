'use client';

import React, { useState } from 'react';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

interface SidebarProps {
  colorMode?: 'light' | 'dark';
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  subItems?: Array<{ label: string; href: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ colorMode = 'light', isOpen = true, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const colorScheme = colors[colorMode];

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
        </svg>
      ),
      label: 'Dashboard',
      href: '/admin',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Profile',
      href: '/admin/profile',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4" />
        </svg>
      ),
      label: 'Folders',
      href: '/admin/folders',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      label: 'Notification',
      href: '/admin/notifications',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Messages',
      href: '/admin/messages',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Help Center',
      href: '/admin/help',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      label: 'Settings',
      href: '/admin/settings',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 transition-opacity duration-300"
          onClick={onClose}
          style={{
            animation: isOpen ? 'fadeIn 0.3s ease-in' : 'fadeOut 0.3s ease-out',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen pt-20 transition-all duration-300 z-40 overflow-y-auto
          ${isOpen ? 'w-64' : 'w-20'} lg:w-64 lg:translate-x-0
          ${!isOpen ? '-translate-x-full lg:translate-x-0' : ''}
        `}
        style={{
          backgroundColor: colorScheme.surface,
          borderRight: `1px solid ${colorScheme.border}`,
        }}
      >
        {/* Navigation Menu */}
        <nav className="px-3 py-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              <Button
                onClick={() => item.subItems && toggleExpand(item.label)}
                className="w-full group relative !justify-between !px-4 !py-3"
                style={{
                  backgroundColor: expandedItems.includes(item.label)
                    ? colorScheme.primary
                    : colorScheme.background,
                  color: expandedItems.includes(item.label)
                    ? '#ffffff'
                    : colorScheme.text,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex-shrink-0 p-2 rounded-lg transition-transform duration-300"
                    style={{
                      backgroundColor: expandedItems.includes(item.label)
                        ? 'rgba(255, 255, 255, 0.2)'
                        : colorScheme.primary,
                      color: expandedItems.includes(item.label) ? '#ffffff' : '#ffffff',
                    }}
                  >
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="font-medium truncate whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Badge */}
                {item.badge && isOpen && (
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

                {/* Expand Arrow */}
                {item.subItems && isOpen && (
                  <svg
                    className={`w-4 h-4 ml-auto flex-shrink-0 transition-transform duration-300 ${
                      expandedItems.includes(item.label) ? 'rotate-180' : ''
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
                )}
              </Button>

              {/* Submenu Items */}
              {item.subItems && expandedItems.includes(item.label) && isOpen && (
                <div
                  className="ml-4 mt-2 space-y-1 pl-4 border-l-2 animate-in slide-in-from-top duration-200"
                  style={{ borderColor: colorScheme.primary }}
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                      style={{
                        color: colorScheme.textSecondary,
                        backgroundColor: colorScheme.background,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = colorScheme.primary;
                        (e.currentTarget as HTMLElement).style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = colorScheme.background;
                        (e.currentTarget as HTMLElement).style.color = colorScheme.textSecondary;
                      }}
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isOpen && (
          <div
            className="absolute bottom-0 left-0 right-0 p-4 border-t animate-in fade-in slide-in-from-bottom duration-300"
            style={{ borderColor: colorScheme.border }}
          >
            <Button
              className="w-full"
              style={{
                backgroundColor: colorScheme.primary,
                color: '#ffffff',
              }}
            >
              🗝 LOGOUT
            </Button>
          </div>
        )}
      </aside>

      {/* Adjust main content area */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
