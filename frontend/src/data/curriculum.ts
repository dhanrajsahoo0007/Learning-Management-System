import { architectureTopics, findClassicTopic } from './systemDesignData';
import { aiSystemDesignTopics, findAITopic } from './aiSystemDesignData';
import { aimlTopics, findAimlTopic } from './aiml';
import { getCourseForTopic, getCourseHomePath } from './courseOutline';
import type { ArchitectureTopic } from './systemDesignTypes';

export function findTopicById(id: string): ArchitectureTopic | undefined {
  return findClassicTopic(id) || findAITopic(id) || findAimlTopic(id);
}

export function getAllTopics(): ArchitectureTopic[] {
  return [...architectureTopics, ...aiSystemDesignTopics, ...aimlTopics];
}

export function getTopicPath(topic: ArchitectureTopic): string {
  if (topic.track === 'aiml') {
    if (topic.id.startsWith('aiml-ml-')) {
      return `/ai-ml/learning-paths/machine-learning/${topic.id.slice('aiml-ml-'.length)}`;
    }
    if (topic.id.startsWith('aiml-mlsd-')) {
      return `/system-design/ai/ml-system-design/${topic.id.slice('aiml-mlsd-'.length)}`;
    }
    if (topic.id.startsWith('aiml-iv-')) {
      return `/ai-ml/interviews/${topic.id.slice('aiml-iv-'.length)}`;
    }
    if (topic.id.startsWith('aiml-path-')) {
      return `/ai-ml/learning-paths/${topic.id.slice('aiml-path-'.length)}`;
    }
  }
  return topic.track === 'ai' ? `/system-design/ai/${topic.id}` : `/system-design/${topic.id}`;
}

export function getBackPath(topic: ArchitectureTopic): string {
  return getCourseHomePath(getCourseForTopic(topic));
}
