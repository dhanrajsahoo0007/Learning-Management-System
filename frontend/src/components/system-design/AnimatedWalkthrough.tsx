import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { WalkthroughStep } from '@/data/systemDesignTypes';
import { DiagramBlock } from './DiagramBlock';
import { LessonAnimation, hasLessonAnimation } from './animations';

export function AnimatedWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const step = steps[active];
  if (!step) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr]">
      <ol className="space-y-2">
        {steps.map((item, index) => {
          const selected = index === active;
          return (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => {
                  setActive(index);
                  setPlayKey((value) => value + 1);
                }}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-200',
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-muted/50'
                )}
              >
                <motion.span
                  animate={selected && !reduced ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </motion.span>
                <span className="text-sm font-medium text-foreground">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-foreground">{step.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
          {hasLessonAnimation(step.animation) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPlayKey((value) => value + 1)}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Replay
            </Button>
          )}
        </div>
        {hasLessonAnimation(step.animation) && (
          <LessonAnimation key={`${step.animation}-${playKey}`} id={step.animation} playing />
        )}
        {step.diagram && <DiagramBlock diagram={step.diagram} title={step.title} />}
      </div>
    </div>
  );
}
