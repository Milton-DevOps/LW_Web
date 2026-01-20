'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { colors } from '@/constants/colors';
import { departmentService } from '@/services/departmentService';
import { useAuthContext } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import ManageSermons from './ManageSermons';
import LiveSessions from './LiveSessions';
import ManageMembers from './ManageMembers';
import Announcements from './Announcements';
import ManageChurchProjects from './ManageChurchProjects';

type DashboardSection = 'dashboard' | 'sermons' | 'live' | 'members' | 'announcements' | 'projects';

interface DepartmentStats {
  totalMembers: number;
  pendingRequests: number;
  totalSermons: number;
  totalLiveStreams: number;
}

const MediaDepartmentDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const colorScheme = colors;
  const router = useRouter();
  const { user } = useAuthContext();

  // Check authorization
  useEffect(() => {
    if (!user) return;

    // If admin, allow full access
    if (user.role === 'admin') return;

    // If head_of_department, check if they belong to Audio Visual/Media department
    if (user.role === 'head_of_department') {
      const mediaDepts = ['Audio Visual', 'audio_visual', 'Audio-Visual', 'media', 'Media', 'Media Department'];
      if (!mediaDepts.includes(user.department || '')) {
        router.push('/');
        return;
      }
    } else {
      // Not authorized
      router.push('/');
    }
  }, [user, router]);

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
        return <LiveSessions />;
      case 'members':
        return <ManageMembers />;
      case 'announcements':
        return <Announcements />;
      case 'projects':
        return <ManageChurchProjects />;
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
  const { user, loading: authLoading } = useAuthContext();
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading || !user?.department) {
      return;
    }

    const fetchDepartmentStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch department data
        const deptResponse = await departmentService.getDepartmentById(user.department!);
        const dept = deptResponse.department;

        // Count pending join requests
        const pendingRequests = dept.joinRequests?.filter((req: any) => req.status === 'pending').length || 0;

        setStats({
          totalMembers: dept.members?.length || 0,
          pendingRequests,
          totalSermons: 0, // Will be fetched from sermon service if needed
          totalLiveStreams: 0, // Will be fetched from livestream service if needed
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard statistics';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentStats();
  }, [user, authLoading]);

  const statCards = [
    {
      label: 'Department Members',
      value: stats?.totalMembers || 0,
      color: '#7e8ba3',
      icon: '👥',
    },
    {
      label: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      color: '#f5a623',
      icon: '📋',
    },
    {
      label: 'Sermons',
      value: stats?.totalSermons || 0,
      color: '#cb4154',
      icon: '📺',
    },
    {
      label: 'Live Sessions',
      value: stats?.totalLiveStreams || 0,
      color: '#27ae60',
      icon: '🔴',
    },
  ];

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
        <h1 className="text-3xl md:text-4xl font-bold">Department Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
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
        <h1 className="text-3xl md:text-4xl font-bold">Department Dashboard</h1>
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
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Department Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's an overview of your department.
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
        >
          Refresh
        </Button>
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

      {/* Quick Actions */}
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="p-4 rounded-lg border-2 border-dashed transition-all hover:shadow-md"
            style={{
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}10`,
            }}
            onClick={() => {
              // This would trigger navigation - handled by parent
              document.querySelector('[data-section="sermons"]')?.dispatchEvent(new Event('click'));
            }}
          >
            <div className="text-2xl mb-2">📺</div>
            <p className="font-semibold text-sm">Manage Sermons</p>
          </button>

          <button
            className="p-4 rounded-lg border-2 border-dashed transition-all hover:shadow-md"
            style={{
              borderColor: '#27ae60',
              backgroundColor: '#27ae6010',
            }}
            onClick={() => {
              document.querySelector('[data-section="live"]')?.dispatchEvent(new Event('click'));
            }}
          >
            <div className="text-2xl mb-2">🔴</div>
            <p className="font-semibold text-sm">Live Sessions</p>
          </button>

          <button
            className="p-4 rounded-lg border-2 border-dashed transition-all hover:shadow-md"
            style={{
              borderColor: '#7e8ba3',
              backgroundColor: '#7e8ba310',
            }}
            onClick={() => {
              document.querySelector('[data-section="members"]')?.dispatchEvent(new Event('click'));
            }}
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="font-semibold text-sm">Manage Members</p>
          </button>

          <button
            className="p-4 rounded-lg border-2 border-dashed transition-all hover:shadow-md"
            style={{
              borderColor: '#f5a623',
              backgroundColor: '#f5a62310',
            }}
            onClick={() => {
              document.querySelector('[data-section="announcements"]')?.dispatchEvent(new Event('click'));
            }}
          >
            <div className="text-2xl mb-2">📢</div>
            <p className="font-semibold text-sm">Announcements</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaDepartmentDashboard;
