import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SettingsData {
  siteName?: string;
  siteEmail?: string;
  phoneNumber?: string;
  address?: string;
  maxFileUpload?: number;
  sessionTimeout?: number;
  enableNotifications?: boolean;
  enableEmails?: boolean;
  maintenanceMode?: boolean;
}

export const settingsService = {
  // Get current settings
  async getSettings(): Promise<any> {
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
  async updateSettings(data: SettingsData): Promise<any> {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Reset settings to default
  async resetSettings(): Promise<any> {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },
};