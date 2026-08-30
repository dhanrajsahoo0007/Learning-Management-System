import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(ROOT, 'scripts', 'aiml-conversion-report.json');

if (!fs.existsSync(reportPath)) {
  throw new Error('Run scripts/convert-aiml-content.mjs first.');
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const failed = Object.entries(report.assertions).filter(([, ok]) => !ok);
if (failed.length) {
  throw new Error(`Assertion failures: ${failed.map(([name]) => name).join(', ')}`);
}

const losses = report.coverage.filter((item) => item.sourceWords - item.generatedWords > 8);
if (losses.length) {
  throw new Error(
    `Content loss in ${losses.length} files:\n${losses
      .map((item) => `  ${item.file}: ${item.sourceWords} -> ${item.generatedWords}`)
      .join('\n')}`
  );
}

const hubsPath = path.join(ROOT, 'frontend', 'src', 'data', 'aiml', 'aimlHubs.ts');
const hubsSource = fs.readFileSync(hubsPath, 'utf8');
const outlineMatch = hubsSource.match(/export const aimlOutlineDefs = (\{[\s\S]*\}) as const;/);
if (!outlineMatch) throw new Error('Could not parse aimlOutlineDefs');
const outline = JSON.parse(outlineMatch[1]);
const outlineIds = new Set(
  Object.values(outline).flatMap((sections) => sections.flatMap((section) => section.ids))
);

const generatedDir = path.join(ROOT, 'frontend', 'src', 'data', 'aiml');
const topicIds = new Set();
for (const file of ['aimlMachineLearning.ts', 'aimlSystemDesign.ts', 'aimlInterviews.ts', 'aimlPathOverviews.ts']) {
  const source = fs.readFileSync(path.join(generatedDir, file), 'utf8');
  for (const match of source.matchAll(/id: "([^"]+)"/g)) topicIds.add(match[1]);
}

const missingFromOutline = [...topicIds].filter((id) => !outlineIds.has(id));
if (missingFromOutline.length) {
  throw new Error(`Topics missing from outline: ${missingFromOutline.join(', ')}`);
}

const hrefs = [...hubsSource.matchAll(/"href": "([^"]+)"/g)].map((match) => match[1]);
const badHrefs = hrefs.filter((href) => {
  if (href.startsWith('/ai-ml/learning-paths/machine-learning/')) return !topicIds.has(`aiml-ml-${href.split('/').pop()}`);
  if (href.startsWith('/system-design/ai/ml-system-design/')) return !topicIds.has(`aiml-mlsd-${href.split('/').pop()}`);
  return true;
});
if (badHrefs.length) {
  throw new Error(`Unresolved hub hrefs: ${badHrefs.join(', ')}`);
}

const auditRoots = [
  path.join(ROOT, 'frontend', 'src', 'components', 'aiml'),
  path.join(ROOT, 'frontend', 'src', 'data', 'aiml'),
  path.join(ROOT, 'frontend', 'src', 'lib', 'aimlIcons.ts'),
  path.join(ROOT, 'frontend', 'src', 'pages', 'AiMl.tsx'),
];
const banned = ['from \'next', 'from "next', '@base-ui', '@radix-ui/react-', 'remark-', 'rehype-', 'gray-matter', 'drizzle', 'next-themes', 'sonner', 'next-mdx'];
const hits = [];
function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
      walk(path.join(target, entry.name));
    }
    return;
  }
  if (!/\.(ts|tsx)$/.test(target)) return;
  const text = fs.readFileSync(target, 'utf8');
  for (const needle of banned) {
    if (text.includes(needle)) hits.push(`${path.relative(ROOT, target)}: ${needle}`);
  }
  if (text.includes('prose-neutral') || text.includes('dark:prose-invert')) {
    hits.push(`${path.relative(ROOT, target)}: prose class`);
  }
}
for (const root of auditRoots) walk(root);
if (hits.length) {
  throw new Error(`Banned stack usage:\n${hits.join('\n')}`);
}

console.log('AI-ML coverage OK');
console.log(`  files=${report.totals.files} leaves=${report.totals.leafTopics} cards=${report.totals.modelCards}`);
console.log(`  questions=${report.totals.interviewQuestions} details=${report.totals.detailsBlocks}`);
console.log(`  topics=${topicIds.size} outlineIds=${outlineIds.size} hrefs=${hrefs.length}`);

