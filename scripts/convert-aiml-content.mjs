import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'ai-ml');
const OUT_DIR = path.join(ROOT, 'frontend', 'src', 'data', 'aiml');
const LUCIDE_DTS = path.join(ROOT, 'frontend', 'node_modules', 'lucide-react', 'dist', 'lucide-react.d.ts');

const EXPECTED = {
  total: 96,
  leafTopics: 87,
  modelCards: 87,
  interviewQuestions: 255,
  detailsBlocks: 6,
};

const COLORS = [
  'bg-violet-600',
  'bg-indigo-600',
  'bg-blue-600',
  'bg-cyan-600',
  'bg-teal-600',
  'bg-emerald-600',
  'bg-lime-600',
  'bg-amber-600',
  'bg-orange-600',
  'bg-rose-600',
];

const KNOWN_COMPONENTS = new Set([
  'ModelCategory',
  'ModelGrid',
  'ModelCard',
  'InterviewQuestions',
  'InterviewQuestion',
]);

const ALLOWED_HTML = new Set(['details', 'summary', 'div']);

const ICON_FALLBACKS = {
  flask: 'FlaskConical',
  'book-template': 'BookTemplate',
  palmtree: 'Palmtree',
  'test-tube': 'TestTube2',
  minimize: 'Minimize2',
  'bar-chart': 'BarChart3',
  'git-commit': 'GitCommitHorizontal',
  trees: 'Trees',
};

function kebabToPascal(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function unquote(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatterYaml(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const data = {};
  let i = 0;

  function parseList(minIndent) {
    const items = [];
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        continue;
      }
      const match = line.match(/^(\s*)-\s+(.*)$/);
      if (!match || match[1].length < minIndent) break;
      const rest = match[2];
      const objectKey = rest.match(/^(\w+):\s*(.*)$/);
      if (objectKey && !rest.startsWith('"')) {
        const obj = {};
        if (objectKey[2] !== '') obj[objectKey[1]] = unquote(objectKey[2]);
        i += 1;
        while (i < lines.length) {
          const nested = lines[i].match(/^(\s+)(\w+):\s*(.*)$/);
          if (!nested || nested[1].length <= match[1].length) break;
          if (nested[3] === '') {
            i += 1;
            obj[nested[2]] = parseList(nested[1].length);
          } else {
            obj[nested[2]] = unquote(nested[3]);
            i += 1;
          }
        }
        items.push(obj);
      } else {
        items.push(unquote(rest));
        i += 1;
      }
    }
    return items;
  }

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) {
      i += 1;
      continue;
    }
    if (kv[2] === '') {
      i += 1;
      data[kv[1]] = parseList(0);
    } else {
      data[kv[1]] = unquote(kv[2]);
      i += 1;
    }
  }
  return data;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return { data: {}, body: raw };
  const yaml = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\s*\n/, '');
  return { data: parseFrontmatterYaml(yaml), body };
}

function walkMdx(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMdx(full, acc);
    else if (entry.name.endsWith('.mdx')) acc.push(full);
  }
  return acc;
}

function relativeSlug(filePath) {
  return path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx$/, '');
}

function classify(rel) {
  if (rel.startsWith('learning-paths/machine-learning/')) {
    return { kind: 'ml-leaf', slug: rel.slice('learning-paths/machine-learning/'.length) };
  }
  if (rel === 'learning-paths/machine-learning') {
    return { kind: 'ml-hub', slug: 'machine-learning' };
  }
  if (rel.startsWith('learning-paths/')) {
    return { kind: 'path-hub', slug: rel.slice('learning-paths/'.length) };
  }
  if (rel.startsWith('system-design/ml-system-design/')) {
    return { kind: 'mlsd-leaf', slug: rel.slice('system-design/ml-system-design/'.length) };
  }
  if (rel === 'system-design/ml-system-design') {
    return { kind: 'mlsd-hub', slug: 'ml-system-design' };
  }
  if (rel.startsWith('interviews/')) {
    return { kind: 'interview', slug: rel.slice('interviews/'.length) };
  }
  throw new Error(`Unclassified content file: ${rel}`);
}

function topicIdFor(kind, slug) {
  if (kind === 'ml-leaf') return `aiml-ml-${slug}`;
  if (kind === 'mlsd-leaf') return `aiml-mlsd-${slug}`;
  if (kind === 'path-hub' || kind === 'ml-hub') return `aiml-path-${slug}`;
  if (kind === 'interview') return `aiml-iv-${slug}`;
  if (kind === 'mlsd-hub') return `aiml-path-ml-system-design`;
  throw new Error(`No topic id for ${kind}/${slug}`);
}

