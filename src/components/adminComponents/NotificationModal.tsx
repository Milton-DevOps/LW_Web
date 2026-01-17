'use client';

import React from 'react';
import { Button } from '@/components';
import { colors } from '@/constants/colors';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const colorScheme = colors;
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'New Sermon Added',
      message: 'Pastor John has uploaded a new sermon: "The Power of Faith"',
      timestamp: '2 hours ago',
      isRead: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'New User Registration',
      message: 'Jane Smith has registered as a new user',
      timestamp: '5 hours ago',
      isRead: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'System Update',
      message: 'A new system update is available',
      timestamp: '1 day ago',
      isRead: true,
      type: 'warning',
    },
    {
      id: '4',
      title: 'Book Download',
      message: 'Mike Johnson downloaded "Living in Faith" book',
      timestamp: '2 days ago',
      isRead: true,
      type: 'info',
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#27ae60';
      case 'warning':
        return '#f39c12';
      case 'error':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        className="fixed z-50 w-full max-w-md max-h-96 rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: colorScheme.surface,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex justify-between items-center"
          style={{ borderColor: colorScheme.border }}
        >
          <h3 className="text-lg font-bold">Notifications</h3>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: colorScheme.textSecondary }}
          >
            ✕
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-6 text-center" style={{ color: colorScheme.textSecondary }}>
              No notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 border-b transition-colors ${
                  !notif.isRead ? 'opacity-100' : 'opacity-75'
                }`}
                style={{
                  borderColor: colorScheme.border,
                  backgroundColor: !notif.isRead
                    ? colorScheme.background
                    : colorScheme.surface,
                }}
              >
                <div className="flex gap-3">
                  {/* Type Indicator */}
                  <div
                    className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(notif.type) }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <p
                      className="text-sm mt-1 line-clamp-2"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {notif.message}
                    </p>
                    <p
                      className="text-xs mt-2"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {notif.timestamp}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-col text-xs">
                    {!notif.isRead && (
                      <Button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="!px-2 !py-1 text-xs whitespace-nowrap"
                        style={{ backgroundColor: colorScheme.primary }}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      className="!px-2 !py-1 text-xs whitespace-nowrap"
                      style={{ backgroundColor: colorScheme.secondary }}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-center"
          style={{ borderColor: colorScheme.border }}
        >
          <button
            className="text-sm font-medium"
            style={{ color: colorScheme.primary }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
