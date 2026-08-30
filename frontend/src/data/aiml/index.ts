import { aimlInterviewTopics } from './aimlInterviews';
import { aimlMachineLearningTopics } from './aimlMachineLearning';
import { aimlPathOverviewTopics } from './aimlPathOverviews';
import { aimlSystemDesignTopics } from './aimlSystemDesign';
import type { ArchitectureTopic } from '../systemDesignTypes';

export { aimlHubs, aimlOutlineDefs } from './aimlHubs';
export { aimlInterviewTopics } from './aimlInterviews';
export { aimlMachineLearningTopics } from './aimlMachineLearning';
export { aimlPathOverviewTopics } from './aimlPathOverviews';
export { aimlSystemDesignTopics } from './aimlSystemDesign';
export type { ArticleContent, ContentBlock, HubPage } from './types';
export { toArticle } from './types';

export const aimlTopics: ArchitectureTopic[] = [
  ...aimlPathOverviewTopics,
  ...aimlMachineLearningTopics,
  ...aimlSystemDesignTopics,
  ...aimlInterviewTopics,
];

export function findAimlTopic(id: string): ArchitectureTopic | undefined {
  return aimlTopics.find((topic) => topic.id === id);
}
