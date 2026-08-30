import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
}

export interface FlowPhase {
  caption: string;
  active?: string[];
  danger?: string[];
  values?: Record<string, string>;
}

export function FlowAnimation({
  nodes,
  phases,
  playing = true,
  intervalMs = 1800,
}: {
  nodes: FlowNode[];
  phases: FlowPhase[];
  playing?: boolean;
  intervalMs?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(reduced ? phases.length - 1 : 0);

  useEffect(() => {
    if (reduced || !playing) {
      setIndex(phases.length - 1);
      return;
    }
    setIndex(0);
    let cursor = 0;
    const timer = window.setInterval(() => {
      cursor = (cursor + 1) % phases.length;
      setIndex(cursor);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, phases.length, playing, reduced]);

  const phase = phases[Math.min(index, phases.length - 1)];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-stretch gap-2" role="img" aria-label={phase.caption}>
        {nodes.map((node, position) => {
          const active = phase.active?.includes(node.id);
          const danger = phase.danger?.includes(node.id);
          const value = phase.values?.[node.id] ?? node.sub;

          return (
            <div key={node.id} className="flex items-center gap-2">
              {position > 0 && <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden />}
              <motion.div
                animate={reduced ? undefined : { scale: active || danger ? 1.03 : 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'min-w-28 rounded-lg border px-3 py-2 transition-colors duration-200',
                  danger
                    ? 'border-destructive bg-destructive/10'
                    : active
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                )}
              >
                <p className="text-xs font-medium text-foreground">{node.label}</p>
                {value && <p className="mt-0.5 text-[11px] text-muted-foreground">{value}</p>}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5" aria-hidden>
        {phases.map((item, position) => (
          <span
            key={item.caption}
            className={cn(
              'h-1 rounded-full transition-all duration-200',
              position === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
            )}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{phase.caption}</p>
    </div>
  );
}
