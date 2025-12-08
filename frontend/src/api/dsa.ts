import { apiClient } from './client';
import { DSATopic } from '../data/dsaData';

export const dsaService = {
  getAll: async (): Promise<DSATopic[]> => {
    const response = await apiClient.get<{ data: DSATopic[] }>('/dsa/topics');
    return response.data.data;
  },

  getById: async (id: string): Promise<DSATopic> => {
    const response = await apiClient.get<{ data: DSATopic }>(`/dsa/topics/${id}`);
    return response.data.data;
  },

  getCategories: async (): Promise<{name: string, count: number}[]> => {
    const response = await apiClient.get<{ data: {name: string, count: number}[] }>('/dsa/categories');
    return response.data.data;
  }
};