function rewriteHref(href) {
  if (href.startsWith('/learning-paths/')) return `/ai-ml${href}`;
  if (href.startsWith('/system-design/ml-system-design')) {
    return href.replace('/system-design/ml-system-design', '/system-design/ai/ml-system-design');
  }
  if (href.startsWith('/interviews/')) return `/ai-ml${href}`;
  return href;
}

function topicIdFromHref(href) {
  const rewritten = rewriteHref(href);
  const ml = rewritten.match(/^\/ai-ml\/learning-paths\/machine-learning\/([^/]+)$/);
  if (ml) return `aiml-ml-${ml[1]}`;
  const mlsd = rewritten.match(/^\/system-design\/ai\/ml-system-design\/([^/]+)$/);
  if (mlsd) return `aiml-mlsd-${mlsd[1]}`;
  const pathPage = rewritten.match(/^\/ai-ml\/learning-paths\/([^/]+)$/);
  if (pathPage) return `aiml-path-${pathPage[1]}`;
  const interview = rewritten.match(/^\/ai-ml\/interviews\/([^/]+)$/);
  if (interview) return `aiml-iv-${interview[1]}`;
  throw new Error(`Cannot map href to topic id: ${href}`);
}

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)')`));
  return match ? match[1] ?? match[2] : undefined;
}

function parseHubs(body) {
  const categories = [];
  const categoryRe = /<ModelCategory\b([^>]*)>([\s\S]*?)<\/ModelCategory>/g;
  let categoryMatch;
  while ((categoryMatch = categoryRe.exec(body))) {
    const attrs = categoryMatch[1];
    const inner = categoryMatch[2];
    const cards = [];
    const cardRe = /<ModelCard\b([^>]*)\/>/g;
    let cardMatch;
    while ((cardMatch = cardRe.exec(inner))) {
      const href = extractAttr(cardMatch[1], 'href');
      cards.push({
        title: extractAttr(cardMatch[1], 'title'),
        icon: extractAttr(cardMatch[1], 'icon'),
        description: extractAttr(cardMatch[1], 'description'),
        href: rewriteHref(href),
        topicId: topicIdFromHref(href),
      });
    }
    categories.push({
      title: extractAttr(attrs, 'title'),
      icon: extractAttr(attrs, 'icon'),
      subtitle: extractAttr(attrs, 'subtitle'),
      cards,
    });
  }
  return categories;
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBody(body) {
  const blocks = [];
  const stats = { interviewQuestions: 0, detailsBlocks: 0, unknownTags: [] };
  const specials = [];
  const patterns = [
    { type: 'interview', re: /<InterviewQuestions>([\s\S]*?)<\/InterviewQuestions>/g },
    { type: 'details', re: /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>\s*<div\b[^>]*>([\s\S]*?)<\/div>\s*<\/details>/g },
    { type: 'math', re: /\$\$([\s\S]*?)\$\$/g },
    { type: 'hub', re: /<ModelCategory\b[\s\S]*?<\/ModelCategory>/g },
  ];

  for (const { type, re } of patterns) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(body))) {
      specials.push({ type, start: match.index, end: match.index + match[0].length, match });
    }
  }
  specials.sort((a, b) => a.start - b.start);

  const tagRe = /<\/?([A-Za-z][\w.-]*)\b[^>]*\/?>/g;
  let tagMatch;
  while ((tagMatch = tagRe.exec(body))) {
    const name = tagMatch[1];
    if (KNOWN_COMPONENTS.has(name) || ALLOWED_HTML.has(name)) continue;
    if (name[0] === name[0].toUpperCase()) stats.unknownTags.push(name);
  }

  let cursor = 0;
  const pushMarkdown = (text) => {
    const cleaned = text
      .replace(/<\/?(?:details|summary|div|ModelGrid|ModelCard)\b[^>]*\/?>/g, '\n');
    if (cleaned.trim()) parseMarkdownChunk(cleaned, blocks);
  };

  for (const special of specials) {
    if (special.start < cursor) continue;
    pushMarkdown(body.slice(cursor, special.start));
    if (special.type === 'interview') {
      const qaRe = /<InterviewQuestion\b([^>]*)>([\s\S]*?)<\/InterviewQuestion>/g;
      let qaMatch;
      while ((qaMatch = qaRe.exec(special.match[1]))) {
        stats.interviewQuestions += 1;
        blocks.push({
          type: 'qa',
          question: extractAttr(qaMatch[1], 'question'),
          category: extractAttr(qaMatch[1], 'category'),
          answer: stripHtml(qaMatch[2]),
        });
      }
    } else if (special.type === 'details') {
      stats.detailsBlocks += 1;
      blocks.push({
        type: 'qa',
        question: stripHtml(special.match[1]),
        answer: stripHtml(special.match[2]),
      });
    } else if (special.type === 'math') {
      blocks.push({ type: 'math', tex: special.match[1].trim() });
    }
    cursor = special.end;
  }
  pushMarkdown(body.slice(cursor));

  return { blocks, stats };
}

