import { apiClient } from './client';
import { DSATopic } from '../data/dsaData';
import type { DSAProblem, DSAProblemSummary } from '../types/dsa';

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
  },

  getProblems: async (topicId: string): Promise<DSAProblemSummary[]> => {
    const response = await apiClient.get<{ data: DSAProblemSummary[] }>(
      `/dsa/topics/${topicId}/problems`
    );
    return response.data.data ?? [];
  },

  // Problem ids are slash-separated paths such as "graphs/dfs/dfs-on-an-undirected-graphs",
  // so they are appended to the route rather than encoded as a single segment.
  getProblem: async (problemId: string): Promise<DSAProblem> => {
    const response = await apiClient.get<{ data: DSAProblem }>(`/dsa/problems/${problemId}`);
    return response.data.data;
  }
};
