'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/constants/colors';
import { dashboardService } from '@/services/dashboardService';
import { useAuthContext } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import ManageSermons from './ManageSermons';
import ManageUsers from './ManageUsers';
import ManageBooks from './ManageBooks';
import ManageDepartments from './ManageDepartments';
import ManageChurchProjects from '../mediaComponents/ManageChurchProjects';
import LiveStream from './LiveStream';
import Settings from './Settings';

type DashboardSection = 'dashboard' | 'sermons' | 'live' | 'users' | 'books' | 'departments' | 'projects' | 'settings';

interface DashboardStats {
  sermons: {
    totalSermons: number;
    publishedSermons: number;
    draftSermons: number;
    totalViews: number;
  };
  books: {
    totalBooks: number;
    publishedBooks: number;
    draftBooks: number;
    totalDownloads: number;
  };
  liveStreams: {
    totalStreams: number;
    liveStreams: number;
    scheduledStreams: number;
    endedStreams: number;
    totalViewers: number;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  departments: {
    totalDepartments: number;
    activeDepartments: number;
  };
}

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
    // Clear token and user data from all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=;path=/;max-age=0';
    document.cookie = 'user_role=;path=/;max-age=0';
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
      case 'projects':
        return <ManageChurchProjects />;
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
  const { token, user, loading: authLoading } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Wait for auth context to initialize
    if (authLoading) {
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[DashboardOverview] Token available:', !!token);
        console.log('[DashboardOverview] User role:', user?.role);
        
        if (!token) {
          setError('Authentication required. Please log in again.');
          // Redirect to login
          setTimeout(() => {
            router.push('/auth/login');
          }, 1000);
          return;
        }

        if (user?.role !== 'admin') {
          setError('Admin access required. You do not have permission to access this page.');
          // Redirect to home
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        const dashboardStats = await dashboardService.getAllDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard statistics';
        setError(errorMessage);
        
        // If unauthorized, redirect to login
        if (errorMessage.includes('Unauthorized')) {
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token, user, router, authLoading]);

  const statCards = [
    {
      label: 'Total Sermons',
      value: stats?.sermons.totalSermons || 0,
      color: '#cb4154',
      icon: '📺',
    },
    {
      label: 'Total Users',
      value: stats?.users.totalUsers || 0,
      color: '#7e8ba3',
      icon: '👥',
    },
    {
      label: 'Total Books',
      value: stats?.books.totalBooks || 0,
      color: '#f5a623',
      icon: '📚',
    },
    {
      label: 'Live Streams',
      value: stats?.liveStreams.totalStreams || 0,
      color: '#27ae60',
      icon: '🔴',
    },
    {
      label: 'Total Views',
      value: (stats?.sermons.totalViews || 0) + (stats?.liveStreams.totalViewers || 0),
      color: '#3498db',
      icon: '👁️',
    },
    {
      label: 'Total Downloads',
      value: stats?.books.totalDownloads || 0,
      color: '#e74c3c',
      icon: '⬇️',
    },
    {
      label: 'Active Users',
      value: stats?.users.activeUsers || 0,
      color: '#2ecc71',
      icon: '✓',
    },
    {
      label: 'Departments',
      value: stats?.departments.totalDepartments || 0,
      color: '#9b59b6',
      icon: '🏢',
    },
  ];

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
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

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h1>
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <div className="text-red-600 font-medium">
            ⚠️ Error: {error}
          </div>
          <p className="mt-2" style={{ color: colorScheme.textSecondary }}>
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: colors.primary,
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
            style={{ backgroundColor: colorScheme.surface }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl"
              style={{ backgroundColor: stat.color, opacity: 0.1 }}
            >
              {stat.icon}
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: colorScheme.textSecondary }}
            >
              {stat.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Stats Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sermon Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📺</span> Sermon Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Published</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {stats?.sermons.publishedSermons || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Drafts</span>
              <span className="font-bold text-yellow-600">
                {stats?.sermons.draftSermons || 0}
              </span>
            </div>
            <div className="flex justify-between items-center" style={{ color: colorScheme.textSecondary }}>
              <span>Total Views</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {(stats?.sermons.totalViews || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Book Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📚</span> Book Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Published</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {stats?.books.publishedBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Drafts</span>
              <span className="font-bold text-yellow-600">
                {stats?.books.draftBooks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center" style={{ color: colorScheme.textSecondary }}>
              <span>Total Downloads</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {(stats?.books.totalDownloads || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Live Stream Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🔴</span> Live Stream Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Currently Live</span>
              <span className="font-bold text-red-600">
                {stats?.liveStreams.liveStreams || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Scheduled</span>
              <span className="font-bold text-blue-600">
                {stats?.liveStreams.scheduledStreams || 0}
              </span>
            </div>
            <div className="flex justify-between items-center" style={{ color: colorScheme.textSecondary }}>
              <span>Total Viewers</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {(stats?.liveStreams.totalViewers || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* User & Department Stats */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">👥</span> User & Department Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Active Users</span>
              <span className="font-bold text-green-600">
                {stats?.users.activeUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: colorScheme.border }}>
              <span>Inactive Users</span>
              <span className="font-bold text-gray-600">
                {stats?.users.inactiveUsers || 0}
              </span>
            </div>
            <div className="flex justify-between items-center" style={{ color: colorScheme.textSecondary }}>
              <span>Active Departments</span>
              <span className="font-bold" style={{ color: colors.primary }}>
                {stats?.departments.activeDepartments || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
