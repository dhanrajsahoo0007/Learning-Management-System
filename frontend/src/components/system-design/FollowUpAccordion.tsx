import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { FollowUpQuestion } from '@/data/systemDesignTypes';

const DIFFICULTY_VARIANT = {
  easy: 'secondary',
  medium: 'warning',
  hard: 'danger',
} as const;

export function FollowUpAccordion({ items }: { items: FollowUpQuestion[] }) {
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter((value): value is string => Boolean(value)))],
    [items]
  );
  const [active, setActive] = useState<string | 'all'>('all');
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => active === 'all' || item.category === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <FilterChip label="All" selected={active === 'all'} onClick={() => setActive('all')} />
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                selected={active === category}
                onClick={() => setActive(category)}
              />
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(new Set(visible.map(({ index }) => index)))}>
            Expand all
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(new Set())}>
            Collapse all
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {visible.map(({ item, index }) => {
          const isOpen = open.has(index);
          return (
            <Collapsible
              key={`${item.question}-${index}`}
              open={isOpen}
              onOpenChange={(next) => {
                setOpen((current) => {
                  const copy = new Set(current);
                  if (next) copy.add(index);
                  else copy.delete(index);
                  return copy;
                });
              }}
            >
              <div className="rounded-lg border border-border bg-card">
                <CollapsibleTrigger className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <ChevronDown
                    className={cn('mt-0.5 size-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 font-medium text-foreground">{item.question}</span>
                  <span className="flex shrink-0 flex-wrap justify-end gap-1">
                    {item.category && (
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    )}
                    {item.difficulty && (
                      <Badge variant={DIFFICULTY_VARIANT[item.difficulty]} className="capitalize">
                        {item.difficulty}
                      </Badge>
                    )}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap"
                  >
                    {item.answer}
                  </motion.div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
