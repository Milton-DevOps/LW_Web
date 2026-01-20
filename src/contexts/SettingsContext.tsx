'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { settingsService } from '@/services/settingsService';

export interface Settings {
  _id?: string;
  siteName: string;
  siteEmail: string;
  phoneNumber: string;
  address: string;
  maxFileUpload: number;
  sessionTimeout: number;
  enableNotifications: boolean;
  enableEmails: boolean;
  maintenanceMode: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (updatedSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSettings = await settingsService.getSettings();
      setSettings(fetchedSettings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (updatedSettings: Partial<Settings>) => {
      try {
        setError(null);
        const response = await settingsService.updateSettings(updatedSettings);
        setSettings(response.settings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
        setError(errorMessage);
        console.error('Error updating settings:', err);
        throw err;
      }
    },
    []
  );

  const resetSettings = useCallback(async () => {
    try {
      setError(null);
      const response = await settingsService.resetSettings();
      setSettings(response.settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset settings';
      setError(errorMessage);
      console.error('Error resetting settings:', err);
      throw err;
    }
  }, []);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Optional: Refresh settings every 30 seconds to keep them in sync
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSettings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
