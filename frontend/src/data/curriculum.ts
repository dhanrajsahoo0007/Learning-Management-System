import { architectureTopics, findClassicTopic } from './systemDesignData';
import { aiSystemDesignTopics, findAITopic } from './aiSystemDesignData';
import type { ArchitectureTopic } from './systemDesignTypes';

export function findTopicById(id: string): ArchitectureTopic | undefined {
  return findClassicTopic(id) || findAITopic(id);
}

export function getAllTopics(): ArchitectureTopic[] {
  return [...architectureTopics, ...aiSystemDesignTopics];
}

export function getTopicPath(topic: ArchitectureTopic): string {
  return topic.track === 'ai' ? `/system-design/ai/${topic.id}` : `/system-design/${topic.id}`;
}

export function getBackPath(topic: ArchitectureTopic): string {
  return topic.track === 'ai' ? '/system-design/ai' : '/system-design';
}
