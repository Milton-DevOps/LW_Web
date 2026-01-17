import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface SermonParams {
  [key: string]: string | number | boolean;
}

interface SermonData {
  [key: string]: any;
}

export const sermonService = {
  // Get all sermons with pagination and filtering
  async getSermons(params: SermonParams = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetch(`${API_BASE_URL}/sermons?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermons');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sermons:', error);
      throw error;
    }
  },

  // Get sermon by ID
  async getSermonById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/sermons/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermon');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sermon:', error);
      throw error;
    }
  },

  // Create sermon
  async createSermon(sermonData: SermonData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/sermons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sermonData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create sermon');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating sermon:', error);
      throw error;
    }
  },

  // Update sermon
  async updateSermon(id: string, sermonData: SermonData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/sermons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sermonData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update sermon');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating sermon:', error);
      throw error;
    }
  },

  // Delete sermon
  async deleteSermon(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/sermons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete sermon');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting sermon:', error);
      throw error;
    }
  },
};