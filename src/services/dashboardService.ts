// LW_Web/src/services/dashboardService.ts

import { getToken } from './authService';
import { fetchAPI } from '@/utils/fetchHelper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SermonStats {
  totalSermons: number;
  publishedSermons: number;
  draftSermons: number;
  totalViews: number;
}

interface BookStats {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalDownloads: number;
}

interface LiveStreamStats {
  totalStreams: number;
  liveStreams: number;
  scheduledStreams: number;
  endedStreams: number;
  totalViewers: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
}

interface DashboardStats {
  sermons: SermonStats;
  books: BookStats;
  liveStreams: LiveStreamStats;
  users: UserStats;
  departments: DepartmentStats;
}

// Helper function to get headers with token
const getAuthHeaders = () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const dashboardService = {
  // Get sermon statistics
  async getSermonStats(): Promise<{ stats: SermonStats }> {
    try {
      const response = await fetchAPI(`/sermons/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch sermon stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sermon stats:', error);
      throw error;
    }
  },

  // Get book statistics
  async getBookStats(): Promise<{ stats: BookStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch book stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching book stats:', error);
      throw error;
    }
  },

  // Get live stream statistics
  async getLiveStreamStats(): Promise<{ stats: LiveStreamStats }> {
    try {
      const response = await fetchAPI(`/live-streams/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch live stream stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live stream stats:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const token = getToken();

      if (!token) {
        console.warn('[Dashboard] No token available for getUserStats');
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('[Dashboard] Fetching user stats with token:', token.substring(0, 10) + '...');

      const response = await fetch(`${API_BASE_URL}/auth/admin/users?limit=100&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[Dashboard] User stats response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[Dashboard] User stats error response:', errorData);
        
        if (response.status === 401) {
          // Token might be invalid or expired
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          document.cookie = 'auth_token=;path=/;max-age=0';
          document.cookie = 'user_role=;path=/;max-age=0';
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch user stats');
      }

      const data = await response.json();

      // Calculate stats from all users
      const totalUsers = data.pagination?.total || 0;
      const activeUsers = data.users?.filter((u: any) => u.isVerified).length || 0;
      const inactiveUsers = totalUsers - activeUsers;

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get department statistics
  async getDepartmentStats(): Promise<{ stats: DepartmentStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch department stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw error;
    }
  },

  // Get all dashboard stats
  async getAllDashboardStats(): Promise<DashboardStats> {
    try {
      const [sermonRes, bookRes, liveStreamRes, userRes, departmentRes] = await Promise.all([
        this.getSermonStats(),
        this.getBookStats(),
        this.getLiveStreamStats(),
        this.getUserStats(),
        this.getDepartmentStats(),
      ]);

      return {
        sermons: sermonRes.stats,
        books: bookRes.stats,
        liveStreams: liveStreamRes.stats,
        users: userRes,
        departments: departmentRes.stats,
      };
    } catch (error) {
      console.error('Error fetching all dashboard stats:', error);
      throw error;
    }
  },
};