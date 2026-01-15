const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const sermonService = {
  // Get all sermons with pagination and filtering
  async getSermons(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
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
  async getSermonById(id) {
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
  async createSermon(sermonData) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
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
  async updateSermon(id, sermonData) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
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
  async deleteSermon(id) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
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

  // Get sermon statistics
  async getSermonStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/sermons/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermon statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sermon stats:', error);
      throw error;
    }
  },
};
