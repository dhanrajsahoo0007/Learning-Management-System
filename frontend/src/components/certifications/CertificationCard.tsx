import React from 'react';
import { motion } from 'framer-motion';
import { Award, Boxes, Cloud, Container, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Certification } from '@/data/certificationsData';
import { cn } from '@/lib/utils';

const PROVIDER_TILE: Record<string, string> = {
  AWS: 'bg-orange-500',
  Azure: 'bg-blue-600',
  GCP: 'bg-green-600',
  'Google Cloud': 'bg-green-600',
  Kubernetes: 'bg-cyan-500',
  Terraform: 'bg-purple-500',
  Docker: 'bg-blue-500',
};

const PROVIDER_ICON: Record<string, typeof Cloud> = {
  AWS: Cloud,
  Azure: Cloud,
  GCP: Cloud,
  'Google Cloud': Cloud,
  Kubernetes: Boxes,
  Terraform: Boxes,
  Docker: Container,
};

export function levelVariant(level: Certification['level']) {
  if (level === 'Foundational') return 'secondary' as const;
  if (level === 'Associate') return 'default' as const;
  if (level === 'Professional') return 'warning' as const;
  return 'success' as const;
}

export const CertificationCard: React.FC<{
  certification: Certification;
  onClick: () => void;
}> = ({ certification, onClick }) => {
  const reduced = usePrefersReducedMotion();
  const ProviderIcon = PROVIDER_ICON[certification.provider] ?? Award;
  const { completedModules, totalModules } = certification.progress;
  const percent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group/card h-full"
    >
      <Card
        className="h-full cursor-pointer ring-0 transition-shadow duration-200 group-hover/card:ring-1 group-hover/card:ring-primary/25"
        onClick={onClick}
      >
        <CardHeader>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-lg text-white',
                  PROVIDER_TILE[certification.provider] ?? 'bg-muted-foreground'
                )}
              >
                <ProviderIcon className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <Badge variant={levelVariant(certification.level)} className="mb-1">
                  {certification.level}
                </Badge>
                <CardTitle className="text-lg transition-colors group-hover/card:text-primary">
                  {certification.title}
                </CardTitle>
              </div>
            </div>
            <Award className="size-6 shrink-0 text-warning" aria-hidden />
          </div>
          <CardDescription className="line-clamp-2">{certification.description}</CardDescription>
        </CardHeader>

        <CardContent className="mt-auto space-y-4">
          <div className="flex items-center gap-2">
            <ProgressRing progress={percent} size={40} strokeWidth={5} showPercentage={false} />
            <div>
              <p className="text-sm font-medium text-foreground">
                {completedModules}/{totalModules} modules
              </p>
              <p className="text-xs text-muted-foreground">{Math.round(percent)}% complete</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" aria-hidden />
              {certification.estimatedHours}h
            </span>
            <span className="inline-flex items-center gap-1">
              <Trophy className="size-4" aria-hidden />
              {certification.difficulty}
            </span>
          </div>

          <Button className="w-full">Start learning</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
