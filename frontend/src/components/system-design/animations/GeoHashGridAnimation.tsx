import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const PHASES = ['cell', 'neighbors', 'haversine'] as const;
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const NEIGHBORS = new Set([0, 1, 2, 3, 5, 6, 7, 8]);
const IN_RADIUS = new Set([1, 3, 4, 5, 7]);

export function GeoHashGridAnimation({ playing = true }: { playing?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<(typeof PHASES)[number]>(reduced ? 'haversine' : 'cell');

  useEffect(() => {
    if (reduced || !playing) {
      setPhase('haversine');
      return;
    }
    setPhase('cell');
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % PHASES.length;
      setPhase(PHASES[index]);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return (
    <div className="space-y-3">
      <div className="grid max-w-56 grid-cols-3 gap-2" role="img" aria-label="Geohash neighborhood then haversine filter">
        {CELLS.map((cell) => {
          const isCenter = cell === 4;
          const neighborOn = phase !== 'cell' && NEIGHBORS.has(cell);
          const dropped = phase === 'haversine' && !IN_RADIUS.has(cell);
          return (
            <motion.div
              key={cell}
              animate={{ opacity: dropped ? 0.28 : 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border text-xs font-medium',
                isCenter && 'border-primary bg-primary text-primary-foreground',
                !isCenter && neighborOn && 'border-primary/50 bg-primary/10 text-foreground',
                !isCenter && !neighborOn && 'border-border bg-card text-muted-foreground'
              )}
            >
              {isCenter ? 'You' : `n${cell}`}
            </motion.div>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        {phase === 'cell' && 'A single geohash cell is a square, not a radius. Querying only it misses people just across the edge.'}
        {phase === 'neighbors' && 'Read the home cell plus its eight neighbors to cover a circle that straddles boundaries.'}
        {phase === 'haversine' && 'Then drop anyone outside the exact km radius. That last filter is cheap once the candidate set is small.'}
      </p>
    </div>
  );
}
