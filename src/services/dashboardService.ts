// LW_Web/src/services/dashboardService.ts

import { getToken } from './authService';

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

export const dashboardService = {
  // Get sermon statistics
  async getSermonStats(): Promise<{ stats: SermonStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/sermons/stats`);

      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/books/stats`);

      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/live-streams/stats`);

      if (!response.ok) {
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
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/admin/users?limit=100&page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/departments/stats`);

      if (!response.ok) {
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