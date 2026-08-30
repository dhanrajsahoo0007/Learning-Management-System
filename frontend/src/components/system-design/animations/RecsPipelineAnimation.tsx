import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const STAGES = ['App', 'Recs', 'Geo index', 'Seen-set', 'Ranker', 'CDN'] as const;

export function RecsPipelineAnimation({ playing = true }: { playing?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(reduced ? STAGES.length - 1 : 0);

  useEffect(() => {
    if (reduced || !playing) {
      setActive(STAGES.length - 1);
      return;
    }
    setActive(0);
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % STAGES.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        {STAGES.map((stage, index) => (
          <div key={stage} className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: index === active ? 1.04 : 1,
                backgroundColor: index <= active ? 'var(--primary)' : 'transparent',
                color: index <= active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium',
                index <= active ? 'border-primary' : 'border-border bg-card'
              )}
            >
              {stage}
            </motion.div>
            {index < STAGES.length - 1 && (
              <span className={cn('text-muted-foreground', index < active && 'text-primary')} aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {active === 0 && 'App opens the deck and asks Recs for the next page.'}
        {active === 1 && 'Recs resolves the viewer’s cell and preference filters.'}
        {active === 2 && 'Geo index returns nearby candidate IDs from this cell and neighbors.'}
        {active === 3 && 'Seen-set subtracts anyone already liked, passed, or blocked.'}
        {active === 4 && 'Ranker orders remaining cards by activity and inventory fairness.'}
        {active === 5 && 'CDN hydrates the top photos. Total budget: about 100ms.'}
      </p>
    </div>
  );
}
