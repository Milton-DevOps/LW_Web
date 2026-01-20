'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { SettingsProvider } from '../contexts/SettingsContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <SettingsProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SettingsProvider>
);

export { AuthProvider, SettingsProvider };
