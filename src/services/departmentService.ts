import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface DepartmentParams {
  [key: string]: string | number | boolean;
}

interface DepartmentData {
  [key: string]: any;
}

export const departmentService = {
  // Get all departments with pagination and filtering
  async getDepartments(params: DepartmentParams = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetch(`${API_BASE_URL}/departments?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  // Get department by ID
  async getDepartmentById(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch department');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  },

  // Create department
  async createDepartment(departmentData: DepartmentData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create department');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  // Update department
  async updateDepartment(id: string, departmentData: DepartmentData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(departmentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update department');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  // Delete department
  async deleteDepartment(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete department');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  // Add member to department
  async addMember(id: string, userId: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add member');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Remove member from department
  async removeMember(id: string, userId: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${id}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove member');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Request to join a department
  async requestToJoinDepartment(departmentId: string, requestMessage?: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}/join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ requestMessage }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit join request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error requesting to join department:', error);
      throw error;
    }
  },

  // Get pending join requests for a department
  async getDepartmentJoinRequests(departmentId: string, status?: string) {
    try {
      const token = getToken();
      const queryString = status ? `?status=${status}` : '';
      
      const response = await fetch(
        `${API_BASE_URL}/departments/${departmentId}/join-requests${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch join requests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching join requests:', error);
      throw error;
    }
  },

  // Approve or reject a join request
  async respondToJoinRequest(
    departmentId: string,
    requestId: string,
    data: { status: 'approved' | 'rejected'; rejectionReason?: string }
  ) {
    try {
      const token = getToken();
      
      const response = await fetch(
        `${API_BASE_URL}/departments/${departmentId}/join-requests/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to respond to join request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error responding to join request:', error);
      throw error;
    }
  },

  // Get all members of a department
  async getDepartmentMembers(departmentId: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch members');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  // Remove a member from department
  async removeMemberFromDepartment(departmentId: string, memberId: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: memberId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove member');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },
};