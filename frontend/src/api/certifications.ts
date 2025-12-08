import { apiClient } from './client';
import { Certification } from '../data/certificationsData';

export const certificationService = {
  getAll: async (): Promise<Certification[]> => {
    const response = await apiClient.get<{ data: any[] }>('/certifications');
    return response.data.data.map(cert => ({
      ...cert,
      progress: {
        completedModules: cert.completedModules,
        totalModules: cert.totalModules
      }
    }));
  },

  getById: async (id: string): Promise<Certification> => {
    const response = await apiClient.get<{ data: any }>(`/certifications/${id}`);
    const cert = response.data.data;
    return {
      ...cert,
      progress: {
        completedModules: cert.completedModules,
        totalModules: cert.totalModules
      }
    };
  },

  getProviders: async (): Promise<string[]> => {
    const response = await apiClient.get<{ data: string[] }>('/certifications/providers');
    return response.data.data;
  }
};
