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
  request?: string;
  response?: string;
  errors?: string;
}

export interface DataModelColumn {
  name: string;
  type?: string;
  notes?: string;
}

export interface DataModelTable {
  name: string;
  columns: Array<string | DataModelColumn>;
  notes?: string;
  primaryKey?: string[];
  indexes?: string[];
}

export interface DeepDive {
  title: string;
  body: string;
  diagram?: string;
  animation?: string;
}

export interface ScalingStage {
  scale: string;
  focus: string;
}

export interface ProblemStatement {
  prompt: string;
  inScope?: string[];
  outOfScope?: string[];
}

export interface FollowUpQuestion {
  question: string;
  answer: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ComparisonTableData {
  title: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export type LessonDiagramKind = 'excalidraw' | 'mermaid' | 'animation';

export interface LessonDiagram {
  id: string;
  title: string;
  kind: LessonDiagramKind;
  src: string;
}

export interface WalkthroughStep {
  title: string;
  description: string;
  diagram?: string;
  animation?: string;
}

export interface SystemDesignContent {
  overview: string;
  whyItExists: string;
  whenToUse: string[];
  problemStatement?: ProblemStatement;
  assumptions?: string[];
  functionalRequirements: RequirementItem[];
  nonFunctionalRequirements: RequirementItem[];
  estimates: EstimateItem[];
  concepts: string[];
  comparisons?: ComparisonTableData[];
  walkthrough: WalkthroughStep[];
  steps: WalkthroughStep[];
  apis: ApiEndpoint[];
  dataModel: DataModelTable[];
  architecture: string;
  diagram?: string;
  diagrams?: LessonDiagram[];
  deepDives: DeepDive[];
  tradeoffs: string[];
  bottlenecks: string[];
  scalingPath: ScalingStage[];
  interviewScript: string[];
  commonMistakes: string[];
  relatedTopics: string[];
  examples: string[];
  practicePrompt?: string;
  followUps?: FollowUpQuestion[];
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
    assumptions: [],
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    estimates: [],
    concepts: [],
    comparisons: [],
    walkthrough: [],
    steps: [],
    apis: [],
    dataModel: [],
    architecture: '',
    diagrams: [],
    deepDives: [],
    tradeoffs: [],
    bottlenecks: [],
    scalingPath: [],
    interviewScript: [],
    commonMistakes: [],
    relatedTopics: [],
    examples: [],
    followUps: [],
    ...partial,
  };
}
