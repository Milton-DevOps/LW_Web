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
  async getLiveStreamById(id) {
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
  async createLiveStream(streamData) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
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
        throw new Error(error.message || 'Failed to create live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating live stream:', error);
      throw error;
    }
  },

  // Update live stream
  async updateLiveStream(id, streamData) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
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
        throw new Error(error.message || 'Failed to update live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating live stream:', error);
      throw error;
    }
  },

  // Update viewers count
  async updateViewers(id, viewers) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}/viewers`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ viewers }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update viewers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating viewers:', error);
      throw error;
    }
  },

  // Delete live stream
  async deleteLiveStream(id) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/live-streams/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete live stream');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting live stream:', error);
      throw error;
    }
  },

  // Get live stream statistics
  async getLiveStreamStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/live-streams/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live stream statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching live stream stats:', error);
      throw error;
    }
  },
};
