import { getAIFundamentals, getAIPrerequisiteTopics, getAIProducts } from './aiSystemDesignData';
import { getClassicTopics } from './systemDesignData';
import type { ArchitectureTopic, TopicTrack } from './systemDesignTypes';

export type OutlineSectionIcon =
  | 'Compass'
  | 'Layers'
  | 'Gauge'
  | 'AppWindow'
  | 'BookOpen'
  | 'Cpu'
  | 'Sparkles';

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

export type CoursePath = {
  track: TopicTrack;
  topicId?: string;
};

const CLASSIC_SECTIONS: Array<{
  id: string;
  title: string;
  icon: OutlineSectionIcon;
  ids: string[];
  groups?: OutlineGroup[];
  newIds?: string[];
}> = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'Compass',
    ids: ['interview-approach'],
  },
  {
    id: 'building-blocks',
    title: 'Building blocks',
    icon: 'Layers',
    ids: ['databases', 'caching', 'load-balancer', 'cdn', 'api-gateway', 'message-queues'],
    groups: [
      { title: 'Data', ids: ['databases'] },
      { title: 'Speed', ids: ['caching', 'cdn'] },
      { title: 'Traffic', ids: ['load-balancer', 'api-gateway'] },
      { title: 'Async work', ids: ['message-queues'] },
    ],
  },
  {
    id: 'scale-toolkit',
    title: 'Scale toolkit',
    icon: 'Gauge',
    ids: ['unique-ids', 'search-feeds', 'realtime', 'reliability', 'storage-media'],
    groups: [
      { title: 'Identity', ids: ['unique-ids'] },
      { title: 'Delivery', ids: ['search-feeds', 'realtime'] },
      { title: 'Hardening', ids: ['reliability', 'storage-media'] },
    ],
  },
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
      'youtube',
      'instagram',
    ],
    groups: [
      { title: 'Warm-up', ids: ['url-shortener'] },
      { title: 'Social graphs', ids: ['news-feed', 'linkedin', 'instagram'] },
      { title: 'Marketplaces', ids: ['tinder', 'airbnb'] },
      { title: 'Mobility', ids: ['skyscanner', 'uber'] },
      { title: 'Realtime media', ids: ['whatsapp', 'youtube'] },
    ],
    newIds: ['skyscanner'],
  },
];

const AI_BLOCK_IDS = [
  'llm-serving',
  'prompting',
  'embeddings',
  'rag',
  'fine-tune-vs-rag',
  'inference-infra',
  'ai-caching',
  'eval-quality',
  'ai-safety',
  'ai-cost',
];

const AI_PRODUCT_IDS = [
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
];

function pickTopics(source: ArchitectureTopic[], ids: string[]): ArchitectureTopic[] {
  const byId = new Map(source.map((topic) => [topic.id, topic]));
  return ids
    .map((id) => byId.get(id))
    .filter((topic): topic is ArchitectureTopic => Boolean(topic));
}

export function getClassicOutline(): CourseOutlineSection[] {
  const topics = getClassicTopics();
  return CLASSIC_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    items: pickTopics(topics, section.ids),
    groups: section.groups,
    newIds: section.newIds,
  }));
}

export function getAIOutline(): CourseOutlineSection[] {
  return [
    {
      id: 'classic-prereqs',
      title: 'Classic prerequisites',
      icon: 'BookOpen',
      items: getAIPrerequisiteTopics(),
      external: true,
    },
    {
      id: 'ai-building-blocks',
      title: 'AI building blocks',
      icon: 'Cpu',
      items: pickTopics(getAIFundamentals(), AI_BLOCK_IDS),
      groups: [
        { title: 'Serving', ids: ['llm-serving', 'prompting', 'inference-infra'] },
        { title: 'Retrieval', ids: ['embeddings', 'rag', 'fine-tune-vs-rag'] },
        { title: 'Operations', ids: ['ai-caching', 'eval-quality', 'ai-safety', 'ai-cost'] },
      ],
    },
    {
      id: 'design-ai-systems',
      title: 'Design AI systems',
      icon: 'Sparkles',
      items: pickTopics(getAIProducts(), AI_PRODUCT_IDS),
      groups: [
        { title: 'Assistants', ids: ['chatgpt-assistant', 'coding-copilot', 'voice-agent'] },
        { title: 'Search and matching', ids: ['enterprise-rag', 'recommendation-system', 'embedding-matching', 'job-matching'] },
        { title: 'Platforms', ids: ['image-gen-platform', 'multi-agent', 'llm-gateway'] },
      ],
      newIds: ['voice-agent', 'llm-gateway'],
    },
  ];
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

export function getOutlineForTrack(track: TopicTrack): CourseOutlineSection[] {
  return track === 'ai' ? getAIOutline() : getClassicOutline();
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

export function getCourseTitle(track: TopicTrack): string {
  return track === 'ai' ? 'AI System Design' : 'System Design';
}

export function getCourseHomePath(track: TopicTrack): string {
  return track === 'ai' ? '/system-design/ai' : '/system-design';
}

export function parseCoursePath(pathname: string): CoursePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/system-design') {
    return { track: 'classic' };
  }
  if (clean === '/system-design/ai') {
    return { track: 'ai' };
  }
  if (clean.startsWith('/system-design/ai/')) {
    return { track: 'ai', topicId: clean.slice('/system-design/ai/'.length).split('/')[0] };
  }
  if (clean.startsWith('/system-design/')) {
    return { track: 'classic', topicId: clean.slice('/system-design/'.length).split('/')[0] };
  }
  return { track: 'classic' };
}

export function getOutlineNeighbors(
  topicId: string,
  track: TopicTrack
): { prev?: ArchitectureTopic; next?: ArchitectureTopic } {
  const flat = flattenOutline(getOutlineForTrack(track), { includeExternal: false });
  const index = flat.findIndex((topic) => topic.id === topicId);
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
