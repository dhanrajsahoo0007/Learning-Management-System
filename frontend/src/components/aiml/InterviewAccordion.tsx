import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { RichText } from './RichText';

export interface InterviewItem {
  question: string;
  answer: string;
  category?: string;
}

export function InterviewAccordion({ items }: { items: InterviewItem[] }) {
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter((value): value is string => Boolean(value)))],
    [items]
  );
  const [active, setActive] = useState<string | 'all'>('all');
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => active === 'all' || item.category === active);

  const expandAll = () => setOpen(new Set(visible.map(({ index }) => index)));
  const collapseAll = () => setOpen(new Set());

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
          <Button type="button" variant="ghost" size="sm" onClick={expandAll}>
            Expand all
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={collapseAll}>
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
              <div className="rounded-lg border bg-card">
                <CollapsibleTrigger className="flex w-full items-start gap-3 px-4 py-3 text-left">
                  <ChevronDown
                    className={cn('mt-0.5 size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
                  />
                  <span className="min-w-0 flex-1 font-medium text-foreground">{item.question}</span>
                  {item.category && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {item.category}
                    </span>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <RichText text={item.answer} />
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
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
