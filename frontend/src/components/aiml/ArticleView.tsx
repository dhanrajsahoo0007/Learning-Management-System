import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArchitectureTopic } from '@/data/systemDesignTypes';
import type { ContentBlock } from '@/data/aiml/types';
import { LessonShell } from '@/components/system-design/LessonShell';
import { InterviewAccordion } from './InterviewAccordion';
import { MathBlock } from './MathBlock';
import { RichText } from './RichText';

export function ArticleView({ topic }: { topic: ArchitectureTopic }) {
  const blocks = topic.article?.blocks ?? [];
  const groups = groupBlocks(blocks);

  return (
    <LessonShell topic={topic}>
      <div className="space-y-6">
        {groups.map((group, index) => {
          if (group.kind === 'qa') {
            return (
              <Card key={`qa-${index}`}>
                <CardHeader>
                  <CardTitle>Interview questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <InterviewAccordion items={group.items} />
                </CardContent>
              </Card>
            );
          }
          return (
            <div key={`copy-${index}`} className="space-y-4">
              {group.items.map((block, blockIndex) => (
                <BlockView key={`${block.type}-${blockIndex}`} block={block} />
              ))}
            </div>
          );
        })}
      </div>
    </LessonShell>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') {
    const Tag = block.level === 2 ? 'h2' : 'h3';
    return (
      <Tag className={block.level === 2 ? 'text-2xl font-semibold tracking-tight' : 'text-xl font-semibold'}>
        <RichText text={block.text} />
      </Tag>
    );
  }
  if (block.type === 'paragraph') {
    return (
      <p className="leading-relaxed text-foreground">
        <RichText text={block.text} />
      </p>
    );
  }
  if (block.type === 'list') {
    const List = block.ordered ? 'ol' : 'ul';
    return (
      <List className={block.ordered ? 'list-decimal space-y-2 pl-5' : 'space-y-2'}>
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            {!block.ordered && (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span className="text-foreground">
              <RichText text={item} />
            </span>
          </li>
        ))}
      </List>
    );
  }
  if (block.type === 'math') {
    return (
      <Card>
        <CardContent className="pt-6">
          <MathBlock tex={block.tex} />
        </CardContent>
      </Card>
    );
  }
  return null;
}

function groupBlocks(blocks: ContentBlock[]) {
  const groups: Array<
    | { kind: 'copy'; items: ContentBlock[] }
    | { kind: 'qa'; items: Array<Extract<ContentBlock, { type: 'qa' }>> }
  > = [];

  for (const block of blocks) {
    const last = groups[groups.length - 1];
    if (block.type === 'qa') {
      if (last?.kind === 'qa') last.items.push(block);
      else groups.push({ kind: 'qa', items: [block] });
    } else if (last?.kind === 'copy') {
      last.items.push(block);
    } else {
      groups.push({ kind: 'copy', items: [block] });
    }
  }
  return groups;
}
