import { getToken } from './authService';
import { fetchAPI } from '@/utils/fetchHelper';

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
      const response = await fetchAPI(`/sermons?${queryString}`);
      
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
      const response = await fetchAPI(`/sermons/${id}`);
      
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
      console.log('[SERMON] createSermon: token available:', !!token);
      console.log('[SERMON] createSermon: sending data:', JSON.stringify(sermonData, null, 2));
      
      if (!token) {
        console.error('[SERMON] createSermon: No token found! Cannot create sermon.');
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Ensure body is JSON string
      const jsonBody = typeof sermonData === 'string' ? sermonData : JSON.stringify(sermonData);
      
      const response = await fetchAPI(`/sermons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to create sermon';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('[SERMON] Could not parse error response:', e);
        }
        throw new Error(errorMessage);
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

  // Upload sermon video
  async uploadVideo(file: File, onProgress?: (progress: number) => void) {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });
      }

      return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response);
            } else {
              reject(new Error(response.message || 'Video upload failed'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || 'Video upload failed'));
            } catch {
              reject(new Error(`Video upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during video upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Video upload was cancelled'));
        });

        xhr.open('POST', `${API_BASE_URL}/sermons/upload/video`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading sermon video:', error);
      throw error;
    }
  },
};