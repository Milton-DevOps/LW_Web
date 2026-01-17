'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/constants/colors';
import Header from './Header';
import Sidebar from './Sidebar';
import ManageSermons from './ManageSermons';
import ManageUsers from './ManageUsers';
import ManageBooks from './ManageBooks';
import ManageDepartments from './ManageDepartments';
import LiveStream from './LiveStream';
import Settings from './Settings';

type DashboardSection = 'dashboard' | 'sermons' | 'live' | 'users' | 'books' | 'departments' | 'settings';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const colorScheme = colors;
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    setActiveSection(section as DashboardSection);
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'sermons':
        return <ManageSermons />;
      case 'live':
        return <LiveStream />;
      case 'users':
        return <ManageUsers />;
      case 'books':
        return <ManageBooks />;
      case 'departments':
        return <ManageDepartments />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
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
        <Sidebar

          onNavigate={handleSectionChange}
          activeSection={activeSection}
          onLogout={handleLogout}
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

const DashboardOverview: React.FC = () => {
  const colorScheme = colors;

  const stats = [
    { label: 'Total Sermons', value: '24', color: '#cb4154' },
    { label: 'Total Users', value: '156', color: '#7e8ba3' },
    { label: 'Total Books', value: '42', color: '#f5a623' },
    { label: 'Engagement Rate', value: '78%', color: '#27ae60' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md transition-transform hover:shadow-lg"
            style={{ backgroundColor: colorScheme.surface }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4"
              style={{ backgroundColor: stat.color, opacity: 0.2 }}
            />
            <p
              className="text-sm font-medium mb-2"
              style={{ color: colorScheme.textSecondary }}
            >
              {stat.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-4 rounded border-l-4 transition-all hover:shadow"
              style={{
                backgroundColor: colorScheme.background,
                borderColor: colorScheme.primary,
              }}
            >
              <div>
                <p className="font-medium">Activity Item {item}</p>
                <p style={{ color: colorScheme.textSecondary }}>
                  2 hours ago
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: '#ffffff',
                }}
              >
                New
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
