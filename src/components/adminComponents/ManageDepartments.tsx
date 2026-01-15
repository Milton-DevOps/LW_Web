'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { departmentService } from '@/services/departmentService';

interface Department {
  _id: string;
  name: string;
  description: string;
  headOfDepartment?: { firstName: string; lastName: string } | string;
  members?: any[];
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

interface ManageDepartmentsProps {
  colorMode?: 'light' | 'dark';
}

const ManageDepartments: React.FC<ManageDepartmentsProps> = ({ colorMode = 'light' }) => {
  const colorScheme = colors[colorMode];
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setFetchLoading(true);
      const response = await departmentService.getDepartments({ isActive: 'true', limit: 100 });
      setDepartments(response.departments || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      alert('Failed to fetch departments');
    } finally {
      setFetchLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrEdit = async () => {
    if (!formData.name.trim()) {
      alert('Department name is required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await departmentService.updateDepartment(editingId, formData);
        alert('Department updated successfully');
        setEditingId(null);
      } else {
        await departmentService.createDepartment(formData);
        alert('Department created successfully');
      }

      await fetchDepartments();
      setFormData({ name: '', description: '', isActive: true });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setFormData({
      name: dept.name,
      description: dept.description,
      isActive: dept.isActive,
    });
    setEditingId(dept._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        alert('Department deleted successfully');
        await fetchDepartments();
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete department');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const dept = departments.find(d => d._id === id);
    if (dept) {
      try {
        await departmentService.updateDepartment(id, { ...dept, isActive: !dept.isActive });
        await fetchDepartments();
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to update department');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Manage Departments</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', isActive: true });
          }}
          className="w-full sm:w-auto"
        >
          + Add Department
        </Button>
      </div>

      {/* Modal with Blur Background */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)' }}>
          <div
            className="p-6 rounded-lg shadow-lg space-y-4 w-full max-w-2xl max-h-auto overflow-hidden"
            style={{ backgroundColor: colorScheme.surface }}
          >
          <h2 className="text-xl font-bold">
            {editingId ? 'Edit Department' : 'Add New Department'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Department Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Head of Department"
              value={formData.headOfDepartment}
              onChange={(e) =>
                setFormData({ ...formData, headOfDepartment: e.target.value })
              }
            />
            <textarea
              className="md:col-span-2 px-4 py-2 border rounded resize-none"
              style={{
                borderColor: colorScheme.border,
                backgroundColor: colorScheme.background,
                color: colorScheme.text,
              }}
              placeholder="Department Description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 cursor-pointer"
              />
              <label htmlFor="isActive" className="cursor-pointer">
                Active Department
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleAddOrEdit} className="flex-1">
              {editingId ? 'Update' : 'Add'}
            </Button>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', description: '', headOfDepartment: '', isActive: true });
              }}
              className="flex-1"
              style={{ backgroundColor: '#999999' }}
            >
              Cancel
            </Button>
          </div>
        </div>
        </div>
      )}

      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Search departments by name, description, or head..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Departments Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table
          className="w-full border-collapse"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${colorScheme.border}` }}>
              <th className="px-4 py-3 text-left font-bold">Department Name</th>
              <th className="px-4 py-3 text-left font-bold">Head</th>
              <th className="px-4 py-3 text-left font-bold">Members</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-left font-bold">Created</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr
                key={dept._id}
                style={{
                  borderBottom: `1px solid ${colorScheme.border}`,
                  backgroundColor: colorScheme.surface,
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p
                      className="text-sm"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {dept.description.substring(0, 50)}
                      {dept.description.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">{dept.headOfDepartment}</td>
                <td className="px-4 py-3 font-medium">{dept.memberCount}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor: dept.isActive ? '#27ae60' : '#95a5a6',
                    }}
                  >
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">{dept.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      onClick={() => handleEdit(dept)}
                      className="text-xs px-3 py-1"
                      style={{ backgroundColor: '#f5a623' }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(dept._id)}
                      className="text-xs px-3 py-1"
                      style={{
                        backgroundColor: dept.isActive ? '#95a5a6' : '#27ae60',
                      }}
                    >
                      {dept.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(dept._id)}
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

      {filteredDepartments.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: colorScheme.textSecondary }}>No departments found</p>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;
