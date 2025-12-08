import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Base API client (no auth)
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook to create authenticated API client with Clerk token
export const useApiClient = () => {
  const { getToken } = useAuth();

  const authenticatedClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add interceptor to inject Clerk token
  authenticatedClient.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
    return config;
  });

  return authenticatedClient;
};

// Legacy functions kept for backward compatibility (deprecated)
// These are no longer used with Clerk but kept to avoid breaking existing code
export const setAuthToken = (token: string) => {
  console.warn('setAuthToken is deprecated with Clerk authentication');
};

export const getAuthToken = () => {
  console.warn('getAuthToken is deprecated with Clerk authentication');
  return null;
};

export const logout = () => {
  console.warn('logout is deprecated - use Clerk signOut instead');
  window.location.href = '/sign-in';
};
