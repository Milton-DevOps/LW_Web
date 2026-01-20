'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { sermonService } from '@/services/sermonService';
import { useAuthContext } from '@/contexts/AuthContext';

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
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      setSermons(response.data || []);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Sermons</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-300 rounded-lg" />
          <div className="h-64 bg-gray-300 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Sermons</h1>
        <Button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: colors.primary, color: '#ffffff' }}
        >
          + Add Sermon
        </Button>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search sermons by title or speaker..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {/* Sermons List */}
      <div
        className="rounded-lg overflow-hidden shadow-md"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colorScheme.background }}>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Speaker</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Views</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSermons.length > 0 ? (
                filteredSermons.map((sermon, index) => (
                  <tr
                    key={sermon._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? colorScheme.surface : colorScheme.background,
                      borderBottom: `1px solid ${colorScheme.border}`,
                    }}
                  >
                    <td className="px-4 py-3">{sermon.title}</td>
                    <td className="px-4 py-3">{sermon.mainSpeaker}</td>
                    <td className="px-4 py-3">
                      {new Date(sermon.datePreached).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{sermon.views.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            sermon.status === 'published'
                              ? '#4caf5030'
                              : '#ffc10730',
                          color:
                            sermon.status === 'published'
                              ? '#4caf50'
                              : '#ffc107',
                        }}
                      >
                        {sermon.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <Button
                        onClick={() => handleEdit(sermon)}
                        variant="secondary"
                        size="sm"
                        className="text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(sermon._id)}
                        variant="tertiary"
                        size="sm"
                        className="text-sm"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: colorScheme.textSecondary }}>
                    No sermons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Sermon Modal */}
      {showModal && (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
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
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: colorScheme.surface }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white" style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}>
                <h2 id="modal-title" className="text-xl font-bold" style={{ color: colorScheme.text }}>
                  {editingId ? 'Edit Sermon' : 'Add New Sermon'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
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
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, mainSpeaker: e.target.value })
                        }
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
                      onChange={(e) =>
                        setFormData({ ...formData, datePreached: e.target.value })
                      }
                      fullWidth
                      required
                    />
                  </div>

                  {/* Video URL */}
                  <div>
                    <Input
                      id="video-url"
                      type="url"
                      label="Video URL"
                      placeholder="e.g., https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      fullWidth
                      required
                    />
                    <p className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                      📌 Paste video URL from YouTube, Vimeo, or any video platform
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-xs font-medium mb-1" style={{ color: colorScheme.text }}>
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors"
                      style={{
                        borderColor: colorScheme.border,
                        backgroundColor: colorScheme.background,
                        color: colorScheme.text
                      }}
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
              <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white" style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}>
                <Button
                  onClick={handleAddOrEdit}
                  disabled={loading}
                  variant="primary"
                  className="flex-1 text-sm"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Sermon' : 'Add Sermon'}
                </Button>
                <Button
                  onClick={handleCloseModal}
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
