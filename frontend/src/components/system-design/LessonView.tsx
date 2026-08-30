import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import { DiagramBlock } from './DiagramBlock';
import { LessonShell } from './LessonShell';

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

export const LessonView: React.FC<{ topic: ArchitectureTopic }> = ({ topic }) => {
  const navigate = useNavigate();
  const content = topic.content;
  const walkthrough = content.walkthrough?.length ? content.walkthrough : content.steps;
  const related = (content.relatedTopics || [])
    .map((id) => findTopicById(id))
    .filter((item): item is ArchitectureTopic => Boolean(item));

  return (
    <LessonShell topic={topic}>
      <div className="space-y-6">
        <Section title="Why it exists">
          <p className="leading-relaxed text-foreground">{content.whyItExists || content.overview}</p>
        </Section>

        <Section title="Overview" hide={!content.overview}>
          <p className="leading-relaxed text-foreground">{content.overview}</p>
        </Section>

        <Section title="When to use it" hide={!content.whenToUse?.length}>
          <BulletList items={content.whenToUse} />
        </Section>

        <div className="grid md:grid-cols-2 gap-6">
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

        <Section title="Request path / walkthrough" hide={!walkthrough?.length}>
          <div className="space-y-5">
            {walkthrough.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section title="APIs" hide={!content.apis?.length}>
          <div className="space-y-3">
            {content.apis.map((api) => (
              <div key={`${api.method}-${api.path}`} className="rounded-lg bg-muted/50 p-3">
                <p className="font-mono text-sm">
                  <span className="font-bold text-primary">{api.method}</span> {api.path}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{api.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Data model" hide={!content.dataModel?.length}>
          <div className="space-y-4">
            {content.dataModel.map((table) => (
              <div key={table.name} className="rounded-lg border p-4">
                <p className="mb-2 font-mono font-semibold">{table.name}</p>
                <p className="text-sm text-muted-foreground">{table.columns.join(' · ')}</p>
                {table.notes && <p className="mt-2 text-xs text-muted-foreground">{table.notes}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Architecture" hide={!content.architecture && !content.diagram}>
          {content.architecture && (
            <p className="text-foreground leading-relaxed mb-4">{content.architecture}</p>
          )}
          <DiagramBlock diagram={content.diagram} />
        </Section>

        <Section title="Deep dives" hide={!content.deepDives?.length}>
          <div className="space-y-5">
            {content.deepDives.map((dive) => (
              <div key={dive.title}>
                <h4 className="font-semibold text-foreground mb-2">{dive.title}</h4>
                <p className="text-foreground leading-relaxed">{dive.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Trade-offs" hide={!content.tradeoffs?.length}>
            <BulletList items={content.tradeoffs} />
          </Section>
          <Section title="Bottlenecks" hide={!content.bottlenecks?.length}>
            <BulletList items={content.bottlenecks} />
          </Section>
        </div>

        <Section title="Scaling roadmap" hide={!content.scalingPath?.length}>
          <div className="grid md:grid-cols-3 gap-3">
            {content.scalingPath.map((stage) => (
              <div key={stage.scale} className="rounded-lg bg-muted/50 p-4">
                <p className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">{stage.scale}</p>
                <p className="text-sm">{stage.focus}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Interview script" hide={!content.interviewScript?.length}>
          <ol className="space-y-3 list-decimal list-inside">
            {content.interviewScript.map((line) => (
              <li key={line} className="text-foreground italic">{line}</li>
            ))}
          </ol>
        </Section>

        <Section title="Common mistakes" hide={!content.commonMistakes?.length}>
          <BulletList items={content.commonMistakes} />
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
