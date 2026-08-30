import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppWindow,
  BookOpen,
  ChevronLeft,
  Compass,
  Cpu,
  Gauge,
  Layers,
  PanelLeftClose,
  Search,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { isFeatureEnabled } from '@/config/features';
import {
  clusterSectionItems,
  findSectionForTopic,
  getCourseHomePath,
  getCourseTitle,
  getOutlineForTrack,
  type CourseOutlineSection,
  type OutlineSectionIcon,
} from '@/data/courseOutline';
import type { TopicTrack } from '@/data/systemDesignTypes';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LessonItem } from './sidebar/LessonItem';
import { SectionHeader } from './sidebar/SectionHeader';
import { SubGroupLabel } from './sidebar/SubGroupLabel';

interface CourseSidebarProps {
  track: TopicTrack;
  topicId?: string;
  onNavigate?: () => void;
  onCollapse?: () => void;
}

const sectionIcons: Record<OutlineSectionIcon, LucideIcon> = {
  Compass,
  Layers,
  Gauge,
  AppWindow,
  BookOpen,
  Cpu,
  Sparkles,
};

export function CourseSidebar({ track, topicId, onNavigate, onCollapse }: CourseSidebarProps) {
  const outline = useMemo(() => getOutlineForTrack(track), [track]);
  const { isComplete } = useCompletedLessons();
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const active = findSectionForTopic(outline, topicId);
    return new Set(active ? [active] : outline[0] ? [outline[0].id] : []);
  });

  useEffect(() => {
    setQuery('');
  }, [track]);

  useEffect(() => {
    const active = findSectionForTopic(outline, topicId);
    if (!active) return;
    setOpenSections((current) => {
      if (current.has(active)) return current;
      const next = new Set(current);
      next.add(active);
      return next;
    });
  }, [outline, topicId]);

  const filtered = useMemo(() => filterOutline(outline, query), [outline, query]);
  const searchable = outline.flatMap((section) => section.items);
  const completedCount = searchable.filter((item) => isComplete(item.id)).length;
  const totalCount = searchable.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleSection = (id: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="shrink-0 space-y-3 border-b px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/"
            onClick={onNavigate}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            Back to Home
          </Link>
          {onCollapse && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="hidden lg:inline-flex"
              onClick={onCollapse}
              aria-label="Collapse course outline"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          )}
        </div>

        <Link
          to={getCourseHomePath(track)}
          onClick={onNavigate}
          className="block text-sm font-semibold hover:text-primary"
        >
          {getCourseTitle(track)}
        </Link>

        <TrackSwitcher track={track} onNavigate={onNavigate} />

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{percent}%</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <Progress value={percent} aria-label="Course progress" className="h-1" />
        </div>
      </div>

      <div className="relative shrink-0 border-b p-3">
        <Search className="pointer-events-none absolute top-1/2 left-5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search chapters..."
          className="h-8 pl-8"
        />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Course outline" className="px-2 py-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No lessons match “{query}”.
            </p>
          ) : (
            filtered.map((section) => {
              const isOpen = Boolean(query) || openSections.has(section.id);
              const done = section.items.filter((item) => isComplete(item.id)).length;
              const clusters = clusterSectionItems(section);
              return (
                <Collapsible
                  key={section.id}
                  open={isOpen}
                  onOpenChange={() => toggleSection(section.id)}
                  className="mb-1"
                >
                  <SectionHeader
                    title={section.title}
                    icon={sectionIcons[section.icon]}
                    completed={done}
                    total={section.items.length}
                    expanded={isOpen}
                    onToggle={() => toggleSection(section.id)}
                  />
                  <CollapsibleContent>
                    {clusters.map((cluster) => (
                      <div key={cluster.title ?? section.id}>
                        {cluster.title && <SubGroupLabel>{cluster.title}</SubGroupLabel>}
                        <ul className="pb-1">
                          {cluster.items.map((item) => (
                            <LessonItem
                              key={item.id}
                              topic={item}
                              active={item.id === topicId}
                              complete={isComplete(item.id)}
                              locked={item.prerequisites.some((id) => !isComplete(id))}
                              isNew={section.newIds?.includes(item.id)}
                              onNavigate={onNavigate}
                            />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}

function TrackSwitcher({ track, onNavigate }: { track: TopicTrack; onNavigate?: () => void }) {
  const showClassic = isFeatureEnabled('systemDesign');
  const showAI = isFeatureEnabled('aiSystemDesign');
  if (!showClassic || !showAI) return null;

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
      <Link
        to="/system-design"
        onClick={onNavigate}
        className={cn(
          'rounded-md px-2 py-1.5 text-center text-xs font-medium',
          track === 'classic' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        System Design
      </Link>
      <Link
        to="/system-design/ai"
        onClick={onNavigate}
        className={cn(
          'rounded-md px-2 py-1.5 text-center text-xs font-medium',
          track === 'ai' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        AI
      </Link>
    </div>
  );
}

function filterOutline(sections: CourseOutlineSection[], query: string): CourseOutlineSection[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          section.groups?.some(
            (group) => group.title.toLowerCase().includes(needle) && group.ids.includes(item.id)
          )
      ),
    }))
    .filter((section) => section.items.length > 0);
}
