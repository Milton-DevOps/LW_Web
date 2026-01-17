'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { settingsService } from '@/services/settingsService';

const Settings: React.FC = () => {
  const colorScheme = colors;
  const [settings, setSettings] = useState({
    siteName: 'Light World Mission',
    siteEmail: 'admin@lightworldmission.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Church Street, City, State 12345',
    maxFileUpload: '50',
    sessionTimeout: '30',
    enableNotifications: true,
    enableEmails: true,
    maintenanceMode: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetchLoading(true);
      const response = await settingsService.getSettings();
      setSettings({
        siteName: response.siteName || 'Light World Mission',
        siteEmail: response.siteEmail || 'admin@lightworldmission.com',
        phoneNumber: response.phoneNumber || '+1 (555) 123-4567',
        address: response.address || '123 Church Street, City, State 12345',
        maxFileUpload: response.maxFileUpload?.toString() || '50',
        sessionTimeout: response.sessionTimeout?.toString() || '30',
        enableNotifications: response.enableNotifications ?? true,
        enableEmails: response.enableEmails ?? true,
        maintenanceMode: response.maintenanceMode ?? false,
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      alert('Failed to load settings');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!settings.siteEmail) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await settingsService.updateSettings({
        siteName: settings.siteName,
        siteEmail: settings.siteEmail,
        phoneNumber: settings.phoneNumber,
        address: settings.address,
        maxFileUpload: parseInt(settings.maxFileUpload),
        sessionTimeout: parseInt(settings.sessionTimeout),
        enableNotifications: settings.enableNotifications,
        enableEmails: settings.enableEmails,
        maintenanceMode: settings.maintenanceMode,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) return;

    setLoading(true);
    try {
      await settingsService.resetSettings();
      alert('Settings reset to defaults');
      await fetchSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {isSaved && (
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: '#d4edda', color: '#155724' }}
        >
          ✓ Settings saved successfully!
        </div>
      )}

      {/* General Settings */}
      <div
        className="p-6 rounded-lg shadow-md space-y-4"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold">General Settings</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <Input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Admin Email</label>
          <Input
            type="email"
            value={settings.siteEmail}
            onChange={(e) => handleChange('siteEmail', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input
            type="tel"
            value={settings.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            className="w-full px-4 py-2 border rounded"
            style={{
              borderColor: colorScheme.border,
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
            rows={3}
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
      </div>

      {/* Upload & Session Settings */}
      <div
        className="p-6 rounded-lg shadow-md space-y-4"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold">Upload & Session Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Max File Upload Size (MB)
            </label>
            <Input
              type="number"
              value={settings.maxFileUpload}
              onChange={(e) => handleChange('maxFileUpload', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div
        className="p-6 rounded-lg shadow-md space-y-4"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold">Notification Settings</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) => handleChange('enableNotifications', e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-medium">Enable In-App Notifications</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableEmails}
            onChange={(e) => handleChange('enableEmails', e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-medium">Enable Email Notifications</span>
        </label>
      </div>

      {/* System Settings */}
      <div
        className="p-6 rounded-lg shadow-md space-y-4"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <h2 className="text-xl font-bold">System Settings</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-medium">Maintenance Mode</span>
          <span style={{ color: colorScheme.textSecondary }} className="text-sm">
            (Site will be unavailable for users)
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          className="flex-1"
          style={{ backgroundColor: '#27ae60' }}
        >
          Save Settings
        </Button>
        <Button
          onClick={handleReset}
          className="flex-1"
          style={{ backgroundColor: '#95a5a6' }}
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
