import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArchitectureTopic, LessonDiagram } from '@/data/systemDesignTypes';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import { TinderArchitecturePoster } from '@/assets/diagrams/tinder/TinderArchitecturePoster';
import { DiagramBlock } from './DiagramBlock';
import { ExcalidrawPoster } from './ExcalidrawPoster';
import { ApiSpecCard } from './ApiSpecCard';
import { DataModelCard } from './DataModelCard';
import { FollowUpAccordion } from './FollowUpAccordion';
import { AnimatedWalkthrough } from './AnimatedWalkthrough';
import { LessonAnimation } from './animations';
import { LessonShell } from './LessonShell';

const POSTERS: Record<string, React.FC> = {
  'tinder-architecture': TinderArchitecturePoster,
};

const Section: React.FC<{ title: string; children: React.ReactNode; hide?: boolean }> = ({
  title,
  children,
  hide,
}) => {
  if (hide) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const BulletList: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
};

function ScopeList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{title}</p>
      <BulletList items={items} />
    </div>
  );
}

function DiagramGallery({ diagrams }: { diagrams?: LessonDiagram[] }) {
  if (!diagrams?.length) return null;
  return (
    <div className="space-y-4">
      {diagrams.map((diagram) => {
        if (diagram.kind === 'excalidraw') {
          const Poster = POSTERS[diagram.src];
          if (!Poster) return null;
          return (
            <ExcalidrawPoster key={diagram.id} title={diagram.title}>
              <Poster />
            </ExcalidrawPoster>
          );
        }
        if (diagram.kind === 'mermaid') {
          return <DiagramBlock key={diagram.id} diagram={diagram.src} title={diagram.title} />;
        }
        if (diagram.kind === 'animation') {
          return (
            <div key={diagram.id} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{diagram.title}</p>
              <LessonAnimation id={diagram.src} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export const LessonView: React.FC<{ topic: ArchitectureTopic }> = ({ topic }) => {
  const navigate = useNavigate();
  const content = topic.content;
  const walkthrough = content.walkthrough?.length ? content.walkthrough : content.steps;
  const related = (content.relatedTopics || [])
    .map((id) => findTopicById(id))
    .filter((item): item is ArchitectureTopic => Boolean(item));
  const posters = content.diagrams?.filter((diagram) => diagram.kind === 'excalidraw') ?? [];
  const extraDiagrams = content.diagrams?.filter((diagram) => diagram.kind !== 'excalidraw') ?? [];

  return (
    <LessonShell topic={topic}>
      <div className="space-y-6">
        <Section title="Problem statement" hide={!content.problemStatement}>
          <p className="leading-relaxed text-foreground">{content.problemStatement?.prompt}</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <ScopeList title="In scope" items={content.problemStatement?.inScope} />
            <ScopeList title="Out of scope for v1" items={content.problemStatement?.outOfScope} />
          </div>
        </Section>

        <Section title="Why it exists" hide={Boolean(content.problemStatement)}>
          <p className="leading-relaxed text-foreground">{content.whyItExists || content.overview}</p>
        </Section>

        <Section title="Overview" hide={!content.overview || Boolean(content.problemStatement)}>
          <p className="leading-relaxed text-foreground">{content.overview}</p>
        </Section>

        <Section title="Assumptions" hide={!content.assumptions?.length}>
          <BulletList items={content.assumptions} />
        </Section>

        <Section title="When to use it" hide={!content.whenToUse?.length}>
          <BulletList items={content.whenToUse} />
        </Section>

        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Functional requirements" hide={!content.functionalRequirements?.length}>
            <ul className="space-y-3">
              {content.functionalRequirements.map((item) => (
                <li key={item.title}>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Non-functional requirements" hide={!content.nonFunctionalRequirements?.length}>
            <ul className="space-y-3">
              {content.nonFunctionalRequirements.map((item) => (
                <li key={item.title}>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Back-of-envelope estimates" hide={!content.estimates?.length}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">What</th>
                  <th className="pb-2">Number</th>
                  <th className="pb-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {content.estimates.map((item) => (
                  <tr key={item.label} className="border-t">
                    <td className="py-2 font-medium">{item.label}</td>
                    <td className="py-2">{item.value}</td>
                    <td className="py-2 text-muted-foreground">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Key concepts" hide={!content.concepts?.length}>
          <div className="flex flex-wrap gap-2">
            {content.concepts.map((concept) => (
              <span key={concept} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {concept}
              </span>
            ))}
          </div>
        </Section>

        <Section title="High-level architecture" hide={!content.architecture && !content.diagram && !posters.length}>
          {content.architecture && (
            <p className="mb-4 leading-relaxed text-foreground">{content.architecture}</p>
          )}
          <div className="space-y-4">
            <DiagramGallery diagrams={posters} />
            <DiagramBlock diagram={content.diagram} />
          </div>
        </Section>

        <Section title="Request path / walkthrough" hide={!walkthrough?.length}>
          <AnimatedWalkthrough steps={walkthrough} />
        </Section>

        <Section title="APIs" hide={!content.apis?.length}>
          <div className="space-y-3">
            {content.apis.map((api) => (
              <ApiSpecCard key={`${api.method}-${api.path}`} api={api} />
            ))}
          </div>
        </Section>

        <Section title="Data model" hide={!content.dataModel?.length}>
          <div className="space-y-4">
            {content.dataModel.map((table) => (
              <DataModelCard key={table.name} table={table} />
            ))}
          </div>
        </Section>

        <Section title="More diagrams" hide={!extraDiagrams.length}>
          <DiagramGallery diagrams={extraDiagrams} />
        </Section>

        <Section title="Deep dives" hide={!content.deepDives?.length}>
          <div className="space-y-6">
            {content.deepDives.map((dive) => (
              <div key={dive.title} className="space-y-3">
                <h4 className="font-semibold text-foreground">{dive.title}</h4>
                <p className="leading-relaxed text-foreground">{dive.body}</p>
                <LessonAnimation id={dive.animation} />
                {dive.diagram && <DiagramBlock diagram={dive.diagram} title={dive.title} />}
              </div>
            ))}
          </div>
        </Section>

        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Trade-offs" hide={!content.tradeoffs?.length}>
            <BulletList items={content.tradeoffs} />
          </Section>
          <Section title="Bottlenecks" hide={!content.bottlenecks?.length}>
            <BulletList items={content.bottlenecks} />
          </Section>
        </div>

        <Section title="Scaling roadmap" hide={!content.scalingPath?.length}>
          <div className="grid gap-3 md:grid-cols-3">
            {content.scalingPath.map((stage) => (
              <div key={stage.scale} className="rounded-lg bg-muted/50 p-4">
                <p className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">{stage.scale}</p>
                <p className="text-sm">{stage.focus}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Interview script" hide={!content.interviewScript?.length}>
          <ol className="list-inside list-decimal space-y-3">
            {content.interviewScript.map((line) => (
              <li key={line} className="italic text-foreground">
                {line}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Common mistakes" hide={!content.commonMistakes?.length}>
          <BulletList items={content.commonMistakes} />
        </Section>

        <Section title="Advanced follow-ups" hide={!content.followUps?.length}>
          <FollowUpAccordion items={content.followUps ?? []} />
        </Section>

        <Section title="Real-world examples" hide={!content.examples?.length}>
          <BulletList items={content.examples} />
        </Section>

        {content.practicePrompt && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Practice prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{content.practicePrompt}</p>
            </CardContent>
          </Card>
        )}

        {related.length > 0 && (
          <Section title="Related lessons">
            <div className="flex flex-wrap gap-2">
              {related.map((item) => (
                <Button key={item.id} type="button" variant="outline" size="sm" onClick={() => navigate(getTopicPath(item))}>
                  {item.title}
                </Button>
              ))}
            </div>
          </Section>
        )}
      </div>
    </LessonShell>
  );
};
