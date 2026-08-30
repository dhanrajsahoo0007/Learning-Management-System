import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DSATopic } from '@/data/dsaData';
import { cn } from '@/lib/utils';

export function difficultyVariant(difficulty: DSATopic['difficulty']) {
  if (difficulty === 'Easy') return 'success' as const;
  if (difficulty === 'Medium') return 'warning' as const;
  return 'danger' as const;
}

export const TopicCard: React.FC<{ topic: DSATopic }> = ({ topic }) => {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const subcomponents = topic.subcomponents ?? [];

  return (
    <motion.div
      whileHover={reduced ? undefined : { x: 4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group/card"
    >
      <Card
        className="cursor-pointer border-l-4 border-l-primary ring-0 transition-shadow duration-200 group-hover/card:ring-1 group-hover/card:ring-primary/25"
        onClick={() => navigate(`/dsa/${topic.id}`)}
      >
        <CardContent className="p-4">
          <Collapsible open={expanded} onOpenChange={setExpanded}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <h4 className="truncate font-semibold text-foreground transition-colors group-hover/card:text-primary">
                  {topic.title}
                </h4>
                {subcomponents.length > 0 && (
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={expanded ? 'Collapse subtopics' : 'Expand subtopics'}
                    >
                      <ChevronDown
                        className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')}
                        aria-hidden
                      />
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>
              <Badge variant={difficultyVariant(topic.difficulty)}>{topic.difficulty}</Badge>
            </div>

            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>

            <CollapsibleContent
              className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 border-t border-border pt-2">
                <p className="mb-2 text-xs font-semibold text-foreground">
                  Topics ({subcomponents.length})
                </p>
                <ul className="max-h-48 space-y-1 overflow-y-auto">
                  {subcomponents.map((sub) => (
                    <li
                      key={sub}
                      className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ProgressRing progress={topic.progress} size={32} strokeWidth={4} showPercentage={false} />
                <span>{topic.progress}% complete</span>
              </div>
              <div className="flex items-center gap-3">
                {subcomponents.length > 0 && <span>{subcomponents.length} subtopics</span>}
                <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                  Open
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </div>
            </div>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
};
