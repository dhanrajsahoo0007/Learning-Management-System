import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  }
};
