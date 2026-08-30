import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  completed: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}

export function SectionHeader({
  title,
  icon: Icon,
  completed,
  total,
  expanded,
  onToggle,
}: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/40 focus-visible:outline-none"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {title}
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            'h-3.5 w-3.5 rounded-full border',
            completed === total && total > 0
              ? 'border-sidebar-primary bg-sidebar-primary'
              : 'border-border'
          )}
          aria-hidden
        />
        <span>
          {completed}/{total}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
          aria-hidden
        />
      </span>
    </button>
  );
}
