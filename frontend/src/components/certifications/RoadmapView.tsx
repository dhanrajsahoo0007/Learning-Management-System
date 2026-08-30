import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Code,
  FileText,
  Play,
  Star,
  Trophy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ConfettiTrigger } from '@/components/shared/ConfettiTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Certification } from '@/data/certificationsData';
import { cn } from '@/lib/utils';

type StepType = Certification['roadmap'][number]['type'];

const STEP_ICON: Record<StepType, typeof Play> = {
  video: Play,
  reading: BookOpen,
  practice: Code,
  exam: FileText,
};

const STEP_ACCENT: Record<StepType, string> = {
  video: 'text-blue-500',
  reading: 'text-success',
  practice: 'text-purple-500',
  exam: 'text-destructive',
};

export const RoadmapView: React.FC<{
  certification: Certification;
  onBack: () => void;
}> = ({ certification, onBack }) => {
  const reduced = usePrefersReducedMotion();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    () => new Set(certification.roadmap.filter((step) => step.completed).map((step) => step.id))
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
        if (next.size === certification.roadmap.length) setShowConfetti(true);
      }
      return next;
    });
  };

  const percent =
    certification.roadmap.length > 0
      ? (completedSteps.size / certification.roadmap.length) * 100
      : 0;
  const allComplete =
    certification.roadmap.length > 0 && completedSteps.size === certification.roadmap.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <ConfettiTrigger trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden />
          Back to certifications
        </Button>

        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              {certification.title}
            </h1>
            <p className="text-lg text-muted-foreground">{certification.description}</p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <ProgressRing progress={percent} size={80} />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-border" aria-hidden />

        <ol className="space-y-8">
          {certification.roadmap.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const StepIcon = STEP_ICON[step.type] ?? Circle;

            return (
              <motion.li
                key={step.id}
                initial={reduced ? false : { x: -16 }}
                animate={{ x: 0 }}
                transition={{ delay: Math.min(index, 10) * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10">
                  <motion.button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    aria-pressed={isCompleted}
                    aria-label={
                      isCompleted ? `Mark ${step.title} incomplete` : `Mark ${step.title} complete`
                    }
                    className={cn(
                      'grid size-12 place-items-center rounded-full border-4 border-background shadow-md transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                      isCompleted
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    whileHover={reduced ? undefined : { scale: 1.08 }}
                    whileTap={reduced ? undefined : { scale: 0.94 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="size-6" aria-hidden />
                    ) : (
                      <StepIcon className="size-5" aria-hidden />
                    )}
                  </motion.button>
                </div>

                <Card className="flex-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={cn('text-sm font-medium capitalize', STEP_ACCENT[step.type])}
                          >
                            {step.type}
                          </span>
                          <Badge variant="secondary">{step.duration}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                    </div>

                    {step.content && <p className="text-muted-foreground">{step.content}</p>}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Button variant={isCompleted ? 'secondary' : 'default'}>
                        {isCompleted ? 'Completed' : `Start ${step.type}`}
                      </Button>
                      <Button variant="outline" onClick={() => toggleStep(step.id)}>
                        {isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {allComplete && (
        <motion.div
          initial={reduced ? false : { scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-8 text-center">
              <Trophy className="mx-auto mb-4 size-14 text-primary" aria-hidden />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Congratulations</h2>
              <p className="mb-4 text-lg text-muted-foreground">
                You have completed all modules for {certification.title}.
              </p>
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-6 fill-current text-warning" aria-hidden />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Ready to take the certification exam?
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
