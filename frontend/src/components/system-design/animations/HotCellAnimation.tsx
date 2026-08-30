import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const PHASES = ['quiet', 'spike', 'overflow'] as const;

export function HotCellAnimation({ playing = true }: { playing?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<(typeof PHASES)[number]>(reduced ? 'overflow' : 'quiet');

  useEffect(() => {
    if (reduced || !playing) {
      setPhase('overflow');
      return;
    }
    setPhase('quiet');
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % PHASES.length;
      setPhase(PHASES[index]);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return (
    <div className="space-y-3">
      <div className="grid max-w-72 grid-cols-4 gap-2" role="img" aria-label="Festival spike overflowing a hot geohash">
        {Array.from({ length: 8 }, (_, index) => {
          const hot = index === 3;
          const overflow = phase === 'overflow' && (index === 2 || index === 7);
          const load = hot ? (phase === 'quiet' ? 2 : 8) : overflow ? 4 : 1;
          return (
            <motion.div
              key={index}
              className={cn(
                'rounded-lg border p-2',
                hot && phase !== 'quiet' ? 'border-destructive bg-destructive/10' : 'border-border bg-card',
                overflow && 'border-primary bg-primary/10'
              )}
            >
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {hot ? 'Downtown' : overflow ? 'Shard' : `c${index}`}
              </p>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: load }, (_, dot) => (
                  <span key={dot} className="size-1.5 rounded-full bg-foreground/70" />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        {phase === 'quiet' && 'A normal city cell holds a few thousand actives. Recs stay in one Redis GEO key.'}
        {phase === 'spike' && 'A festival dumps 50k actives into one cell. Candidate fetch and seen-set subtraction blow the 100ms budget.'}
        {phase === 'overflow' && 'Split the hot cell into finer S2 children and cache a precomputed top-N per subcell. Recs never scan the raw 50k.'}
      </p>
    </div>
  );
}
