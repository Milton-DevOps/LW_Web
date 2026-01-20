'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { liveStreamService } from '@/services/liveStreamService';

interface LiveSession {
  _id: string;
  title: string;
  status: 'live' | 'scheduled' | 'ended' | 'cancelled';
  streamUrl: string;
  startTime: string;
  host: string;
  viewers: number;
}

const LiveSessions: React.FC = () => {
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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', host: '', startTime: '', streamUrl: '', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#ff4444';
      case 'scheduled':
        return '#4444ff';
      case 'ended':
        return '#888888';
      default:
        return '#cccccc';
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
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
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <Button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: colors.primary, color: '#ffffff' }}
        >
          + Schedule Stream
        </Button>
      </div>

      {/* Live Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="rounded-lg shadow-md overflow-hidden"
              style={{ backgroundColor: colorScheme.surface }}
            >
              {/* Status Badge */}
              <div
                className="px-4 py-2 text-white text-sm font-bold"
                style={{ backgroundColor: getStatusColor(session.status) }}
              >
                {session.status.toUpperCase()}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-bold">{session.title}</h3>
                <div
                  className="text-sm space-y-2"
                  style={{ color: colorScheme.textSecondary }}
                >
                  <p>
                    <strong>Host:</strong> {session.host}
                  </p>
                  <p>
                    <strong>Start Time:</strong>{' '}
                    {new Date(session.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Viewers:</strong> {session.viewers.toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(session)}
                    className="flex-1 px-3 py-2 text-sm rounded transition-all"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session._id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 rounded transition-all"
                    style={{ backgroundColor: '#ff666620' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff666630';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff666620';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="col-span-full py-12 text-center"
            style={{ color: colorScheme.textSecondary }}
          >
            <p className="text-lg">No live sessions scheduled yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Session Modal */}
      {/* Add/Edit Session Modal */}
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
                  {editingId ? 'Edit Live Stream' : 'Schedule Live Stream'}
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
                  {/* Stream Title and Host - Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        id="stream-title"
                        type="text"
                        label="Stream Title"
                        placeholder="e.g., Sunday Worship Service"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Input
                        id="stream-host"
                        type="text"
                        label="Host Name"
                        placeholder="e.g., Pastor John"
                        value={formData.host}
                        onChange={(e) =>
                          setFormData({ ...formData, host: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Start Time */}
                  <div>
                    <Input
                      id="stream-start-time"
                      type="datetime-local"
                      label="Start Time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      fullWidth
                      required
                    />
                  </div>

                  {/* Stream URL */}
                  <div>
                    <Input
                      id="stream-url"
                      type="url"
                      label="YouTube/Twitch Stream URL"
                      placeholder="e.g., https://youtube.com/live/..."
                      value={formData.streamUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, streamUrl: e.target.value })
                      }
                      fullWidth
                      required
                    />
                    <p className="mt-2 text-xs" style={{ color: colorScheme.textSecondary }}>
                      Get your stream URL from YouTube Live or Twitch after creating a broadcast
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="stream-description" className="block text-xs font-medium mb-1" style={{ color: colorScheme.text }}>
                      Description (Optional)
                    </label>
                    <textarea
                      id="stream-description"
                      placeholder="Add any additional details about this stream..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors"
                      style={{
                        borderColor: colorScheme.border,
                        backgroundColor: colorScheme.background,
                        color: colorScheme.text,
                      }}
                      rows={3}
                    />
                  </div>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white" style={{ borderColor: colorScheme.border, backgroundColor: colorScheme.surface }}>
                <Button
                  onClick={handleAddSession}
                  disabled={loading}
                  variant="primary"
                  className="flex-1 text-sm"
                >
                  {loading ? 'Scheduling...' : editingId ? 'Update Stream' : 'Schedule Stream'}
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

export default LiveSessions;