function parseMarkdownChunk(chunk, blocks) {
  const lines = chunk.replace(/\r\n/g, '\n').split('\n');
  let paragraph = [];
  let listItems = [];
  let listOrdered = false;

  function flushParagraph() {
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    paragraph = [];
    if (text) blocks.push({ type: 'paragraph', text });
  }

  function flushList() {
    if (listItems.length) {
      blocks.push({ type: 'list', ordered: listOrdered, items: listItems });
      listItems = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      continue;
    }
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listItems.length && listOrdered) flushList();
      listOrdered = false;
      listItems.push(unordered[1]);
      continue;
    }
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listItems.length && !listOrdered) flushList();
      listOrdered = true;
      listItems.push(ordered[1]);
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9']+/g) || []).length;
}

function blockText(block) {
  if (block.type === 'paragraph' || block.type === 'heading') return block.text;
  if (block.type === 'math') return block.tex;
  if (block.type === 'list') return block.items.join(' ');
  if (block.type === 'qa') return `${block.question} ${block.answer}`;
  return '';
}

function loadLucideExports() {
  if (!fs.existsSync(LUCIDE_DTS)) {
    throw new Error(`lucide-react types not found at ${LUCIDE_DTS}`);
  }
  const source = fs.readFileSync(LUCIDE_DTS, 'utf8');
  const names = new Set();
  const declareRe = /declare const ([A-Z][A-Za-z0-9]+):/g;
  let match;
  while ((match = declareRe.exec(source))) names.add(match[1]);
  const exportRe = /export \{([\s\S]*?)\}/g;
  while ((match = exportRe.exec(source))) {
      for (const name of match[1].split(',')) {
      for (const part of name.trim().split(/\s+as\s+/)) {
        const ident = part.trim();
        if (/^[A-Z][A-Za-z0-9]+$/.test(ident)) names.add(ident);
      }
    }
  }
  return names;
}

function resolveIcon(name, lucideExports, used, fallbacks) {
  if (!name) return 'BookOpen';
  const mapped = ICON_FALLBACKS[name] || kebabToPascal(name);
  if (lucideExports.has(mapped)) {
    used.set(name, mapped);
    return mapped;
  }
  const fallback = 'BookOpen';
  fallbacks.push({ name, tried: mapped, fallback });
  used.set(name, fallback);
  return fallback;
}

function jsString(value) {
  return JSON.stringify(value);
}

function emitBlocks(blocks, indent) {
  const pad = ' '.repeat(indent);
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') {
        return `${pad}{ type: 'paragraph', text: ${jsString(block.text)} }`;
      }
      if (block.type === 'heading') {
        return `${pad}{ type: 'heading', level: ${block.level}, text: ${jsString(block.text)} }`;
      }
      if (block.type === 'math') {
        return `${pad}{ type: 'math', tex: ${jsString(block.tex)} }`;
      }
      if (block.type === 'list') {
        return `${pad}{ type: 'list', ordered: ${block.ordered}, items: ${jsString(block.items)} }`;
      }
      if (!block.question) {
        throw new Error(`QA block missing question: ${jsString(block.answer).slice(0, 80)}`);
      }
      const category = block.category ? `, category: ${jsString(block.category)}` : '';
      return `${pad}{ type: 'qa', question: ${jsString(block.question)}${category}, answer: ${jsString(block.answer)} }`;
    })
    .join(',\n');
}

function emitTopic(topic, indent = 2) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 2);
  const article = topic.article
    ? `,\n${inner}article: toArticle([\n${emitBlocks(topic.article.blocks, indent + 4)}\n${inner}])`
    : '';
  return `${pad}{
${inner}id: ${jsString(topic.id)},
${inner}title: ${jsString(topic.title)},
${inner}description: ${jsString(topic.description)},
${inner}difficulty: ${jsString(topic.difficulty)},
${inner}progress: 0,
${inner}icon: ${jsString(topic.icon)},
${inner}color: ${jsString(topic.color)},
${inner}section: ${jsString(topic.section)},
${inner}track: 'aiml',
${inner}prerequisites: [],
${inner}estimatedMinutes: ${topic.estimatedMinutes},
${inner}order: ${topic.order},
${inner}content: emptyContent({ overview: ${jsString(topic.description)} })${article},
${pad}}`;
}

function emitHub(hub, indent = 2) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 2);
  return `${pad}${jsString(hub.id)}: ${JSON.stringify(hub, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : pad + line))
    .join('\n')}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function iconToSection(iconName) {
  const map = {
    'trending-up': 'TrendingUp',
    'folder-tree': 'FolderTree',
    'circle-dot': 'CircleDot',
    'tree-pine': 'TreePine',
    minimize: 'Minimize2',
    combine: 'Combine',
    server: 'Server',
    database: 'Database',
    'message-circle': 'MessageCircle',
    brain: 'Brain',
    activity: 'Activity',
    'test-tube': 'FlaskConical',
    settings: 'Settings',
    shield: 'Shield',
    cloud: 'Cloud',
    'refresh-cw': 'RefreshCw',
    presentation: 'Presentation',
    'book-open': 'BookOpen',
    cpu: 'Cpu',
    bot: 'Bot',
    sparkles: 'Sparkles',
    compass: 'Compass',
    layers: 'Layers',
  };
  return map[iconName] || 'BookOpen';
}

function main() {
  const files = walkMdx(CONTENT_DIR);
  if (files.length !== EXPECTED.total) {
    throw new Error(`Expected ${EXPECTED.total} MDX files, found ${files.length}`);
  }

  const lucideExports = loadLucideExports();
  const iconUsed = new Map();
  const iconFallbacks = [];

  const parsed = files.map((filePath) => {
    const rel = relativeSlug(filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, body } = splitFrontmatter(raw);
    const info = classify(rel);
    const { blocks, stats } = parseBody(body);
    const categories = parseHubs(body);
    return { filePath, rel, data, body, info, blocks, stats, categories };
  });

  const interviewQuestions = parsed.reduce((sum, item) => sum + item.stats.interviewQuestions, 0);
  const detailsBlocks = parsed.reduce((sum, item) => sum + item.stats.detailsBlocks, 0);
  const unknownTags = [...new Set(parsed.flatMap((item) => item.stats.unknownTags))];
  const modelCards = parsed.flatMap((item) => item.categories.flatMap((category) => category.cards));

  if (unknownTags.length) {
    throw new Error(`Unknown MDX tags: ${unknownTags.join(', ')}`);
  }
  if (interviewQuestions !== EXPECTED.interviewQuestions) {
    throw new Error(`Expected ${EXPECTED.interviewQuestions} InterviewQuestion tags, found ${interviewQuestions}`);
  }
  if (detailsBlocks !== EXPECTED.detailsBlocks) {
    throw new Error(`Expected ${EXPECTED.detailsBlocks} details blocks, found ${detailsBlocks}`);
  }
  if (modelCards.length !== EXPECTED.modelCards) {
    throw new Error(`Expected ${EXPECTED.modelCards} ModelCards, found ${modelCards.length}`);
  }

  const cardByTopicId = new Map();
  for (const card of modelCards) {
    if (cardByTopicId.has(card.topicId)) {
      throw new Error(`Duplicate ModelCard topic id: ${card.topicId}`);
    }
    cardByTopicId.set(card.topicId, card);
  }

  const leafKinds = new Set(['ml-leaf', 'mlsd-leaf']);
  const leaves = parsed.filter((item) => leafKinds.has(item.info.kind));
  if (leaves.length !== EXPECTED.leafTopics) {
    throw new Error(`Expected ${EXPECTED.leafTopics} leaf topics, found ${leaves.length}`);
  }

  for (const leaf of leaves) {
    const id = topicIdFor(leaf.info.kind, leaf.info.slug);
    if (!cardByTopicId.has(id)) {
      throw new Error(`Leaf ${leaf.rel} has no matching ModelCard (${id})`);
    }
  }
  for (const [id] of cardByTopicId) {
    if (!leaves.some((leaf) => topicIdFor(leaf.info.kind, leaf.info.slug) === id)) {
      throw new Error(`ModelCard ${id} has no matching leaf file`);
    }
  }

  const mlOrder = [];
  const mlsdOrder = [];
  for (const item of parsed) {
    if (item.info.kind === 'ml-hub' || item.info.kind === 'mlsd-hub') {
      for (const category of item.categories) {
        for (const card of category.cards) {
          const target = item.info.kind === 'ml-hub' ? mlOrder : mlsdOrder;
          target.push(card.topicId);
        }
      }
    }
  }

  function buildTopic(item, section, orderList) {
    const id = topicIdFor(item.info.kind, item.info.slug);
    const card = cardByTopicId.get(id);
    const title = card?.title || item.data.title || item.info.slug;
    const description = card?.description || item.data.description || '';
    const iconName = card?.icon || item.data.icon || 'book-open';
    const icon = resolveIcon(iconName, lucideExports, iconUsed, iconFallbacks);
    const order = orderList ? Math.max(0, orderList.indexOf(id)) : 0;
    const words = item.blocks.reduce((sum, block) => sum + wordCount(blockText(block)), 0);
    return {
      id,
      title,
      description,
      difficulty: 'Intermediate',
      icon,
      iconName,
      color: COLORS[order % COLORS.length],
      section,
      estimatedMinutes: Math.max(8, Math.round(words / 200) || 8),
      order,
      article: { blocks: item.blocks },
      sourceRel: item.rel,
      wordCount: words,
    };
  }

  const mlTopics = parsed
    .filter((item) => item.info.kind === 'ml-leaf')
    .map((item) => buildTopic(item, 'paths', mlOrder))
    .sort((a, b) => a.order - b.order);

  const mlsdTopics = parsed
    .filter((item) => item.info.kind === 'mlsd-leaf')
    .map((item) => buildTopic(item, 'mlsd', mlsdOrder))
    .sort((a, b) => a.order - b.order);

  const interviews = parsed
    .filter((item) => item.info.kind === 'interview')
    .map((item, index) => buildTopic(item, 'interviews', null))
    .map((topic, index) => ({ ...topic, order: index }));

  const pathOverviews = parsed
    .filter((item) => item.info.kind === 'path-hub' || item.info.kind === 'ml-hub')
    .map((item, index) => {
      const topic = buildTopic(item, 'paths', null);
      return { ...topic, order: index, hubId: item.info.slug };
    });

  const hubs = {};
  for (const item of parsed) {
    if (!['ml-hub', 'mlsd-hub'].includes(item.info.kind)) continue;
    hubs[item.info.slug] = {
      id: topicIdFor(item.info.kind, item.info.slug),
      title: item.data.title,
      description: item.data.description,
      icon: item.data.icon,
      categories: item.categories,
      groups: item.data.groups,
    };
  }

  if (iconFallbacks.length) {
    console.warn('Icon fallbacks:');
    for (const item of iconFallbacks) {
      console.warn(`  ${item.name} -> ${item.tried} missing, using ${item.fallback}`);
    }
  }

  const coverage = parsed.map((item) => {
    const sourceWords = wordCount(item.body.replace(/<[^>]+>/g, ' '));
    const generatedWords = item.blocks.reduce((sum, block) => sum + wordCount(blockText(block)), 0);
    return {
      file: item.rel,
      sourceWords,
      generatedWords,
      delta: generatedWords - sourceWords,
      blocks: item.blocks.length,
    };
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const header = `import { emptyContent, type ArchitectureTopic } from '../systemDesignTypes';
import { toArticle } from './types';

