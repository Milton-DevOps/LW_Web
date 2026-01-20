'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { churchProjectService } from '@/services/churchProjectService';
import { useAuthContext } from '@/contexts/AuthContext';

interface ChurchProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
  image?: string;
  video?: string;
  budget?: number;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate: string;
  budget: string;
  image: string;
  video: string;
}

const ManageChurchProjects: React.FC = () => {
  const colorScheme = colors;
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ChurchProject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    status: 'planned',
    startDate: '',
    endDate: '',
    budget: '',
    image: '',
    video: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setFetchLoading(true);
      const response = await churchProjectService.getChurchProjects({ limit: 100 });
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to fetch church projects:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const response = await churchProjectService.uploadImage(file, (progress) => {
        setImageUploadProgress(progress);
      });
      setFormData({ ...formData, image: response.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
      setImageUploadProgress(0);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      const response = await churchProjectService.uploadVideo(file, (progress) => {
        setVideoUploadProgress(progress);
      });
      setFormData({ ...formData, video: response.videoUrl });
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        image: formData.image || undefined,
        video: formData.video || undefined,
      };

      if (editingId) {
        await churchProjectService.updateChurchProject(editingId, projectData);
      } else {
        await churchProjectService.createChurchProject(projectData);
      }
      
      await fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: ChurchProject) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category || '',
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || '',
      budget: project.budget?.toString() || '',
      image: project.image || '',
      video: project.video || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await churchProjectService.deleteChurchProject(id);
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'planned',
      startDate: '',
      endDate: '',
      budget: '',
      image: '',
      video: '',
    });
    setImageUploadProgress(0);
    setVideoUploadProgress(0);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'planned',
      startDate: '',
      endDate: '',
      budget: '',
      image: '',
      video: '',
    });
    setShowModal(true);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (fetchLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Manage Church Projects</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg"
              style={{ backgroundColor: colorScheme.surface }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Manage Church Projects</h1>
          <p className="text-gray-600 mt-2">Create and manage your church projects</p>
        </div>
        <Button onClick={openAddModal} variant="primary">
          + New Project
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
        />
      </div>

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div
            className="p-8 rounded-lg text-center"
            style={{ backgroundColor: colorScheme.surface }}
          >
            <p style={{ color: colorScheme.textSecondary }}>
              {projects.length === 0
                ? 'No church projects yet. Create one to get started!'
                : 'No projects match your search.'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="p-4 rounded-lg shadow-md"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p style={{ color: colorScheme.textSecondary }} className="text-sm mt-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span>
                      Status:{' '}
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            project.status === 'active'
                              ? '#27ae60'
                              : project.status === 'completed'
                                ? '#3498db'
                                : '#f5a623',
                        }}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </span>
                    <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                    {project.budget && <span>Budget: ${project.budget.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="primary"
                    className="text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project._id)}
                    variant="primary"
                    className="text-sm"
                    style={{ backgroundColor: '#cb4154' }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={handleCloseModal}
          role="presentation"
        />
      )}

      {/* Modal Content */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colorScheme.surface }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center p-6 border-b sticky top-0"
              style={{ borderColor: colorScheme.border }}
            >
              <h2 id="modal-title" className="text-xl font-bold">
                {editingId ? 'Edit Church Project' : 'Add New Church Project'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl font-bold hover:opacity-70 transition-opacity"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <Input
                    id="project-title"
                    type="text"
                    label="Project Title"
                    placeholder="e.g., New Church Building"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description"
                    className="w-full p-2 rounded-lg border text-xs"
                    style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.background }}
                    rows={4}
                    required
                  />
                </div>

                {/* Status and Category - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status-select" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'active' | 'completed' | 'planned',
                        })
                      }
                      className="w-full p-2 rounded-lg border text-xs"
                      style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.background }}
                    >
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 rounded-lg border text-xs"
                      style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.background }}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Building">Building</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Education">Education</option>
                      <option value="Technology">Technology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Start Date and End Date - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="start-date"
                      type="date"
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="end-date"
                      type="date"
                      label="End Date (Optional)"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Input
                    id="budget"
                    type="number"
                    label="Budget (Optional)"
                    placeholder="e.g., 50000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Upload Project Image
                  </label>
                  
                  {uploadingImage ? (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#cb4154] h-full"
                          style={{
                            width: `${imageUploadProgress}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-600 text-xs">
                        Uploading... {imageUploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#cb4154] hover:bg-red-50 transition-colors"
                      onClick={() => document.getElementById('image-file-input')?.click()}
                    >
                      <input
                        id="image-file-input"
                        type="file"
                        accept="image/*"
                        title="Select image file to upload"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <div>
                        <p className="text-3xl mb-2">🖼️</p>
                        <p className="text-gray-800 font-semibold text-sm mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500 text-xs">
                          PNG, JPG, GIF (Max 50MB)
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.image && (
                    <div className="p-2 mt-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                      ✅ Image uploaded successfully
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Upload Project Video (Optional)
                  </label>
                  
                  {uploadingVideo ? (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#cb4154] h-full"
                          style={{
                            width: `${videoUploadProgress}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-600 text-xs">
                        Uploading... {videoUploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#cb4154] hover:bg-red-50 transition-colors"
                      onClick={() => document.getElementById('video-file-input')?.click()}
                    >
                      <input
                        id="video-file-input"
                        type="file"
                        accept="video/*"
                        title="Select video file to upload"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleVideoUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        disabled={uploadingVideo}
                      />
                      <div>
                        <p className="text-3xl mb-2">🎬</p>
                        <p className="text-gray-800 font-semibold text-sm mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500 text-xs">
                          MP4, WebM, Ogg (Max 500MB)
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.video && (
                    <div className="p-2 mt-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                      ✅ Video uploaded successfully
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex gap-4 pt-6 border-t" style={{ borderColor: colorScheme.border }}>
                  <Button type="submit" variant="primary" disabled={loading || uploadingImage || uploadingVideo}>
                    {loading
                      ? editingId
                        ? 'Updating...'
                        : 'Creating...'
                      : editingId
                        ? 'Update Project'
                        : 'Create Project'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="primary"
                    style={{ backgroundColor: colorScheme.textSecondary }}
                    disabled={loading || uploadingImage || uploadingVideo}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChurchProjects;