import { apiClient } from './client';
import { architectureTopics } from '../data/systemDesignData';
import { aiSystemDesignTopics } from '../data/aiSystemDesignData';
import { findTopicById } from '../data/curriculum';
import type { ArchitectureTopic } from '../data/systemDesignTypes';

function isRichTopic(topic: ArchitectureTopic | undefined): topic is ArchitectureTopic {
  return Boolean(topic?.content?.whyItExists && topic.section && topic.track);
}

export const systemDesignService = {
  getTopics: async (): Promise<ArchitectureTopic[]> => {
    try {
      const response = await apiClient.get<{ data: ArchitectureTopic[] }>('/system-design/topics');
      const remote = response.data.data || [];
      if (remote.length && remote.every(isRichTopic)) {
        return remote.filter((topic) => topic.track !== 'ai');
      }
    } catch {
      // Curriculum files are the source of truth until the DB is reseeded.
    }
    return architectureTopics;
  },

  getAITopics: async (): Promise<ArchitectureTopic[]> => {
    try {
      const response = await apiClient.get<{ data: ArchitectureTopic[] }>('/ai-system-design/topics');
      const remote = response.data.data || [];
      if (remote.length && remote.every(isRichTopic)) {
        return remote.filter((topic) => topic.track === 'ai');
      }
    } catch {
      // Fall through to local AI curriculum.
    }
    return aiSystemDesignTopics;
  },

  getTopicById: async (id: string): Promise<ArchitectureTopic> => {
    const local = findTopicById(id);
    try {
      const response = await apiClient.get<{ data: ArchitectureTopic }>(`/system-design/topics/${id}`);
      const remote = response.data.data;
      if (isRichTopic(remote)) {
        return remote;
      }
    } catch {
      // AI topics and new ids may 404 on the classic service.
    }
    if (local) {
      return local;
    }
    throw new Error(`Topic not found: ${id}`);
  },
};