`;

  fs.writeFileSync(
    path.join(OUT_DIR, 'aimlMachineLearning.ts'),
    `${header}export const aimlMachineLearningTopics: ArchitectureTopic[] = [\n${mlTopics.map((topic) => emitTopic(topic)).join(',\n')}\n];\n`
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'aimlSystemDesign.ts'),
    `${header}export const aimlSystemDesignTopics: ArchitectureTopic[] = [\n${mlsdTopics.map((topic) => emitTopic(topic)).join(',\n')}\n];\n`
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'aimlInterviews.ts'),
    `${header}export const aimlInterviewTopics: ArchitectureTopic[] = [\n${interviews.map((topic) => emitTopic(topic)).join(',\n')}\n];\n`
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'aimlPathOverviews.ts'),
    `${header}export const aimlPathOverviewTopics: ArchitectureTopic[] = [\n${pathOverviews.map((topic) => emitTopic(topic)).join(',\n')}\n];\n`
  );

  const outline = {
    machineLearning: hubs['machine-learning'].categories.map((category) => ({
      id: slugify(category.title),
      title: category.title,
      icon: iconToSection(category.icon),
      ids: category.cards.map((card) => card.topicId),
    })),
    mlSystemDesign: (hubs['ml-system-design'].groups || []).map((group) => ({
      id: slugify(group.name),
      title: group.name,
      icon: iconToSection(group.icon),
      ids: hubs['ml-system-design'].categories
        .filter((category) => group.categories.includes(category.title))
        .flatMap((category) => category.cards.map((card) => card.topicId)),
      groups: hubs['ml-system-design'].categories
        .filter((category) => group.categories.includes(category.title))
        .map((category) => ({
          title: category.title,
          ids: category.cards.map((card) => card.topicId),
        })),
    })),
    paths: [
      {
        id: 'learning-paths',
        title: 'Learning paths',
        icon: 'BookOpen',
        ids: pathOverviews.map((topic) => topic.id),
      },
    ],
    interviews: [
      {
        id: 'interview-sets',
        title: 'Interview sets',
        icon: 'Sparkles',
        ids: interviews.map((topic) => topic.id),
      },
    ],
  };

  fs.writeFileSync(
    path.join(OUT_DIR, 'aimlHubs.ts'),
    `import type { HubPage } from './types';

