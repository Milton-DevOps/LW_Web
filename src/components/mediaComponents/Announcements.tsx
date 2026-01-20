'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { notificationService } from '@/services/notificationService';
import { departmentService } from '@/services/departmentService';
import { useAuthContext } from '@/contexts/AuthContext';

interface Notification {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: {
    firstName: string;
    lastName: string;
  };
}

const Announcements: React.FC = () => {
  const colorScheme = colors;
  const { user } = useAuthContext();
  const [announcements, setAnnouncements] = useState<Notification[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (user?.department) {
      fetchAnnouncementsAndMemberCount();
    }
  }, [user]);

  const fetchAnnouncementsAndMemberCount = async () => {
    try {
      setFetchLoading(true);

      // Fetch department to get member count
      const deptResponse = await departmentService.getDepartmentById(user?.department!);
      setMemberCount(deptResponse.department.members?.length || 0);

      // Fetch announcements
      const notifResponse = await notificationService.getUserNotifications({ page: 1, limit: 50 });
      const filtered = (notifResponse.data || []).filter(
        (n: any) => n.type === 'department_update' && n.relatedDocumentType === 'department'
      );
      setAnnouncements(filtered);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    if (memberCount === 0) {
      alert('You need to have members in your department to send announcements');
      return;
    }

    try {
      setLoading(true);
      await notificationService.sendDepartmentAnnouncement(user?.department!, {
        title: formData.title,
        content: formData.content,
      });
      alert(`Announcement sent to ${memberCount} members!`);
      setFormData({ title: '', content: '' });
      setShowCompose(false);
      await fetchAnnouncementsAndMemberCount();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
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
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p style={{ color: colorScheme.textSecondary }} className="mt-2">
            Send updates and announcements to your {memberCount} department members
          </p>
        </div>
        <Button
          onClick={() => setShowCompose(!showCompose)}
          style={{ backgroundColor: colors.primary, color: '#ffffff' }}
        >
          {showCompose ? '✕ Cancel' : '📢 New Announcement'}
        </Button>
      </div>

      {/* Compose Section */}
      {showCompose && (
        <div
          className="rounded-lg p-6 shadow-md"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <h2 className="text-xl font-bold mb-4">Compose Announcement</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Announcement title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                placeholder="Write your announcement message here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                style={{
                  borderColor: colorScheme.border,
                  backgroundColor: colorScheme.background,
                }}
                rows={6}
              />
              <p
                className="text-xs mt-2"
                style={{ color: colorScheme.textSecondary }}
              >
                This message will be sent to {memberCount} members
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCompose(false)}
                className="flex-1"
                style={{
                  backgroundColor: colorScheme.border,
                  color: colorScheme.text,
                }}
              >
                Discard
              </Button>
              <Button
                onClick={handleSendAnnouncement}
                disabled={loading || memberCount === 0}
                className="flex-1"
                style={{
                  backgroundColor: colors.primary,
                  color: '#ffffff',
                  opacity: loading || memberCount === 0 ? 0.6 : 1,
                }}
              >
                {loading ? 'Sending...' : 'Send Announcement'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Announcements</h2>

        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="rounded-lg p-4 shadow-md"
              style={{ backgroundColor: colorScheme.surface }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p
                    className="text-xs"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    From:{' '}
                    {announcement.senderId?.firstName}{' '}
                    {announcement.senderId?.lastName} •{' '}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: announcement.isRead ? colorScheme.border : colors.primary + '30',
                    color: announcement.isRead ? colorScheme.textSecondary : colors.primary,
                  }}
                >
                  {announcement.isRead ? 'Read' : 'New'}
                </span>
              </div>

              <p className="text-sm mb-4">{announcement.content}</p>

              <button
                className="text-sm px-3 py-2 rounded transition-all"
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
                Reply
              </button>
            </div>
          ))
        ) : (
          <div
            className="py-12 text-center rounded-lg"
            style={{
              backgroundColor: colorScheme.surface,
              color: colorScheme.textSecondary,
            }}
          >
            <p className="text-lg">No announcements yet</p>
            <p className="text-sm mt-2">
              Announcements from department heads will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
