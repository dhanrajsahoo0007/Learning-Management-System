import { isFeatureEnabled, type FeatureKey } from '@/config/features';
import { getAIProducts, findAITopic } from './aiSystemDesignData';
import { getClassicTopics, findClassicTopic } from './systemDesignData';
import {
  aimlInterviewTopics,
  aimlMachineLearningTopics,
  aimlOutlineDefs,
  aimlPathOverviewTopics,
  aimlSystemDesignTopics,
  findAimlTopic,
} from './aiml';
import type { ArchitectureTopic, TopicSection, TopicTrack } from './systemDesignTypes';

export type OutlineSectionIcon =
  | 'Compass'
  | 'Layers'
  | 'Gauge'
  | 'AppWindow'
  | 'BookOpen'
  | 'Cpu'
  | 'Sparkles'
  | 'TrendingUp'
  | 'FolderTree'
  | 'CircleDot'
  | 'TreePine'
  | 'Minimize2'
  | 'Combine'
  | 'Presentation';

export interface OutlineGroup {
  title: string;
  ids: string[];
}

export interface CourseOutlineSection {
  id: string;
  title: string;
  icon: OutlineSectionIcon;
  items: ArchitectureTopic[];
  groups?: OutlineGroup[];
  /** Classic lessons linked from the AI outline; excluded from AI prev/next. */
  external?: boolean;
  newIds?: string[];
}

export type OutlineItemCluster = {
  title?: string;
  items: ArchitectureTopic[];
};

export type CourseId =
  | 'classic-fundamentals'
  | 'classic-problems'
  | 'ai-fundamentals'
  | 'ai-problems'
  | 'aiml-paths'
  | 'aiml-machine-learning'
  | 'aiml-ml-system-design'
  | 'aiml-interviews';

export type CourseKind = 'fundamentals' | 'problems' | 'paths' | 'mlsd' | 'interviews' | 'algorithms';

export interface Course {
  id: CourseId;
  family: TopicTrack;
  kind: CourseKind;
  title: string;
  familyTitle: string;
  blurb: string;
  homePath: string;
  featureKey: FeatureKey;
}

export type CoursePath = {
  course: Course;
  topicId?: string;
};

type SectionDef = {
  id: string;
  title: string;
  icon: OutlineSectionIcon;
  ids: string[];
  groups?: OutlineGroup[];
  newIds?: string[];
};

const CLASSIC_FUNDAMENTAL_SECTIONS: SectionDef[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'Compass',
    ids: ['interview-approach', 'dns', 'http-rpc'],
    groups: [
      { title: 'Start here', ids: ['interview-approach'] },
      { title: 'The network', ids: ['dns', 'http-rpc'] },
    ],
    newIds: ['interview-approach', 'dns', 'http-rpc'],
  },
  {
    id: 'building-blocks',
    title: 'Building blocks',
    icon: 'Layers',
    ids: [
      'databases',
      'replication',
      'sharding',
      'transactions',
      'storage-media',
      'caching',
      'cdn',
      'load-balancer',
      'api-gateway',
      'rate-limiting',
      'message-queues',
      'batch-stream',
    ],
    groups: [
      { title: 'Data', ids: ['databases', 'replication', 'sharding', 'transactions'] },
      { title: 'Storage', ids: ['storage-media'] },
      { title: 'Speed', ids: ['caching', 'cdn'] },
      { title: 'Traffic', ids: ['load-balancer', 'api-gateway', 'rate-limiting'] },
      { title: 'Async work', ids: ['message-queues', 'batch-stream'] },
    ],
    newIds: [
      'databases',
      'replication',
      'sharding',
      'transactions',
      'storage-media',
      'caching',
      'cdn',
      'load-balancer',
      'api-gateway',
      'rate-limiting',
      'message-queues',
      'batch-stream',
    ],
  },
  {
    id: 'scale-toolkit',
    title: 'Scale toolkit',
    icon: 'Gauge',
    ids: [
      'unique-ids',
      'consistent-hashing',
      'auth',
      'search-feeds',
      'realtime',
      'geospatial',
      'reliability',
      'observability',
      'distributed-locking',
      'consensus',
      'probabilistic',
      'service-discovery',
      'deployments',
    ],
    groups: [
      { title: 'Identity', ids: ['unique-ids', 'consistent-hashing', 'auth'] },
      { title: 'Delivery', ids: ['search-feeds', 'realtime'] },
      { title: 'Place', ids: ['geospatial'] },
      { title: 'Hardening', ids: ['reliability', 'observability', 'distributed-locking'] },
      { title: 'Theory', ids: ['consensus', 'probabilistic'] },
      { title: 'Operate', ids: ['service-discovery', 'deployments'] },
    ],
    newIds: [
      'unique-ids',
      'consistent-hashing',
      'auth',
      'search-feeds',
      'realtime',
      'geospatial',
      'reliability',
      'observability',
      'distributed-locking',
      'consensus',
      'probabilistic',
      'service-discovery',
      'deployments',
    ],
  },
];

