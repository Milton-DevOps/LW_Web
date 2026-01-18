import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const liveStreamService = {
  // Get all live streams with pagination and filtering
  async getLiveStreams(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/live-streams?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live streams');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  },

  // Get live stream by ID
  async getLiveStreamById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching live stream:', error);
      throw error;
    }
  },

  // Create live stream
  async createLiveStream(streamData: any) {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/live-streams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(streamData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(error.message || 'Failed to create live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating live stream:', error);
      throw error;
    }
  },

  // Update live stream
  async updateLiveStream(id: string, streamData: any) {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(streamData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(error.message || 'Failed to update live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating live stream:', error);
      throw error;
    }
  },

  // Update viewers count
  async updateViewers(id: string, viewers: number) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}/viewers`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ viewers }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update viewers count');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating viewers count:', error);
      throw error;
    }
  },

  // Delete live stream
  async deleteLiveStream(id: string) {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(error.message || 'Failed to delete live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting live stream:', error);
      throw error;
    }
  },

  // Start live stream
  async startStream(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}/start`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to start live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting live stream:', error);
      throw error;
    }
  },

  // End live stream
  async endStream(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}/end`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to end live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error ending live stream:', error);
      throw error;
    }
  },
};