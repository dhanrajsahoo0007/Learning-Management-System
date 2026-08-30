import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { systemDesignService } from '@/api/systemDesign';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import {
  flattenOutline,
  getCourseById,
  getCourseHomePath,
  getOutlineForCourse,
  parseCoursePath,
  type CourseId,
} from '@/data/courseOutline';
import { ArticleView } from '@/components/aiml/ArticleView';
import { ModelCategoryGrid } from '@/components/aiml/ModelCategoryGrid';
import { LessonView } from '@/components/system-design/LessonView';
import { CourseLayout } from '@/components/system-design/CourseLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { aimlHubs } from '@/data/aiml';

const CourseHome: React.FC<{ courseId: CourseId; hubKey?: keyof typeof aimlHubs }> = ({
  courseId,
  hubKey,
}) => {
  const course = getCourseById(courseId);
  const outline = getOutlineForCourse(courseId);
  const firstLesson = flattenOutline(outline, { includeExternal: false })[0];
  const hub = hubKey ? aimlHubs[hubKey] : undefined;

  return (
    <div className={`mx-auto px-4 py-10 sm:px-6 lg:px-8 ${hub ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
        {course.familyTitle}
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {course.title}
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
        {course.blurb} Pick a chapter from the outline.
      </p>
      {courseId === 'ai-fundamentals' && (
        <p className="mb-6 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          These chapters assume the classic primitives.{' '}
          <Link to={getCourseHomePath('classic-fundamentals')} className="font-medium text-primary hover:underline">
            Finish System Design Fundamentals first
          </Link>
          {' '}if caches, queues, and load balancers are still fuzzy.
        </p>
      )}
      {hub && (
        <div className="mb-8">
          <ModelCategoryGrid hub={hub} />
        </div>
      )}
      {firstLesson && !hub && (
        <Button asChild>
          <Link to={getTopicPath(firstLesson)}>
            Start with {firstLesson.title}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};

const TopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = React.useState<ArchitectureTopic | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) return;
      setLoading(true);
      try {
        const data = await systemDesignService.getTopicById(topicId);
        setTopic(data);
      } catch {
        setTopic(findTopicById(topicId) || null);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!topic) {
    const { course } = parseCoursePath(location.pathname);
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Topic not found</h2>
        <Button type="button" onClick={() => navigate(course.homePath)}>
          Back
        </Button>
      </div>
    );
  }

  if (topic.article) {
    return <ArticleView topic={topic} />;
  }

  return <LessonView topic={topic} />;
};

const AimlTopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = findTopicById(`aiml-mlsd-${topicId}`);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Topic not found</h2>
        <Button type="button" onClick={() => navigate('/system-design/ai/ml-system-design')}>
          Back
        </Button>
      </div>
    );
  }

  return <ArticleView topic={topic} />;
};

const SystemDesign: React.FC = () => {
  return (
    <CourseLayout>
      <Routes>
        <Route index element={<Navigate to="/system-design/fundamentals" replace />} />
        <Route path="fundamentals" element={<CourseHome courseId="classic-fundamentals" />} />
        <Route path="problems" element={<CourseHome courseId="classic-problems" />} />
        <Route path="ai" element={<Navigate to="/system-design/ai/fundamentals" replace />} />
        <Route path="ai/fundamentals" element={<CourseHome courseId="ai-fundamentals" />} />
        <Route path="ai/problems" element={<CourseHome courseId="ai-problems" />} />
        <Route
          path="ai/ml-system-design"
          element={<CourseHome courseId="aiml-ml-system-design" hubKey="ml-system-design" />}
        />
        <Route path="ai/ml-system-design/:topicId" element={<AimlTopicDetail />} />
        <Route path="ai/:topicId" element={<TopicDetail />} />
        <Route path=":topicId" element={<TopicDetail />} />
      </Routes>
    </CourseLayout>
  );
};

export default SystemDesign;