const CLASSIC_PROBLEM_SECTIONS: SectionDef[] = [
  {
    id: 'design-systems',
    title: 'Design real systems',
    icon: 'AppWindow',
    ids: [
      'url-shortener',
      'news-feed',
      'linkedin',
      'tinder',
      'airbnb',
      'skyscanner',
      'uber',
      'whatsapp',
      'slack',
      'zoom',
      'youtube',
      'netflix',
      'spotify',
      'gmail',
      'google-search',
      'paytm',
      'zomato',
      'bookmyshow',
      'instagram',
    ],
    groups: [
      { title: 'Warm-up', ids: ['url-shortener'] },
      { title: 'Social graphs', ids: ['news-feed', 'linkedin', 'instagram'] },
      { title: 'Marketplaces', ids: ['tinder', 'airbnb'] },
      { title: 'Mobility', ids: ['skyscanner', 'uber'] },
      { title: 'Realtime comms', ids: ['whatsapp', 'slack', 'zoom'] },
      { title: 'Media', ids: ['youtube', 'netflix', 'spotify'] },
      { title: 'Search and mail', ids: ['google-search', 'gmail'] },
      { title: 'Local commerce', ids: ['paytm', 'zomato', 'bookmyshow'] },
    ],
    newIds: ['tinder', 'slack', 'zoom', 'netflix', 'spotify', 'gmail', 'google-search', 'paytm', 'zomato', 'bookmyshow'],
  },
];

const AI_PROBLEM_SECTIONS: SectionDef[] = [
  {
    id: 'design-ai-systems',
    title: 'Design AI systems',
    icon: 'Sparkles',
    ids: [
      'chatgpt-assistant',
      'enterprise-rag',
      'coding-copilot',
      'recommendation-system',
      'embedding-matching',
      'job-matching',
      'image-gen-platform',
      'voice-agent',
      'multi-agent',
      'llm-gateway',
    ],
    groups: [
      { title: 'Assistants', ids: ['chatgpt-assistant', 'coding-copilot', 'voice-agent'] },
      {
        title: 'Search and matching',
        ids: ['enterprise-rag', 'recommendation-system', 'embedding-matching', 'job-matching'],
      },
      { title: 'Platforms', ids: ['image-gen-platform', 'multi-agent', 'llm-gateway'] },
    ],
    newIds: ['voice-agent', 'llm-gateway'],
  },
];

