'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { userService } from '@/services/userService';
import { departmentService } from '@/services/departmentService';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'head_of_department' | 'member' | 'user';
  department?: string;
}

interface Department {
  _id: string;
  name: string;
}

interface ManageUsersProps {
  colorMode?: 'light' | 'dark';
}

const ManageUsers: React.FC<ManageUsersProps> = ({ colorMode = 'light' }) => {
  const colorScheme = colors[colorMode];
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'head_of_department' | 'member' | 'user',
    department: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchLoading(true);
      const response = await userService.getAllUsers({ limit: 100 });
      const formattedUsers = response.users?.map((user: any) => ({
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        joinDate: user.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: user.isVerified ? 'active' : 'inactive',
        role: user.role,
        department: user.department?._id || user.department,
      })) || [];
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to fetch users');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments({ isActive: 'true', limit: 100 });
      setDepartments(response.departments || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrEdit = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await userService.updateUser(editingId, {
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ')[1] || '',
          role: formData.role,
          department: formData.department || undefined,
        });
        alert('User updated successfully');
        setEditingId(null);
      } else {
        await userService.createUser({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ')[1] || '',
          email: formData.email,
          role: formData.role,
          department: formData.department || undefined,
        });
        alert('User created successfully! Welcome email sent.');
        await fetchUsers();
      }

      setFormData({ name: '', email: '', role: 'user', department: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
    });
    setEditingId(user._id || null);
    setShowModal(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      await userService.deleteUser(id);
      alert('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'user', department: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#27ae60';
      case 'inactive':
        return '#f39c12';
      case 'suspended':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#cb4154';
      case 'head_of_department':
        return '#7e8ba3';
      case 'member':
        return '#f5a623';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button
          onClick={openAddModal}
          className="w-full sm:w-auto"
        >
          + Add User
        </Button>
      </div>

      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table
          className="w-full border-collapse"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${colorScheme.border}` }}>
              <th className="px-4 py-3 text-left font-bold">Name</th>
              <th className="px-4 py-3 text-left font-bold">Email</th>
              <th className="px-4 py-3 text-left font-bold">Role</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-left font-bold">Department</th>
              <th className="px-4 py-3 text-left font-bold">Join Date</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: `1px solid ${colorScheme.border}`,
                  backgroundColor: colorScheme.surface,
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">{user.department || '-'}</td>
                <td className="px-4 py-3">{user.joinDate}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      onClick={() => handleEdit(user)}
                      className="text-xs px-3 py-1"
                      style={{ backgroundColor: '#f5a623' }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(user._id)}
                      className="text-xs px-3 py-1"
                      style={{ backgroundColor: '#e74c3c' }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: colorScheme.textSecondary }}>No users found</p>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <>
          {/* Modal Backdrop with Blur */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)' }}
            onClick={() => {
              setShowModal(false);
              setEditingId(null);
              setFormData({ name: '', email: '', role: 'user', department: '' });
            }}
          />

          {/* Modal */}
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
            style={{ backgroundColor: colorScheme.surface }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 border-b flex justify-between items-center sticky top-0"
              style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}
            >
              <h3 className="text-lg font-bold">
                {editingId ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({ name: '', email: '', role: 'user', department: '' });
                }}
                className="text-xl leading-none"
                style={{ color: colorScheme.textSecondary }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <select
                  className="w-full px-4 py-2 border rounded"
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'admin' | 'head_of_department' | 'member' | 'user',
                      department: e.target.value === 'admin' || e.target.value === 'user' ? '' : formData.department,
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="member">Member</option>
                  <option value="head_of_department">Head of Department</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {(formData.role === 'head_of_department' || formData.role === 'member') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Department *</label>
                  <select
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: colorScheme.border,
                      backgroundColor: colorScheme.background,
                      color: colorScheme.text,
                    }}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 border-t flex gap-3 sticky bottom-0"
              style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}
            >
              <Button
                onClick={handleAddOrEdit}
                disabled={loading}
                className="flex-1"
                style={{ backgroundColor: colorScheme.primary }}
              >
                {loading ? 'Creating...' : editingId ? 'Update User' : 'Create User'}
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({ name: '', email: '', role: 'user', department: '' });
                }}
                className="flex-1"
                style={{ backgroundColor: colorScheme.secondary }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
