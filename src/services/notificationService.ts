const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const notificationService = {
  // Get all notifications for the current user
  async getNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const token = localStorage.getItem('token');
      
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
  async getNotificationById(id) {
    try {
      const token = localStorage.getItem('token');
      
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

  // Mark a notification as read
  async markAsRead(id) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/${id}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/read/multiple`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notificationIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },

  // Get unread notification count
  async getUnreadCount() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/unread/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Reply to a notification
  async replyToNotification(id, content) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/${id}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reply to notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error replying to notification:', error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(id) {
    try {
      const token = localStorage.getItem('token');
      
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
  async deleteMultipleNotifications(notificationIds) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/notifications/delete/multiple`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notificationIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      throw error;
    }
  },

  // Delete a reply from a notification
  async deleteReply(notificationId, replyId) {
    try {
      const token = localStorage.getItem('token');
      
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
