import { apiClient } from './client';
import { ArchitectureTopic } from '../data/systemDesignData';

export const systemDesignService = {
  getTopics: async (): Promise<ArchitectureTopic[]> => {
    const response = await apiClient.get<{ data: ArchitectureTopic[] }>('/system-design/topics');
    return response.data.data;
  },

  getAITopics: async (): Promise<ArchitectureTopic[]> => {
    const response = await apiClient.get<{ data: ArchitectureTopic[] }>('/system-design/ai-topics');
    return response.data.data;
  },

  getTopicById: async (id: string): Promise<ArchitectureTopic> => {
    const response = await apiClient.get<{ data: ArchitectureTopic }>(`/system-design/topics/${id}`);
    return response.data.data;
  }
};
