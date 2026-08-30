import type { FC } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArticleView } from '@/components/aiml/ArticleView';
import { ModelCategoryGrid } from '@/components/aiml/ModelCategoryGrid';
import { CourseLayout } from '@/components/system-design/CourseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { aimlHubs } from '@/data/aiml';
import {
  flattenOutline,
  getCourseById,
  getOutlineForCourse,
  type CourseId,
} from '@/data/courseOutline';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import { resolveAimlIcon } from '@/lib/aimlIcons';

const CourseHome: FC<{ courseId: CourseId; hubKey?: keyof typeof aimlHubs }> = ({
  courseId,
  hubKey,
}) => {
  const course = getCourseById(courseId);
  const outline = getOutlineForCourse(courseId);
  const firstLesson = flattenOutline(outline, { includeExternal: false })[0];
  const hub = hubKey ? aimlHubs[hubKey] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
        {course.familyTitle}
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
      <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{course.blurb}</p>
      {firstLesson && !hub && (
        <Button asChild>
          <Link to={getTopicPath(firstLesson)}>
            Start with {firstLesson.title}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
      {hub && <ModelCategoryGrid hub={hub} />}
    </div>
  );
};

const PathIndex: FC = () => {
  const course = getCourseById('aiml-paths');
  const items = flattenOutline(getOutlineForCourse('aiml-paths'), { includeExternal: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
        {course.familyTitle}
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
      <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{course.blurb}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((topic) => {
          const Icon = resolveAimlIcon(topic.icon);
          return (
            <Link key={topic.id} to={getTopicPath(topic)}>
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardContent className="p-5">
                  <Icon className="mb-3 size-5 text-primary" />
                  <h2 className="text-lg font-semibold">{topic.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const PathOverview: FC = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  if (pathId === 'machine-learning') {
    return <CourseHome courseId="aiml-machine-learning" hubKey="machine-learning" />;
  }
  const topic = findTopicById(`aiml-path-${pathId}`);
  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Path not found</h2>
        <Button type="button" onClick={() => navigate('/ai-ml/learning-paths')}>
          Back
        </Button>
      </div>
    );
  }
  return <ArticleView topic={topic} />;
};

const LegacyMlsdRedirect: FC = () => {
  const { topicId } = useParams();
  return <Navigate to={`/system-design/ai/ml-system-design/${topicId}`} replace />;
};

const TopicDetail: FC<{ prefix: 'aiml-ml' | 'aiml-iv'; param: string }> = ({
  prefix,
  param,
}) => {
  const params = useParams();
  const slug = params[param];
  const navigate = useNavigate();
  const topic = findTopicById(`${prefix}-${slug}`);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Topic not found</h2>
        <Button type="button" onClick={() => navigate('/ai-ml/learning-paths')}>
          Back
        </Button>
      </div>
    );
  }

  return <ArticleView topic={topic} />;
};

const AiMl: FC = () => {
  return (
    <CourseLayout>
      <Routes>
        <Route index element={<Navigate to="/ai-ml/learning-paths" replace />} />
        <Route path="learning-paths" element={<PathIndex />} />
        <Route path="learning-paths/:pathId" element={<PathOverview />} />
        <Route
          path="learning-paths/machine-learning/:topicId"
          element={<TopicDetail prefix="aiml-ml" param="topicId" />}
        />
        <Route path="ml-system-design" element={<Navigate to="/system-design/ai/ml-system-design" replace />} />
        <Route
          path="ml-system-design/:topicId"
          element={<LegacyMlsdRedirect />}
        />
        <Route path="interviews" element={<CourseHome courseId="aiml-interviews" />} />
        <Route path="interviews/:setId" element={<TopicDetail prefix="aiml-iv" param="setId" />} />
      </Routes>
    </CourseLayout>
  );
};

export default AiMl;
