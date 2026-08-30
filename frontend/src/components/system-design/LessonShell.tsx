import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { ArchitectureTopic, TopicSection } from '@/data/systemDesignTypes';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import { getCourseForTopic, getOutlineNeighbors } from '@/data/courseOutline';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ProductMark, hasProductMark } from './marks/ProductMark';

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable <= 0 ? 0 : Math.min(1, window.scrollY / scrollable));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

const SECTION_LABEL: Record<TopicSection, string> = {
  fundamentals: 'Fundamentals',
  products: 'Product design',
  paths: 'Learning path',
  mlsd: 'ML system design',
  interviews: 'Interview',
};

export function LessonShell({
  topic,
  children,
}: {
  topic: ArchitectureTopic;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const course = getCourseForTopic(topic);
  const { prev, next } = getOutlineNeighbors(topic.id);
  const { isComplete, toggleComplete } = useCompletedLessons();
  const complete = isComplete(topic.id);
  const reduced = usePrefersReducedMotion();
  const progress = useReadingProgress();
  const showMark = topic.section === 'products' && hasProductMark(topic.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={course.homePath}>{course.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{topic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          type="button"
          variant={complete ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => toggleComplete(topic.id)}
          className="min-w-[9.5rem] justify-center"
        >
          <motion.span
            key={complete ? 'done' : 'todo'}
            initial={reduced ? false : { scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="inline-flex items-center gap-2"
          >
            {complete ? <Check className="size-4" /> : <Circle className="size-4" />}
            {complete ? 'Completed' : 'Mark complete'}
          </motion.span>
        </Button>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={topic.section === 'fundamentals' || topic.section === 'paths' ? 'default' : 'secondary'}>
            {SECTION_LABEL[topic.section]}
          </Badge>
          <Badge
            variant={
              topic.difficulty === 'Beginner'
                ? 'success'
                : topic.difficulty === 'Intermediate'
                  ? 'warning'
                  : 'danger'
            }
          >
            {topic.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">{topic.estimatedMinutes} min</span>
        </div>
        <div className="mb-4 flex items-center gap-3">
          {showMark && (
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-muted/40 text-primary">
              <ProductMark id={topic.id} size="lg" className="h-6 w-6" />
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{topic.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{topic.description}</p>
      </div>

      {topic.prerequisites.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="self-center text-sm text-muted-foreground">Prerequisites:</span>
          {topic.prerequisites.map((id) => {
            const pre = findTopicById(id);
            if (!pre) return null;
            return (
              <Button key={id} type="button" variant="outline" size="sm" onClick={() => navigate(getTopicPath(pre))}>
                {pre.title}
              </Button>
            );
          })}
        </div>
      )}

      {children}

      <nav aria-label="Lesson pagination" className="mt-6 grid gap-3 border-t pt-6 sm:grid-cols-2">
        {prev ? (
          <Button
            type="button"
            variant="outline"
            className="group h-auto justify-start gap-3 py-3"
            onClick={() => navigate(getTopicPath(prev))}
          >
            <ArrowLeft className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="text-left">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium underline-offset-4 group-hover:underline">{prev.title}</span>
            </span>
          </Button>
        ) : (
          <div />
        )}
        {next && (
          <Button
            type="button"
            variant="outline"
            className="group h-auto justify-end gap-3 py-3"
            onClick={() => navigate(getTopicPath(next))}
          >
            <span className="text-right">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium underline-offset-4 group-hover:underline">{next.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        )}
      </nav>
    </div>
  );
}
