import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, PanelLeftOpen } from 'lucide-react';
import { CourseSidebar } from './CourseSidebar';
import { ResizeHandle, SIDEBAR_WIDTH_KEY, readSidebarWidth } from './sidebar/ResizeHandle';
import { getCourseTitle, parseCoursePath } from '@/data/courseOutline';
import { findTopicById } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const COLLAPSED_KEY = 'sd-sidebar-collapsed';

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function CourseLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { track, topicId } = parseCoursePath(location.pathname);
  const topic = topicId ? findTopicById(topicId) : undefined;

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [sidebarWidth, setSidebarWidth] = useState(readSidebarWidth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    } catch {
      // Ignore storage failures.
    }
  }, [collapsed]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
    } catch {
      // Ignore storage failures.
    }
  }, [sidebarWidth]);

  const heading = topic?.title ?? getCourseTitle(track);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside
        className={cn(
          'relative sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex',
          collapsed && 'w-12'
        )}
        style={collapsed ? undefined : { width: sidebarWidth }}
      >
        {collapsed ? (
          <Button
            type="button"
            variant="ghost"
            className="h-full w-full flex-col gap-3 rounded-none pt-4"
            onClick={() => setCollapsed(false)}
            aria-label="Expand course outline"
          >
            <PanelLeftOpen className="size-5" />
            <span className="text-[10px] font-semibold tracking-widest [writing-mode:vertical-rl]">
              {getCourseTitle(track)}
            </span>
          </Button>
        ) : (
          <>
            <div className="flex h-full min-h-0 w-full flex-col">
              <CourseSidebar track={track} topicId={topicId} onCollapse={() => setCollapsed(true)} />
            </div>
            <ResizeHandle width={sidebarWidth} onWidthChange={setSidebarWidth} />
          </>
        )}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-16 z-30 flex items-center gap-3 border-b bg-background/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <Button type="button" variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
            <Menu className="size-4" />
            Course
          </Button>
          <span className="truncate text-sm font-medium">{heading}</span>
        </div>
        {children}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[min(100%,320px)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Course outline</SheetTitle>
          </SheetHeader>
          <CourseSidebar track={track} topicId={topicId} onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
