import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Circle, Clock, FileText, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { groupBySection, isProblemOpenable } from '@/types/dsa';
import type { DSAProblemSummary } from '@/types/dsa';
import { cn } from '@/lib/utils';

const ProblemRow: React.FC<{ problem: DSAProblemSummary; index: number }> = ({ problem, index }) => {
  const openable = isProblemOpenable(problem);

  const content = (
    <>
      <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {index}
      </span>
      {problem.hasSolution ? (
        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
      ) : problem.hasStatement ? (
        <FileText className="size-4 shrink-0 text-warning" aria-hidden />
      ) : (
        <Circle className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
      )}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-sm',
          openable ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {problem.title}
      </span>
      {problem.solutionCount > 1 && (
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {problem.solutionCount} approaches
        </Badge>
      )}
      {!problem.hasSolution && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" aria-hidden />
          {problem.hasStatement ? 'Statement only' : 'Coming soon'}
        </span>
      )}
    </>
  );

  if (!openable) {
    return (
      <li
        className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 opacity-60"
        title="This problem has no content yet"
      >
        {content}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={`/dsa/problem/${problem.id}`}
        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {content}
      </Link>
    </li>
  );
};

const Section: React.FC<{
  section: string;
  problems: DSAProblemSummary[];
  defaultOpen: boolean;
  startIndex: number;
}> = ({ section, problems, defaultOpen, startIndex }) => {
  const [open, setOpen] = useState(defaultOpen);
  const solved = problems.filter((problem) => problem.hasSolution).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-border last:border-b-0">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between rounded-none px-3 py-3 text-left font-medium"
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronDown
              className={cn('size-4 shrink-0 transition-transform duration-200', !open && '-rotate-90')}
              aria-hidden
            />
            <span className="truncate">{section}</span>
          </span>
          <span className="shrink-0 text-xs font-normal text-muted-foreground">
            {solved} / {problems.length}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ul className="pb-2">
          {problems.map((problem, offset) => (
            <ProblemRow key={problem.id} problem={problem} index={startIndex + offset + 1} />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ProblemList: React.FC<{ problems: DSAProblemSummary[] }> = ({ problems }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return problems;
    return problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(term) ||
        problem.sectionPath.join(' ').toLowerCase().includes(term)
    );
  }, [problems, query]);

  const groups = useMemo(() => groupBySection(filtered), [filtered]);
  const solved = problems.filter((problem) => problem.hasSolution).length;

  if (problems.length === 0) {
    return (
      <p className="px-3 py-8 text-center text-sm text-muted-foreground">
        No problems have been added to this topic yet.
      </p>
    );
  }

  // Collapsing everything by default would hide the curriculum, but expanding
  // 149 Graphs problems at once is unreadable, so only open the first section.
  let runningIndex = 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search problems in this topic"
            aria-label="Search problems"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{solved}</span> of {problems.length} solved
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="px-3 py-8 text-center text-sm text-muted-foreground">
          No problems match “{query}”.
        </p>
      ) : (
        <div className="rounded-lg border border-border">
          {groups.map((group, groupIndex) => {
            const startIndex = runningIndex;
            runningIndex += group.problems.length;
            return (
              <Section
                key={group.section}
                section={group.section}
                problems={group.problems}
                startIndex={startIndex}
                defaultOpen={groupIndex === 0 || Boolean(query)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