const COURSE_CATALOG: Course[] = [
  {
    id: 'classic-fundamentals',
    family: 'classic',
    kind: 'fundamentals',
    title: 'Fundamentals',
    familyTitle: 'System Design',
    blurb: 'Primitives you use in a 45-minute interview: data, caches, traffic, and scale.',
    homePath: '/system-design/fundamentals',
    featureKey: 'systemDesign',
  },
  {
    id: 'classic-problems',
    family: 'classic',
    kind: 'problems',
    title: 'Real-world problems',
    familyTitle: 'System Design',
    blurb: 'Product designs — LinkedIn, Tinder, Uber, and other interview staples.',
    homePath: '/system-design/problems',
    featureKey: 'systemDesign',
  },
  {
    id: 'aiml-ml-system-design',
    family: 'ai',
    kind: 'fundamentals',
    title: 'Fundamentals',
    familyTitle: 'AI System Design',
    blurb: 'Production patterns for data, serving, evaluation, safety, and LLM operations.',
    homePath: '/system-design/ai/ml-system-design',
    featureKey: 'aiSystemDesign',
  },
  {
    id: 'ai-problems',
    family: 'ai',
    kind: 'problems',
    title: 'Real-world problems',
    familyTitle: 'AI System Design',
    blurb: 'Assistants, matching, and platforms that still need queues and caches.',
    homePath: '/system-design/ai/problems',
    featureKey: 'aiSystemDesign',
  },
  {
    id: 'aiml-paths',
    family: 'aiml',
    kind: 'paths',
    title: 'Learning Paths',
    familyTitle: 'AI / ML',
    blurb: 'Guided paths through machine learning, deep learning, generative AI, LLMs, and agents.',
    homePath: '/ai-ml/learning-paths',
    featureKey: 'aiMl',
  },
  {
    id: 'aiml-machine-learning',
    family: 'aiml',
    kind: 'algorithms',
    title: 'Machine Learning',
    familyTitle: 'AI / ML',
    blurb: 'Classical ML algorithms — regression, classification, clustering, trees, and ensembles.',
    homePath: '/ai-ml/learning-paths/machine-learning',
    featureKey: 'aiMl',
  },
  {
    id: 'aiml-interviews',
    family: 'aiml',
    kind: 'interviews',
    title: 'Interviews',
    familyTitle: 'AI / ML',
    blurb: 'Question-first drills for ML fundamentals, deep learning, and LLMs.',
    homePath: '/ai-ml/interviews',
    featureKey: 'aiMl',
  },
];

const RESERVED_SEGMENTS = new Set(['fundamentals', 'problems']);

function pickTopics(source: ArchitectureTopic[], ids: string[]): ArchitectureTopic[] {
  const byId = new Map(source.map((topic) => [topic.id, topic]));
  return ids
    .map((id) => byId.get(id))
    .filter((topic): topic is ArchitectureTopic => Boolean(topic));
}

function materialize(defs: SectionDef[], source: ArchitectureTopic[]): CourseOutlineSection[] {
  return defs.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    items: pickTopics(source, section.ids),
    groups: section.groups,
    newIds: section.newIds,
  }));
}

function findTopic(id: string): ArchitectureTopic | undefined {
  return findClassicTopic(id) || findAITopic(id) || findAimlTopic(id);
}

export function getCourseById(id: CourseId): Course {
  const resolved = id === 'ai-fundamentals' ? 'aiml-ml-system-design' : id;
  const course = COURSE_CATALOG.find((item) => item.id === resolved);
  if (!course) {
    throw new Error(`Unknown course: ${id}`);
  }
  return course;
}

export function getCourses(includeDisabled = false): Course[] {
  if (includeDisabled) return COURSE_CATALOG;
  return COURSE_CATALOG.filter((course) => isFeatureEnabled(course.featureKey));
}

export function getCourseFamilies(): Array<{ family: TopicTrack; title: string; courses: Course[] }> {
  const courses = getCourses();
  const classic = courses.filter((course) => course.family === 'classic');
  const ai = courses.filter((course) => course.family === 'ai');
  const aiml = courses.filter((course) => course.family === 'aiml');
  return [
    classic.length ? { family: 'classic' as const, title: 'System Design', courses: classic } : null,
    ai.length ? { family: 'ai' as const, title: 'AI System Design', courses: ai } : null,
    aiml.length ? { family: 'aiml' as const, title: 'AI / ML', courses: aiml } : null,
  ].filter((group): group is { family: TopicTrack; title: string; courses: Course[] } => Boolean(group));
}

