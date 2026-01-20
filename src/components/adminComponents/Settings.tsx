'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { settingsService } from '@/services/settingsService';
import { useSettings } from '@/contexts/SettingsContext';
import styles from './Settings.module.css';

// eslint-disable-next-line @next/next/no-css-in-js
interface ValidationErrors {
  [key: string]: string;
}

const Settings: React.FC = () => {
  const colorScheme = colors;
  const { refreshSettings: refreshGlobalSettings } = useSettings();
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
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetchLoading(true);
      setSaveError('');
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to load settings';
      setSaveError(errorMessage);
      console.error('Failed to fetch settings:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const validateSettings = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!settings.siteName.trim()) {
      errors.siteName = 'Site name is required';
    }

    if (!settings.siteEmail.trim()) {
      errors.siteEmail = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.siteEmail)) {
      errors.siteEmail = 'Please enter a valid email address';
    }

    if (!settings.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }

    if (!settings.address.trim()) {
      errors.address = 'Address is required';
    }

    const maxFileUploadNum = parseInt(settings.maxFileUpload);
    if (isNaN(maxFileUploadNum) || maxFileUploadNum <= 0) {
      errors.maxFileUpload = 'Max file upload must be a positive number';
    }

    const sessionTimeoutNum = parseInt(settings.sessionTimeout);
    if (isNaN(sessionTimeoutNum) || sessionTimeoutNum <= 0) {
      errors.sessionTimeout = 'Session timeout must be a positive number';
    }

    return errors;
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts editing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSave = async () => {
    const errors = validateSettings();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setSaveError('');
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
      setValidationErrors({});
      // Refresh global settings context
      await refreshGlobalSettings();
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      setSaveError(errorMessage);
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setSaveError('');
    try {
      await settingsService.resetSettings();
      setShowResetConfirm(false);
      setValidationErrors({});
      await fetchSettings();
      await refreshGlobalSettings();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset settings';
      setSaveError(errorMessage);
      console.error('Error resetting settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        <div className={styles.section} style={{ backgroundColor: colorScheme.surface }}>
          <p className="text-center text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      {isSaved && (
        <div className={styles.successMessage}>
          ✓ Settings saved successfully!
        </div>
      )}

      {saveError && (
        <div className={styles.errorMessage}>
          ⚠ {saveError}
        </div>
      )}

      {/* General Settings */}
      <div className={styles.section} style={{ backgroundColor: colorScheme.surface }}>
        <h2 className={styles.sectionTitle}>General Settings</h2>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Site Name <span className={styles.required}>*</span>
          </label>
          <Input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            placeholder="Enter site name"
          />
          {validationErrors.siteName && (
            <p className={styles.errorText}>{validationErrors.siteName}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Admin Email <span className={styles.required}>*</span>
          </label>
          <Input
            type="email"
            value={settings.siteEmail}
            onChange={(e) => handleChange('siteEmail', e.target.value)}
            placeholder="Enter admin email"
          />
          {validationErrors.siteEmail && (
            <p className={styles.errorText}>{validationErrors.siteEmail}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Phone Number <span className={styles.required}>*</span>
          </label>
          <Input
            type="tel"
            value={settings.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number"
          />
          {validationErrors.phoneNumber && (
            <p className={styles.errorText}>{validationErrors.phoneNumber}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Address <span className={styles.required}>*</span>
          </label>
          <textarea
            title="Site address"
            placeholder="Enter site address"
            className={styles.textarea}
            rows={3}
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          {validationErrors.address && (
            <p className={styles.errorText}>{validationErrors.address}</p>
          )}
        </div>
      </div>

      {/* Upload & Session Settings */}
      <div className={styles.section} style={{ backgroundColor: colorScheme.surface }}>
        <h2 className={styles.sectionTitle}>Upload & Session Settings</h2>

        <div className={styles.gridContainer}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Max File Upload Size (MB) <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              value={settings.maxFileUpload}
              onChange={(e) => handleChange('maxFileUpload', e.target.value)}
              placeholder="Enter max file size"
            />
            {validationErrors.maxFileUpload && (
              <p className={styles.errorText}>{validationErrors.maxFileUpload}</p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Session Timeout (minutes) <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              placeholder="Enter session timeout"
            />
            {validationErrors.sessionTimeout && (
              <p className={styles.errorText}>{validationErrors.sessionTimeout}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={styles.section} style={{ backgroundColor: colorScheme.surface }}>
        <h2 className={styles.sectionTitle}>Notification Settings</h2>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) => handleChange('enableNotifications', e.target.checked)}
            className={styles.checkbox}
            disabled={loading}
          />
          <span className={styles.checkboxText}>Enable In-App Notifications</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.enableEmails}
            onChange={(e) => handleChange('enableEmails', e.target.checked)}
            className={styles.checkbox}
            disabled={loading}
          />
          <span className={styles.checkboxText}>Enable Email Notifications</span>
        </label>
      </div>

      {/* System Settings */}
      <div className={styles.section} style={{ backgroundColor: colorScheme.surface }}>
        <h2 className={styles.sectionTitle}>System Settings</h2>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
            className={styles.checkbox}
            disabled={loading}
          />
          <span className={styles.checkboxText}>Maintenance Mode</span>
          <span style={{ color: colorScheme.textSecondary }} className={styles.helperText}>
            (Site will be unavailable for users)
          </span>
        </label>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ backgroundColor: colorScheme.surface }}>
            <h3 className={styles.modalTitle}>Confirm Reset</h3>
            <p className={styles.modalDescription}>
              Are you sure you want to reset all settings to their defaults? This action cannot be undone.
            </p>
            <div className={styles.modalButtonContainer}>
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={loading}
                className={styles.modalButton}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className={`${styles.modalButton} ${styles.modalButtonDanger}`}
              >
                {loading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          onClick={() => setShowResetConfirm(true)}
          disabled={loading}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          {loading ? 'Processing...' : 'Reset to Defaults'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
