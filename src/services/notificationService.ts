import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface NotificationParams {
  [key: string]: string | number | boolean;
}

interface NotificationData {
  [key: string]: any;
}

export const notificationService = {
  // Get all notifications for the current user
  async getNotifications(params: NotificationParams = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const token = getToken();
      
      const response = await fetch(
        `${API_BASE_URL}/notifications?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get a single notification by ID
  async getNotificationById(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  // Create notification
  async createNotification(notificationData: NotificationData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Update notification
  async updateNotification(id: string, notificationData: NotificationData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark multiple as read
  async markMultipleAsRead(notificationIds: string[]) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/read/multiple`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Delete multiple notifications
  async deleteMultipleNotifications(notificationIds: string[]) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/delete/multiple`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Reply to notification
  async replyToNotification(id: string, content: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },

  // Delete reply from notification
  async deleteReply(notificationId: string, replyId: string) {
    try {
      const token = getToken();
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/reply/${replyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete reply');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  },
};