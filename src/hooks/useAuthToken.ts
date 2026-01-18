'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/services/authService';

/**
 * Custom hook to get auth token in client components
 * Ensures token is available after hydration
 */
export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get token after component mounts (client-side)
    const authToken = getToken();
    setToken(authToken);
    setIsLoading(false);
  }, []);

  return { token, isLoading };
};