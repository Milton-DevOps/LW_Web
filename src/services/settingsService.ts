import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Settings {
  _id?: string;
  siteName: string;
  siteEmail: string;
  phoneNumber: string;
  address: string;
  maxFileUpload: number;
  sessionTimeout: number;
  enableNotifications: boolean;
  enableEmails: boolean;
  maintenanceMode: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const settingsService = {
  // Get settings
  async getSettings(): Promise<Settings> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update settings
  async updateSettings(settings: Partial<Settings>): Promise<{ message: string; settings: Settings }> {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(data.message || 'Failed to update settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Reset settings to default
  async resetSettings(): Promise<{ message: string; settings: Settings }> {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(data.message || 'Failed to reset settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },
};