const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ===== Token Management =====

// Save token to localStorage AND cookies
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    console.log('[AUTH] saveToken called with:', typeof token, 'value:', token);
    
    if (!token || typeof token !== 'string') {
      console.error('[AUTH] saveToken: Token is not a string!', { type: typeof token, value: token });
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('authToken', token);
    const saved = localStorage.getItem('authToken');
    console.log('[AUTH] Token saved to localStorage:', saved ? 'SUCCESS' : 'FAILED');
    
    // Save to cookies with proper settings for Next.js middleware
    const maxAge = 30 * 24 * 60 * 60; // 30 days
    document.cookie = `auth_token=${token};path=/;max-age=${maxAge};SameSite=Lax`;
    console.log('[AUTH] Token cookie set');
  } else {
    console.warn('[AUTH] saveToken: window is undefined (SSR)');
  }
};

// Save user data with role to localStorage AND cookies
export const saveUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    console.log('[AUTH] saveUser called with:', user?.id, 'role:', user?.role);
    if (!user) {
      console.error('[AUTH] saveUser: User is null or undefined!');
      return;
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    const saved = localStorage.getItem('user');
    console.log('[AUTH] User saved to localStorage:', saved ? 'SUCCESS' : 'FAILED');
    
    // Save user role to cookies for middleware access
    if (user?.role) {
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      document.cookie = `user_role=${user.role};path=/;max-age=${maxAge};SameSite=Lax`;
      console.log('[AUTH] User role cookie set:', user.role);
    }
  } else {
    console.warn('[AUTH] saveUser: window is undefined (SSR)');
  }
};

// Get token from localStorage first, then cookies
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.warn('[AUTH] getToken: window is undefined (SSR)');
    return null;
  }
  
  try {
    // Try localStorage first
    const localToken = localStorage.getItem('authToken');
    console.log('[AUTH] getToken from localStorage:', localToken ? `${localToken.substring(0, 20)}...` : 'NOT FOUND');
    if (localToken && localToken.trim()) return localToken;
    
    // Fall back to cookies
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1];
    
    console.log('[AUTH] getToken from cookies:', cookieToken ? `${cookieToken.substring(0, 20)}...` : 'NOT FOUND');
    return cookieToken && cookieToken.trim() ? cookieToken : null;
  } catch (error) {
    console.error('[AUTH] Error getting token:', error);
    return null;
  }
};

// Get user data from localStorage
export const getUser = (): any => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Remove token and user data
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'auth_token=;path=/;max-age=0';
    document.cookie = 'user_role=;path=/;max-age=0';
  }
};

// ===== Auth Functions =====

// Register user
export const registerUser = async (userData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
  try {
    console.log('[AUTH] loginUser: Attempting login for:', credentials.email);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log('[AUTH] loginUser: Raw response data:', data);
    console.log('[AUTH] loginUser response:', {
      status: response.status,
      success: data.success,
      hasToken: !!data.token,
      tokenType: typeof data.token,
      tokenValue: data.token,
      hasUser: !!data.user,
      message: data.message,
    });

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token && typeof data.token === 'string') {
      console.log('[AUTH] loginUser: Token received:', `${data.token.substring(0, 20)}...`);
    } else {
      console.error('[AUTH] loginUser: Token is not a string!', { type: typeof data.token, value: data.token });
    }
    return data;
  } catch (error) {
    console.error('[AUTH] loginUser error:', error);
    throw error;
  }
};

// Google authentication
export const googleAuth = async (idToken: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Google authentication failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to request password reset');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string, password: string, confirmPassword: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token: string, profileData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
