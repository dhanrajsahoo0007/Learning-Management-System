import { NavLink } from 'react-router-dom';
import { Check, Code2, FileText, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getTopicPath } from '@/data/curriculum';
import type { ArchitectureTopic } from '@/data/systemDesignTypes';
import { cn } from '@/lib/utils';

interface LessonItemProps {
  topic: ArchitectureTopic;
  active: boolean;
  complete: boolean;
  locked: boolean;
  isNew?: boolean;
  onNavigate?: () => void;
}

export function LessonItem({
  topic,
  active,
  complete,
  locked,
  isNew,
  onNavigate,
}: LessonItemProps) {
  const hasPractice = Boolean(topic.content.practicePrompt);
  const Icon = hasPractice ? Code2 : FileText;
  const lockReason = locked
    ? `Recommended after: ${topic.prerequisites.join(', ')}`
    : undefined;

  const row = (
    <NavLink
      to={getTopicPath(topic)}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex items-center gap-2 rounded-md py-1.5 pr-2 pl-2.5 text-sm transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      {active && (
        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-sidebar-primary" aria-hidden />
      )}
      {complete ? (
        <Check className="size-4 shrink-0 text-sidebar-primary" aria-hidden />
      ) : (
        <Icon
          className={cn(
            'size-4 shrink-0',
            active ? 'text-sidebar-primary' : hasPractice ? 'text-orange-500' : 'text-muted-foreground'
          )}
          aria-hidden
        />
      )}
      <span className="min-w-0 flex-1 truncate leading-5">{topic.title}</span>
      {isNew && !complete && <Badge className="h-5 bg-emerald-500 px-1.5 text-[10px] text-white">New</Badge>}
      {locked && !complete && <Lock className="size-3.5 shrink-0 text-amber-400" aria-hidden />}
    </NavLink>
  );

  if (!lockReason) {
    return <li>{row}</li>;
  }

  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent>{lockReason}</TooltipContent>
      </Tooltip>
    </li>
  );
}
