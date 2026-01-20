'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/constants/colors';
import { getToken, getUser } from '@/services/authService';
import Header from '../adminComponents/Header';
import DLSidebar from './DLSidebar';
import AddBooks from './AddBooks';
import ListBooks from './ListBooks';
import ManageMembers from './ManageMembers';
import Announcements from './Announcements';

type DashboardSection = 'dashboard' | 'books' | 'add-books' | 'members' | 'announcements';

const DailyLightDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const colorScheme = colors;
  const router = useRouter();
  const user = getUser();

  const handleSectionChange = (section: string) => {
    setActiveSection(section as DashboardSection);
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear token and user data from all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=;path=/;max-age=0';
    document.cookie = 'user_role=;path=/;max-age=0';
    router.push('/auth/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'add-books':
        return <AddBooks />;
      case 'books':
        return <ListBooks />;
      case 'members':
        return <ManageMembers />;
      case 'announcements':
        return <Announcements />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}
    >
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Container */}
      <div className="flex flex-1 mt-14 md:mt-16">
        {/* Sidebar */}
        <DLSidebar
          onNavigate={handleSectionChange}
          activeSection={activeSection}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 lg:hidden z-30 mt-14 md:mt-16"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto w-full lg:ml-64">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<{ user: any }> = ({ user }) => {
  const colorScheme = colors;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Department Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-lg shadow-md animate-pulse"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <div className="w-12 h-12 rounded-lg mb-4 bg-gray-300" />
              <div className="h-4 bg-gray-300 rounded mb-2" />
              <div className="h-8 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const actionCards = [
    {
      label: 'Books Management',
      value: 'Manage',
      color: '#f5a623',
      icon: '📚',
      description: 'Add, edit, and manage books',
    },
    {
      label: 'Members',
      value: 'Manage',
      color: '#7e8ba3',
      icon: '👥',
      description: 'Manage department members',
    },
    {
      label: 'Announcements',
      value: 'Send',
      color: '#27ae60',
      icon: '📢',
      description: 'Send notifications to members',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Daily Light & Books Department</h1>
          <p className="mt-2" style={{ color: colorScheme.textSecondary }}>
            Welcome back, {user?.firstName}! Manage your department content here.
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {actionCards.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{ backgroundColor: colorScheme.surface }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl"
              style={{ backgroundColor: card.color, opacity: 0.1 }}
            >
              {card.icon}
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: colorScheme.textSecondary }}
            >
              {card.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-xs mt-2" style={{ color: colorScheme.textSecondary }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Department Overview Section */}
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">📋</span> Department Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p style={{ color: colorScheme.textSecondary }} className="text-sm">
              Department Name
            </p>
            <p className="font-bold mt-1">Daily Light & Books</p>
          </div>
          <div>
            <p style={{ color: colorScheme.textSecondary }} className="text-sm">
              Your Role
            </p>
            <p className="font-bold mt-1">Head of Department</p>
          </div>
          <div>
            <p style={{ color: colorScheme.textSecondary }} className="text-sm">
              Last Updated
            </p>
            <p className="font-bold mt-1">Just now</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📚</span> Books Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Total Books</span>
              <span className="font-bold text-lg" style={{ color: '#f5a623' }}>
                0
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Published</span>
              <span className="font-bold text-lg" style={{ color: '#27ae60' }}>
                0
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Drafts</span>
              <span className="font-bold text-lg" style={{ color: '#e74c3c' }}>
                0
              </span>
            </div>
          </div>
        </div>

        {/* Members Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">👥</span> Members Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Total Members</span>
              <span className="font-bold text-lg" style={{ color: '#7e8ba3' }}>
                0
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Active Members</span>
              <span className="font-bold text-lg" style={{ color: '#2ecc71' }}>
                0
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: colorScheme.textSecondary }}>Pending Invites</span>
              <span className="font-bold text-lg" style={{ color: '#f39c12' }}>
                0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLightDashboard;
