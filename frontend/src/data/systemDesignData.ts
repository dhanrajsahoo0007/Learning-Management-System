import { classicFundamentals } from './classicFundamentals';
import { classicProducts } from './classicProducts';
import type { ArchitectureTopic } from './systemDesignTypes';

export type { ArchitectureTopic, SystemDesignContent } from './systemDesignTypes';
export type { TopicSection, TopicTrack, TopicDifficulty } from './systemDesignTypes';

export const architectureTopics: ArchitectureTopic[] = [...classicFundamentals, ...classicProducts];

export function getClassicTopics(): ArchitectureTopic[] {
  return architectureTopics;
}

export function getClassicFundamentals(): ArchitectureTopic[] {
  return architectureTopics.filter((topic) => topic.section === 'fundamentals');
}

export function getClassicProducts(): ArchitectureTopic[] {
  return architectureTopics.filter((topic) => topic.section === 'products');
}

export function findClassicTopic(id: string): ArchitectureTopic | undefined {
  return architectureTopics.find((topic) => topic.id === id);
}
