import { getToken } from './authService';
import { fetchAPI } from '@/utils/fetchHelper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ChurchProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
  image?: string;
  progress?: number;
  budget?: number;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChurchProjectParams {
  [key: string]: string | number | boolean;
}

export interface ChurchProjectData {
  [key: string]: any;
}

export const churchProjectService = {
  // Get all church projects
  async getChurchProjects(params: ChurchProjectParams = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetchAPI(`/church-projects?${queryString}`);

      if (!response.ok) {
        throw new Error('Failed to fetch church projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching church projects:', error);
      throw error;
    }
  },

  // Get church project by ID
  async getChurchProjectById(id: string) {
    try {
      const response = await fetchAPI(`/church-projects/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch church project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching church project:', error);
      throw error;
    }
  },

  // Create church project
  async createChurchProject(projectData: ChurchProjectData) {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetchAPI(`/church-projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create church project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating church project:', error);
      throw error;
    }
  },

  // Update church project
  async updateChurchProject(id: string, projectData: ChurchProjectData) {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/church-projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update church project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating church project:', error);
      throw error;
    }
  },

  // Delete church project
  async deleteChurchProject(id: string) {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/church-projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete church project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting church project:', error);
      throw error;
    }
  },

  // Get projects by status
  async getProjectsByStatus(status: 'active' | 'completed' | 'planned') {
    try {
      const response = await this.getChurchProjects({ status });
      return response;
    } catch (error) {
      console.error('Error fetching projects by status:', error);
      throw error;
    }
  },

  // Upload church project image
  async uploadImage(file: File, onProgress?: (progress: number) => void) {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('image', file);

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
              reject(new Error(response.message || 'Image upload failed'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || 'Image upload failed'));
            } catch {
              reject(new Error(`Image upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during image upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Image upload was cancelled'));
        });

        xhr.open('POST', `${API_BASE_URL}/church-projects/upload/image`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload church project video
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

        xhr.open('POST', `${API_BASE_URL}/church-projects/upload/video`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },
};