export function getCourseForTopic(topic: ArchitectureTopic): Course {
  if (topic.track === 'aiml') {
    if (topic.id.startsWith('aiml-mlsd-')) return getCourseById('aiml-ml-system-design');
    if (topic.id.startsWith('aiml-iv-')) return getCourseById('aiml-interviews');
    if (topic.id.startsWith('aiml-path-')) return getCourseById('aiml-paths');
    return getCourseById('aiml-machine-learning');
  }
  if (topic.track === 'ai' && topic.section === 'fundamentals') {
    return getCourseById('aiml-ml-system-design');
  }
  const sectionToKind: Record<TopicSection, CourseKind> = {
    fundamentals: 'fundamentals',
    products: 'problems',
    paths: 'paths',
    mlsd: 'mlsd',
    interviews: 'interviews',
  };
  const id = `${topic.track}-${sectionToKind[topic.section]}` as CourseId;
  return getCourseById(id);
}

export function getSiblingCourse(course: Course): Course | undefined {
  if (course.family === 'aiml') {
    const next: Partial<Record<CourseId, CourseId>> = {
      'aiml-paths': 'aiml-machine-learning',
      'aiml-machine-learning': 'aiml-interviews',
      'aiml-interviews': 'aiml-paths',
    };
    const siblingId = next[course.id];
    if (!siblingId) return undefined;
    const sibling = getCourseById(siblingId);
    return isFeatureEnabled(sibling.featureKey) ? sibling : undefined;
  }
  if (course.family === 'ai') {
    const next: Partial<Record<CourseId, CourseId>> = {
      'aiml-ml-system-design': 'ai-problems',
      'ai-problems': 'aiml-ml-system-design',
    };
    const siblingId = next[course.id];
    if (!siblingId) return undefined;
    const sibling = getCourseById(siblingId);
    return isFeatureEnabled(sibling.featureKey) ? sibling : undefined;
  }
  const siblingId = (
    course.kind === 'fundamentals' ? `${course.family}-problems` : `${course.family}-fundamentals`
  ) as CourseId;
  const sibling = getCourseById(siblingId);
  return isFeatureEnabled(sibling.featureKey) ? sibling : undefined;
}

function asSectionDefs(
  defs: readonly {
    id: string;
    title: string;
    icon: string;
    ids: readonly string[];
    groups?: readonly { title: string; ids: readonly string[] }[];
  }[]
): SectionDef[] {
  return defs.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon as OutlineSectionIcon,
    ids: [...section.ids],
    groups: section.groups?.map((group) => ({ title: group.title, ids: [...group.ids] })),
  }));
}

export function getOutlineForCourse(courseId: CourseId): CourseOutlineSection[] {
  switch (courseId) {
    case 'classic-fundamentals':
      return materialize(CLASSIC_FUNDAMENTAL_SECTIONS, getClassicTopics());
    case 'classic-problems':
      return materialize(CLASSIC_PROBLEM_SECTIONS, getClassicTopics());
    case 'ai-fundamentals':
      return materialize(asSectionDefs(aimlOutlineDefs.mlSystemDesign), aimlSystemDesignTopics);
    case 'ai-problems':
      return materialize(AI_PROBLEM_SECTIONS, getAIProducts());
    case 'aiml-paths':
      return materialize(asSectionDefs(aimlOutlineDefs.paths), aimlPathOverviewTopics);
    case 'aiml-machine-learning':
      return materialize(asSectionDefs(aimlOutlineDefs.machineLearning), aimlMachineLearningTopics);
    case 'aiml-ml-system-design':
      return materialize(asSectionDefs(aimlOutlineDefs.mlSystemDesign), aimlSystemDesignTopics);
    case 'aiml-interviews':
      return materialize(asSectionDefs(aimlOutlineDefs.interviews), aimlInterviewTopics);
  }
}

export function clusterSectionItems(section: CourseOutlineSection): OutlineItemCluster[] {
  if (!section.groups?.length) {
    return [{ items: section.items }];
  }

  const byId = new Map(section.items.map((item) => [item.id, item]));
  const used = new Set<string>();
  const clusters: OutlineItemCluster[] = [];

  for (const group of section.groups) {
    const items = group.ids
      .map((id) => byId.get(id))
      .filter((item): item is ArchitectureTopic => Boolean(item));
    items.forEach((item) => used.add(item.id));
    if (items.length) clusters.push({ title: group.title, items });
  }

  const leftover = section.items.filter((item) => !used.has(item.id));
  if (leftover.length) clusters.unshift({ items: leftover });
  return clusters;
}