export const aimlHubs: Record<string, HubPage> = {
${Object.entries(hubs)
  .map(([slug, hub]) => `  ${jsString(slug)}: ${JSON.stringify(hub, null, 2).split('\n').map((line, index) => (index === 0 ? line : `  ${line}`)).join('\n')}`)
  .join(',\n')}
};

export const aimlOutlineDefs = ${JSON.stringify(outline, null, 2)} as const;
`
  );

  const iconEntries = [...iconUsed.entries()].sort(([a], [b]) => a.localeCompare(b));
  fs.writeFileSync(
    path.join(ROOT, 'scripts', 'aiml-icon-usage.json'),
    JSON.stringify({ used: Object.fromEntries(iconEntries), fallbacks: iconFallbacks }, null, 2)
  );

  const report = {
    totals: {
      files: files.length,
      leafTopics: leaves.length,
      modelCards: modelCards.length,
      interviewQuestions,
      detailsBlocks,
      pathOverviews: pathOverviews.length,
      interviews: interviews.length,
      iconFallbacks: iconFallbacks.length,
    },
    coverage,
    assertions: {
      files: files.length === EXPECTED.total,
      leaves: leaves.length === EXPECTED.leafTopics,
      modelCards: modelCards.length === EXPECTED.modelCards,
      interviewQuestions: interviewQuestions === EXPECTED.interviewQuestions,
      detailsBlocks: detailsBlocks === EXPECTED.detailsBlocks,
      bijection: true,
      unknownTags: unknownTags.length === 0,
    },
  };
  fs.writeFileSync(path.join(ROOT, 'scripts', 'aiml-conversion-report.json'), JSON.stringify(report, null, 2));

  const losses = coverage.filter((item) => item.sourceWords - item.generatedWords > 8);
  console.log(`Converted ${files.length} MDX files.`);
  console.log(`  ML topics: ${mlTopics.length}`);
  console.log(`  MLSD topics: ${mlsdTopics.length}`);
  console.log(`  Interviews: ${interviews.length}`);
  console.log(`  Path overviews: ${pathOverviews.length}`);
  console.log(`  InterviewQuestion: ${interviewQuestions}`);
  console.log(`  details Q&A: ${detailsBlocks}`);
  console.log(`  ModelCards: ${modelCards.length}`);
  console.log(`  Icon fallbacks: ${iconFallbacks.length}`);
  console.log(`  Word-count shrinkage files: ${losses.length}`);
  if (losses.length) {
    for (const item of losses.slice(0, 10)) {
      console.log(`    ${item.file}: source ${item.sourceWords} -> generated ${item.generatedWords}`);
    }
  }
}

main();
