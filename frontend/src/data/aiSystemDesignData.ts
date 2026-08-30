import { aiFundamentals } from './aiFundamentals';
import { aiProducts } from './aiProducts';
import { getClassicFundamentals, getClassicProducts } from './systemDesignData';
import type { ArchitectureTopic } from './systemDesignTypes';

export const aiSystemDesignTopics: ArchitectureTopic[] = [...aiFundamentals, ...aiProducts];

export function getAITopics(): ArchitectureTopic[] {
  return aiSystemDesignTopics;
}

export function getAIFundamentals(): ArchitectureTopic[] {
  return aiSystemDesignTopics.filter((topic) => topic.section === 'fundamentals');
}

export function getAIProducts(): ArchitectureTopic[] {
  return aiSystemDesignTopics.filter((topic) => topic.section === 'products');
}

export function getAIPrerequisiteTopics(): ArchitectureTopic[] {
  return getClassicFundamentals().filter((topic) =>
    ['databases', 'caching', 'load-balancer', 'cdn', 'message-queues'].includes(topic.id)
  );
}

export function getAIRelatedClassicProducts(): ArchitectureTopic[] {
  return getClassicProducts().filter((topic) =>
    ['linkedin', 'tinder', 'youtube', 'news-feed'].includes(topic.id)
  );
}

export function findAITopic(id: string): ArchitectureTopic | undefined {
  return aiSystemDesignTopics.find((topic) => topic.id === id);
}

export function findAnyTopic(id: string): ArchitectureTopic | undefined {
  return findAITopic(id) || getClassicFundamentals().concat(getClassicProducts()).find((topic) => topic.id === id);
}
