'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { sermonService } from '@/services/sermonService';
import styles from './ManageSermons.module.css';

interface Sermon {
  _id: string;
  title: string;
  mainSpeaker: string;
  datePreached: string;
  videoUrl: string;
  views: number;
  status: 'published' | 'draft';
}

const ManageSermons: React.FC = () => {
  const colorScheme = colors;
  const [searchQuery, setSearchQuery] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    mainSpeaker: '',
    datePreached: '',
    videoUrl: '',
    status: 'published' as 'published' | 'draft',
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setFetchLoading(true);
      const response = await sermonService.getSermons({ status: 'all', limit: 100 });
      setSermons(response.sermons || []);
    } catch (error) {
      console.error('Failed to fetch sermons:', error);
      alert('Failed to fetch sermons');
    } finally {
      setFetchLoading(false);
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.mainSpeaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrEdit = async () => {
    if (!formData.title || !formData.mainSpeaker || !formData.datePreached || !formData.videoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await sermonService.updateSermon(editingId, formData);
        alert('Sermon updated successfully');
        setEditingId(null);
      } else {
        await sermonService.createSermon(formData);
        alert('Sermon created successfully');
      }

      await fetchSermons();
      setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setFormData({
      title: sermon.title,
      mainSpeaker: sermon.mainSpeaker,
      datePreached: sermon.datePreached.split('T')[0],
      videoUrl: sermon.videoUrl,
      status: sermon.status,
    });
    setEditingId(sermon._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      try {
        await sermonService.deleteSermon(id);
        alert('Sermon deleted successfully');
        await fetchSermons();
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete sermon');
      }
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Check file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file size must be less than 500MB');
      return;
    }

    setUploadingVideo(true);
    setVideoUploadProgress(0);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_SERMONS || 'lwmi_sermons');
      formDataUpload.append('resource_type', 'video');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwmzofj4a';
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setVideoUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFormData(prev => ({
            ...prev,
            videoUrl: response.secure_url
          }));
          alert('Video uploaded successfully!');
          setVideoUploadProgress(0);
        } else {
          alert('Failed to upload video. Please try again.');
        }
        setUploadingVideo(false);
      });

      xhr.addEventListener('error', () => {
        alert('Error uploading video. Please check your connection and try again.');
        setUploadingVideo(false);
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`);
      xhr.send(formDataUpload);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
      setUploadingVideo(false);
    }
  };

  const openAddModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? '#27ae60' : '#f39c12';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Sermon Videos</h1>
        <Button
          onClick={openAddModal}
          variant="primary"
          className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold"
        >
          + Add Sermon
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search sermons by title or speaker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sermons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSermons.length > 0 && filteredSermons.map((sermon) => (
          <div
            key={sermon._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Video Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center group">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch sermon: ${sermon.title}`}
                >
                  <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ▶
                  </div>
                </a>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{sermon.title}</h3>
                <p className="text-gray-600 text-sm">By {sermon.mainSpeaker}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-medium">Date:</span>
                  <span className="text-gray-700">{new Date(sermon.datePreached).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-medium">Views:</span>
                  <span className="text-gray-700">{sermon.views}</span>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    sermon.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {sermon.status}
                </span>

                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(sermon)}
                    className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-colors text-sm"
                    aria-label={`Edit sermon: ${sermon.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sermon._id)}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors text-sm"
                    aria-label={`Delete sermon: ${sermon.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSermons.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-lg">
            No sermons found
          </p>
        </div>
      )}

      {/* Add/Edit Sermon Modal */}
      {showModal && (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setEditingId(null);
                setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
              }
            }}
            role="presentation"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                  {editingId ? 'Edit Sermon' : 'Add New Sermon'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form className="space-y-3">
                  {/* Sermon Title and Speaker - Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        id="sermon-title"
                        type="text"
                        label="Sermon Title"
                        placeholder="e.g., The Power of Faith"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        id="main-speaker"
                        type="text"
                        label="Main Speaker"
                        placeholder="e.g., Pastor John"
                        value={formData.mainSpeaker}
                        onChange={(e) => setFormData({ ...formData, mainSpeaker: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Date Preached */}
                  <div>
                    <Input
                      id="date-preached"
                      type="date"
                      label="Date Preached"
                      value={formData.datePreached}
                      onChange={(e) => setFormData({ ...formData, datePreached: e.target.value })}
                      fullWidth
                      required
                    />
                  </div>

                  {/* Video Upload Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Upload Video or Paste URL
                    </label>
                    
                    <div className="space-y-3">
                      {uploadingVideo ? (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={styles.progressFill}
                              style={{
                                width: `${videoUploadProgress}%`,
                              } as React.CSSProperties}
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

                      {formData.videoUrl && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                          ✅ Video uploaded successfully
                        </div>
                      )}

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                      </div>

                      <Input
                        id="video-url"
                        type="url"
                        placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        fullWidth
                      />
                    </div>

                    <p className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                      📌 Upload directly or paste a link from YouTube, Vimeo, or any video URL
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#cb4154] transition-colors bg-white text-gray-900"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'published' | 'draft',
                        })
                      }
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-white sticky bottom-0">
                <Button
                  onClick={handleAddOrEdit}
                  disabled={loading}
                  variant="primary"
                  className="flex-1 text-sm"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Sermon' : 'Add Sermon'}
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
                  }}
                  variant="secondary"
                  className="flex-1 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageSermons;
