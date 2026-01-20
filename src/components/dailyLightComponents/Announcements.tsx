'use client';

import React, { useState, useEffect } from 'react';
import { colors } from '@/constants/colors';
import { notificationService } from '@/services/notificationService';
import { departmentService } from '@/services/departmentService';
import { getUser } from '@/services/authService';
import { Button, Input } from '@/components';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  senderId?: {
    firstName: string;
    lastName: string;
  };
}

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Announcements: React.FC = () => {
  const colorScheme = colors;
  const user = getUser();

  const [activeTab, setActiveTab] = useState<'send' | 'received'>('send');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.department) {
        setError('Department information not found');
        setLoading(false);
        return;
      }

      // Fetch members
      const membersResponse = await departmentService.getDepartmentMembers(user.department);
      if (membersResponse.success) {
        setMembers(membersResponse.members);
      }

      // Fetch announcements/notifications
      const notificationsResponse = await notificationService.getUserNotifications();
      if (notificationsResponse.success) {
        // Filter only announcement type notifications
        const announcements = notificationsResponse.data.filter(
          (n: any) => n.type === 'user_message' || n.type === 'department_update'
        );
        setAnnouncements(announcements);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError('Please fill in all fields');
      return;
    }

    if (members.length === 0) {
      setError('No members to send announcement to');
      return;
    }

    try {
      setLoading(true);
      const response = await notificationService.sendDepartmentAnnouncement(user?.department!, {
        title: formData.title,
        content: formData.content,
      });

      if (response.success) {
        setSuccess(true);
        setFormData({ title: '', content: '' });
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

        // Refresh announcements
        await fetchData();
      } else {
        setError(response.message || 'Failed to send announcement');
      }
    } catch (err) {
      console.error('Error sending announcement:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (announcementId: string) => {
    try {
      const response = await notificationService.markAsRead(announcementId);
      if (response.success) {
        setAnnouncements(
          announcements.map(a =>
            a._id === announcementId ? { ...a, isRead: true } : a
          )
        );
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Announcements</h1>
        <p style={{ color: colorScheme.textSecondary }} className="mt-2">
          Send notifications and announcements to department members
        </p>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#f8d7da',
            borderColor: '#dc3545',
            color: '#721c24',
          }}
        >
          ✗ {error}
        </div>
      )}

      {success && (
        <div
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#d4edda',
            borderColor: '#28a745',
            color: '#155724',
          }}
        >
          ✓ Announcement sent successfully to {members.length} member{members.length !== 1 ? 's' : ''}!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: colorScheme.border }}>
        <button
          onClick={() => setActiveTab('send')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'send' ? 'border-current' : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'send' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Send Announcement
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'received' ? 'border-current' : 'border-transparent'
          }`}
          style={{
            color: activeTab === 'received' ? colors.primary : colorScheme.textSecondary,
          }}
        >
          Announcements ({announcements.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p>Loading...</p>
        </div>
      ) : activeTab === 'send' ? (
        // Send Announcement
        <form onSubmit={handleSendAnnouncement}>
          <div
            className="p-6 rounded-lg shadow-md space-y-6"
            style={{ backgroundColor: colorScheme.surface }}
          >
            {/* Recipients Info */}
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: colorScheme.background,
              }}
            >
              <p className="text-sm font-medium">
                📤 Recipients: <span className="font-bold">{members.length} member{members.length !== 1 ? 's' : ''}</span>
              </p>
              <p style={{ color: colorScheme.textSecondary }} className="text-xs mt-1">
                This announcement will be sent to all members of your department
              </p>
            </div>

            {/* Title */}
            <div>
              <Input
                label="Announcement Title *"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setError(null);
                }}
                placeholder="Enter announcement title"
                required
                fullWidth
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value });
                  setError(null);
                }}
                placeholder="Enter announcement message"
                rows={6}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || members.length === 0}
                className="flex-1"
              >
                {loading ? 'Sending...' : `Send to ${members.length} Member${members.length !== 1 ? 's' : ''}`}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setFormData({ title: '', content: '' });
                  setError(null);
                }}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      ) : (
        // Received Announcements
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <p style={{ color: colorScheme.textSecondary }}>No announcements yet</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`p-6 rounded-lg shadow-md border-l-4 transition-all ${
                  !announcement.isRead ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: colorScheme.surface,
                  borderColor: !announcement.isRead ? colors.primary : colorScheme.border,
                  opacity: announcement.isRead ? 0.7 : 1,
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                    {announcement.senderId && (
                      <p style={{ color: colorScheme.textSecondary }} className="text-sm">
                        from {announcement.senderId.firstName} {announcement.senderId.lastName}
                      </p>
                    )}
                    <p className="mt-3">{announcement.content}</p>
                    <p style={{ color: colorScheme.textSecondary }} className="text-xs mt-3">
                      {new Date(announcement.createdAt).toLocaleDateString()} at{' '}
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {!announcement.isRead && (
                    <Button
                      onClick={() => handleMarkAsRead(announcement._id)}
                      variant="primary"
                      className="text-sm"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;
