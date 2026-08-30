import type { ArticleContent } from './aiml/types';

export type TopicSection = 'fundamentals' | 'products' | 'paths' | 'mlsd' | 'interviews';
export type TopicTrack = 'classic' | 'ai' | 'aiml';
export type TopicDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RequirementItem {
  title: string;
  detail: string;
}

export interface EstimateItem {
  label: string;
  value: string;
  note?: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface DataModelTable {
  name: string;
  columns: string[];
  notes?: string;
}

export interface DeepDive {
  title: string;
  body: string;
}

export interface ScalingStage {
  scale: string;
  focus: string;
}

export interface SystemDesignContent {
  overview: string;
  whyItExists: string;
  whenToUse: string[];
  functionalRequirements: RequirementItem[];
  nonFunctionalRequirements: RequirementItem[];
  estimates: EstimateItem[];
  concepts: string[];
  walkthrough: Array<{
    title: string;
    description: string;
    diagram?: string;
  }>;
  steps: Array<{
    title: string;
    description: string;
    diagram?: string;
  }>;
  apis: ApiEndpoint[];
  dataModel: DataModelTable[];
  architecture: string;
  diagram?: string;
  deepDives: DeepDive[];
  tradeoffs: string[];
  bottlenecks: string[];
  scalingPath: ScalingStage[];
  interviewScript: string[];
  commonMistakes: string[];
  relatedTopics: string[];
  examples: string[];
  practicePrompt?: string;
}

export interface ArchitectureTopic {
  id: string;
  title: string;
  description: string;
  difficulty: TopicDifficulty;
  progress: number;
  icon: string;
  color: string;
  section: TopicSection;
  track: TopicTrack;
  prerequisites: string[];
  estimatedMinutes: number;
  order: number;
  content: SystemDesignContent;
  article?: ArticleContent;
}

export function emptyContent(partial: Partial<SystemDesignContent> & Pick<SystemDesignContent, 'overview'>): SystemDesignContent {
  return {
    whyItExists: '',
    whenToUse: [],
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    estimates: [],
    concepts: [],
    walkthrough: [],
    steps: [],
    apis: [],
    dataModel: [],
    architecture: '',
    deepDives: [],
    tradeoffs: [],
    bottlenecks: [],
    scalingPath: [],
    interviewScript: [],
    commonMistakes: [],
    relatedTopics: [],
    examples: [],
    ...partial,
  };
}
