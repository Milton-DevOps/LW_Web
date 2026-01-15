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

interface ManageSermonsProps {
  colorMode?: 'light' | 'dark';
}

const ManageSermons: React.FC<ManageSermonsProps> = ({ colorMode = 'light' }) => {
  const colorScheme = colors[colorMode];
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

  const openAddModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? '#27ae60' : '#f39c12';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Sermon Videos</h1>
        <Button
          onClick={openAddModal}
          className="w-full sm:w-auto"
          style={{ backgroundColor: colorScheme.primary, color: colorScheme.text }}
        >
          + Add Sermon
        </Button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchInput}>
        <Input
          type="text"
          placeholder="Search sermons by title or speaker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sermons Grid */}
      <div className={styles.gridContainer}>
        {filteredSermons.length > 0 && filteredSermons.map((sermon) => (
          <div
            key={sermon._id}
            className={styles.sermonCard}
            style={{ backgroundColor: colorScheme.surface }}
          >
            {/* Video Thumbnail */}
            <div className={styles.videoContainer}>
              <svg
                className={styles.video}
                fill={colorScheme.textSecondary}
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className={styles.videoOverlay}>
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch sermon: ${sermon.title}`}
                >
                  <div className={styles.playButton}>▶</div>
                </a>
              </div>
            </div>

            {/* Content */}
            <div className={styles.sermonInfo}>
              <div>
                <h3 className={styles.sermonTitle}>{sermon.title}</h3>
                <p style={{ color: colorScheme.textSecondary }}>By {sermon.mainSpeaker}</p>
              </div>

              <div>
                <div className={styles.sermonDetails}>
                  <span className={styles.label} style={{ color: colorScheme.textSecondary }}>Date:</span>
                  <span>{new Date(sermon.datePreached).toLocaleDateString()}</span>
                </div>
                <div className={styles.sermonDetails}>
                  <span className={styles.label} style={{ color: colorScheme.textSecondary }}>Views:</span>
                  <span>{sermon.views}</span>
                </div>

                <span
                  className={`${styles.statusBadge} ${
                    sermon.status === 'published' ? styles.statusPublished : styles.statusDraft
                  }`}
                >
                  {sermon.status}
                </span>

                <div className={styles.actions} style={{ borderColor: colorScheme.border }}>
                  <button
                    onClick={() => handleEdit(sermon)}
                    className={styles.actionButton}
                    style={{ backgroundColor: '#f5a623', color: 'white' }}
                    aria-label={`Edit sermon: ${sermon.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sermon._id)}
                    className={styles.actionButton}
                    style={{ backgroundColor: '#e74c3c', color: 'white' }}
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
        <div className={styles.emptyState}>
          <p className={styles.emptyText} style={{ color: colorScheme.textSecondary }}>
            No sermons found
          </p>
        </div>
      )}

      {/* Add/Edit Sermon Modal */}
      {showModal && (
        <>
          {/* Modal Backdrop */}
          <div
            className={styles.modal}
            onClick={() => {
              setShowModal(false);
              setEditingId(null);
              setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
            }}
            role="presentation"
          />

          {/* Modal Content */}
          <div
            className={styles.modalContent}
            style={{ backgroundColor: colorScheme.surface }}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Header */}
            <div style={{ borderBottom: `1px solid ${colorScheme.border}`, marginBottom: '1rem' }}>
              <h2 id="modal-title" className={styles.modalHeader}>
                {editingId ? 'Edit Sermon' : 'Add New Sermon'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
                }}
                style={{ color: colorScheme.textSecondary }}
                aria-label="Close modal"
                className="text-2xl mb-2"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="sermon-title" className={styles.label}>
                  Sermon Title *
                </label>
                <input
                  id="sermon-title"
                  type="text"
                  placeholder="e.g., The Power of Faith"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.input}
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="main-speaker" className={styles.label}>
                  Main Speaker *
                </label>
                <input
                  id="main-speaker"
                  type="text"
                  placeholder="e.g., Pastor John"
                  value={formData.mainSpeaker}
                  onChange={(e) => setFormData({ ...formData, mainSpeaker: e.target.value })}
                  className={styles.input}
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="date-preached" className={styles.label}>
                  Date Preached *
                </label>
                <input
                  id="date-preached"
                  type="date"
                  value={formData.datePreached}
                  onChange={(e) => setFormData({ ...formData, datePreached: e.target.value })}
                  className={styles.input}
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="video-url" className={styles.label}>
                  Video URL *
                </label>
                <input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className={styles.input}
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
                  }}
                  required
                />
                <p className={styles.formTip} style={{ color: colorScheme.textSecondary, backgroundColor: colorScheme.border }}>
                  📌 Tip: Upload your video to Cloudinary, YouTube, or Vimeo and paste the link
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  id="status"
                  className={styles.select}
                  style={{
                    borderColor: colorScheme.border,
                    backgroundColor: colorScheme.background,
                    color: colorScheme.text,
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
            </div>

            {/* Footer Actions */}
            <div className={styles.formActions} style={{ borderColor: colorScheme.border }}>
              <button
                onClick={handleAddOrEdit}
                disabled={loading}
                className={styles.primaryButton}
                style={{ backgroundColor: colorScheme.primary, color: 'white' }}
              >
                {loading ? 'Saving...' : editingId ? 'Update Sermon' : 'Add Sermon'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({ title: '', mainSpeaker: '', datePreached: '', videoUrl: '', status: 'published' });
                }}
                className={styles.secondaryButton}
                style={{ backgroundColor: colorScheme.secondary, color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageSermons;
