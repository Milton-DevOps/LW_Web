'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { liveStreamService } from '@/services/liveStreamService';
import styles from './LiveStream.module.css';

interface LiveSession {
  _id: string;
  title: string;
  status: 'live' | 'scheduled' | 'ended' | 'cancelled';
  streamUrl: string;
  startTime: string;
  host: string;
  viewers: number;
}

const LiveStream: React.FC = () => {
  const colorScheme = colors;
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    startTime: '',
    streamUrl: '',
    description: '',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setFetchLoading(true);
      const response = await liveStreamService.getLiveStreams({ limit: 100 });
      setSessions(response.streams || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      alert('Failed to fetch live stream sessions');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!formData.title || !formData.host || !formData.startTime || !formData.streamUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await liveStreamService.updateLiveStream(editingId, formData);
        alert('Live stream updated successfully');
        setEditingId(null);
      } else {
        await liveStreamService.createLiveStream(formData);
        alert('Live stream session scheduled successfully!');
      }

      await fetchSessions();
      setFormData({ title: '', host: '', startTime: '', streamUrl: '', description: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      alert(errorMessage);
      // If auth error, redirect to login
      if (errorMessage.includes('session has expired') || errorMessage.includes('Authentication required')) {
        window.location.href = '/auth/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await liveStreamService.deleteLiveStream(id);
        alert('Live stream deleted successfully');
        await fetchSessions();
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete live stream';
        alert(errorMessage);
        // If auth error, redirect to login
        if (errorMessage.includes('session has expired') || errorMessage.includes('Authentication required')) {
          window.location.href = '/auth/login';
        }
      }
    }
  };

  const handleEdit = (session: LiveSession) => {
    setFormData({
      title: session.title,
      host: session.host,
      startTime: session.startTime.split('T')[0],
      streamUrl: session.streamUrl,
      description: '',
    });
    setEditingId(session._id);
    setShowModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#e74c3c';
      case 'scheduled':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Live Streaming</h1>
        <p className={styles.subtitle} style={{ color: colorScheme.textSecondary }}>
          Manage live broadcast sessions for worship services and events
        </p>
      </div>

      {/* Quick Start Guide */}
      <div
        className={styles.guideCard}
        style={{
          backgroundColor: colorScheme.surface,
          borderLeft: `4px solid ${colorScheme.primary}`,
        }}
      >
        <h3 className={styles.guideTitle}>📺 Quick Start with OBS + YouTube</h3>
        <ol className={styles.guideList}>
          <li>
            <strong>Install OBS:</strong> Download Open Broadcaster Software (OBS) from
            <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer">
              {' '}obsproject.com
            </a>
          </li>
          <li>
            <strong>Create YouTube Stream:</strong> Go to youtube.com, click "Create" → "Go live" →
            "Stream"
          </li>
          <li>
            <strong>Configure OBS:</strong> Copy your YouTube Stream Key to OBS Settings
          </li>
          <li>
            <strong>Schedule Stream:</strong> Use the "Add Live Stream" button below to schedule
            the broadcast
          </li>
          <li>
            <strong>Go Live:</strong> Start streaming from OBS; viewers access via the stream URL
          </li>
        </ol>
      </div>

      {/* Add Stream Button */}
      <div className={styles.actionBar}>
        <Button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: colorScheme.primary, color: 'white' }}
        >
          + Schedule Live Stream
        </Button>
      </div>

      {/* Live Sessions Grid */}
      <div className={styles.gridContainer}>
        {sessions.length > 0 && sessions.map((session) => (
          <div
            key={session._id}
            className={styles.sessionCard}
            style={{ backgroundColor: colorScheme.surface }}
          >
            {/* Stream Preview */}
            <div className={styles.streamPreview}>
              <svg
                className={styles.previewIcon}
                fill={colorScheme.textSecondary}
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <div
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusBadgeColor(session.status) }}
              >
                {session.status.toUpperCase()}
              </div>
              {session.status === 'live' && <div className={styles.liveDot} />}
            </div>

            {/* Session Info */}
            <div className={styles.sessionInfo}>
              <h3 className={styles.sessionTitle}>{session.title}</h3>

              <div className={styles.sessionDetail}>
                <span style={{ color: colorScheme.textSecondary }}>Host:</span>
                <span>{session.host}</span>
              </div>

              <div className={styles.sessionDetail}>
                <span style={{ color: colorScheme.textSecondary }}>Time:</span>
                <span>{new Date(session.startTime).toLocaleString()}</span>
              </div>

              {session.status === 'live' && (
                <div className={styles.sessionDetail}>
                  <span style={{ color: colorScheme.textSecondary }}>👥 Viewers:</span>
                  <span>{session.viewers}</span>
                </div>
              )}

              {/* Access Link */}
              <div className={styles.streamLink}>
                <a
                  href={session.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colorScheme.primary, textDecoration: 'none' }}
                >
                  🔗 Open Stream
                </a>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  onClick={() => {
                    handleEdit(session);
                  }}
                  className={styles.editButton}
                  style={{ color: colorScheme.primary }}
                  aria-label={`Edit session: ${session.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSession(session._id)}
                  className={styles.deleteButton}
                  style={{ color: '#e74c3c' }}
                  aria-label={`Delete session: ${session.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className={styles.emptyState}>
          <p style={{ color: colorScheme.textSecondary }}>No live streams scheduled</p>
        </div>
      )}

      {/* Add Stream Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className={styles.modal}
            onClick={() => setShowModal(false)}
            role="presentation"
          />

          {/* Modal Content */}
          <div
            className={styles.modalContent}
            style={{ backgroundColor: colorScheme.surface }}
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" className={styles.modalTitle}>
              Schedule Live Stream
            </h2>

            <div className={styles.formGroup}>
              <label htmlFor="stream-title">Stream Title *</label>
              <input
                id="stream-title"
                type="text"
                placeholder="e.g., Sunday Worship Service"
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
              <label htmlFor="stream-host">Host Name *</label>
              <input
                id="stream-host"
                type="text"
                placeholder="e.g., Pastor John"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
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
              <label htmlFor="stream-time">Start Time *</label>
              <input
                id="stream-time"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
              <label htmlFor="stream-url">YouTube/Twitch Stream URL *</label>
              <input
                id="stream-url"
                type="url"
                placeholder="https://youtube.com/live/..."
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                className={styles.input}
                style={{
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text,
                }}
                required
              />
              <p className={styles.tip} style={{ color: colorScheme.textSecondary }}>
                Get your stream URL from YouTube Live or Twitch after creating a broadcast
              </p>
            </div>

            {/* Actions */}
            <div className={styles.modalActions}>
              <button
                onClick={handleAddSession}
                disabled={loading}
                className={styles.submitButton}
                style={{ backgroundColor: colorScheme.primary, color: 'white' }}
              >
                {loading ? 'Scheduling...' : 'Schedule Stream'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
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

export default LiveStream;
