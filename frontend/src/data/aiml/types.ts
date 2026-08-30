export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'math'; tex: string }
  | { type: 'qa'; question: string; category?: string; answer: string };

export interface ArticleContent {
  blocks: ContentBlock[];
  questionCategories: string[];
}

export interface HubCard {
  title: string;
  icon: string;
  description: string;
  href: string;
  topicId: string;
}

export interface HubCategory {
  title: string;
  icon: string;
  subtitle?: string;
  cards: HubCard[];
}

export interface HubGroup {
  name: string;
  icon?: string;
  categories: string[];
}

export interface HubPage {
  id: string;
  title: string;
  description: string;
  icon?: string;
  categories: HubCategory[];
  groups?: HubGroup[];
}

export function toArticle(blocks: ContentBlock[]): ArticleContent {
  const questionCategories = [
    ...new Set(
      blocks
        .filter((block): block is Extract<ContentBlock, { type: 'qa' }> => block.type === 'qa')
        .map((block) => block.category)
        .filter((category): category is string => Boolean(category))
    ),
  ];
  return { blocks, questionCategories };
}