export function flattenOutline(
  sections: CourseOutlineSection[],
  options: { includeExternal?: boolean } = {}
): ArchitectureTopic[] {
  const includeExternal = options.includeExternal ?? true;
  return sections
    .filter((section) => includeExternal || !section.external)
    .flatMap((section) => section.items);
}

export function getCourseHomePath(course: Course | CourseId): string {
  return typeof course === 'string' ? getCourseById(course).homePath : course.homePath;
}

export function parseCoursePath(pathname: string): CoursePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'ai-ml') {
    if (!parts[1] || parts[1] === 'learning-paths') {
      if (!parts[2]) return { course: getCourseById('aiml-paths') };
      if (parts[2] === 'machine-learning') {
        return {
          course: getCourseById('aiml-machine-learning'),
          topicId: parts[3] ? `aiml-ml-${parts[3]}` : undefined,
        };
      }
      return { course: getCourseById('aiml-paths'), topicId: `aiml-path-${parts[2]}` };
    }
    if (parts[1] === 'interviews') {
      return {
        course: getCourseById('aiml-interviews'),
        topicId: parts[2] ? `aiml-iv-${parts[2]}` : undefined,
      };
    }
    return { course: getCourseById('aiml-paths') };
  }

  if (parts[0] !== 'system-design') {
    return { course: getCourseById('classic-fundamentals') };
  }

  if (parts[1] === 'ai') {
    const rest = parts[2];
    if (!rest || rest === 'fundamentals') {
      return { course: getCourseById('aiml-ml-system-design') };
    }
    if (rest === 'problems') {
      return { course: getCourseById('ai-problems') };
    }
    if (rest === 'ml-system-design') {
      return {
        course: getCourseById('aiml-ml-system-design'),
        topicId: parts[3] ? `aiml-mlsd-${parts[3]}` : undefined,
      };
    }
    const topic = findTopic(rest);
    return {
      course: topic ? getCourseForTopic(topic) : getCourseById('aiml-ml-system-design'),
      topicId: rest,
    };
  }

  const rest = parts[1];
  if (!rest || rest === 'fundamentals') {
    return { course: getCourseById('classic-fundamentals') };
  }
  if (rest === 'problems') {
    return { course: getCourseById('classic-problems') };
  }
  if (RESERVED_SEGMENTS.has(rest)) {
    return { course: getCourseById('classic-fundamentals') };
  }
  const topic = findTopic(rest);
  return {
    course: topic ? getCourseForTopic(topic) : getCourseById('classic-fundamentals'),
    topicId: rest,
  };
}

export function getOutlineNeighbors(topicId: string): {
  prev?: ArchitectureTopic;
  next?: ArchitectureTopic;
} {
  const topic = findTopic(topicId);
  if (!topic) return {};
  const course = getCourseForTopic(topic);
  const flat = flattenOutline(getOutlineForCourse(course.id), { includeExternal: false });
  const index = flat.findIndex((item) => item.id === topicId);
  if (index < 0) return {};
  return {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}

export function findSectionForTopic(
  sections: CourseOutlineSection[],
  topicId?: string
): string | undefined {
  if (!topicId) return sections[0]?.id;
  return sections.find((section) => section.items.some((item) => item.id === topicId))?.id;
}

export function getCourseProgress(
  courseId: CourseId,
  isComplete: (id: string) => boolean
): { completed: number; total: number; percent: number } {
  const items = flattenOutline(getOutlineForCourse(courseId), { includeExternal: false });
  const total = items.length;
  const completed = items.filter((item) => isComplete(item.id)).length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getFirstIncompleteLesson(
  courseId: CourseId,
  isComplete: (id: string) => boolean
): ArchitectureTopic | undefined {
  const items = flattenOutline(getOutlineForCourse(courseId), { includeExternal: false });
  return items.find((item) => !isComplete(item.id)) ?? items[0];
}
