import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
        >
          {complete ? <Check className="size-4" /> : <Circle className="size-4" />}
          {complete ? 'Completed' : 'Mark complete'}
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
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{topic.title}</h1>
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
            className="h-auto justify-start gap-3 py-3"
            onClick={() => navigate(getTopicPath(prev))}
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="text-left">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium">{prev.title}</span>
            </span>
          </Button>
        ) : (
          <div />
        )}
        {next && (
          <Button
            type="button"
            variant="outline"
            className="h-auto justify-end gap-3 py-3"
            onClick={() => navigate(getTopicPath(next))}
          >
            <span className="text-right">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium">{next.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </Button>
        )}
      </nav>
    </div>
  );
}
