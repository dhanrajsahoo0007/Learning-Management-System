import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { systemDesignService } from '@/api/systemDesign';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import {
  clusterSectionItems,
  flattenOutline,
  getCourseById,
  getCourseHomePath,
  getOutlineForCourse,
  parseCoursePath,
  type CourseId,
  type CourseOutlineSection,
} from '@/data/courseOutline';
import { ArticleView } from '@/components/aiml/ArticleView';
import { ModelCategoryGrid } from '@/components/aiml/ModelCategoryGrid';
import { LessonView } from '@/components/system-design/LessonView';
import { TopicCard } from '@/components/system-design/TopicCard';
import { Badge } from '@/components/ui/badge';
import { CourseLayout } from '@/components/system-design/CourseLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { aimlHubs } from '@/data/aiml';

const LessonCatalog: React.FC<{ sections: CourseOutlineSection[] }> = ({ sections }) => (
  <div className="mt-12 space-y-12">
    {sections.map((section) => {
      const newIds = new Set(section.newIds ?? []);
      return (
        <section key={section.id}>
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <span className="text-sm text-muted-foreground">
              {section.items.length} lesson{section.items.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="space-y-8">
            {clusterSectionItems(section).map((cluster, clusterIndex) => (
              <div key={cluster.title ?? `cluster-${clusterIndex}`}>
                {cluster.title && (
                  <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {cluster.title}
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cluster.items.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      className="relative"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.26, delay: Math.min(index, 5) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {newIds.has(topic.id) && (
                        <Badge className="absolute -top-2 -left-2 z-10 h-5 bg-emerald-500 px-1.5 text-[10px] text-white shadow-sm">
                          New
                        </Badge>
                      )}
                      <TopicCard topic={topic} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);

const CourseHome: React.FC<{ courseId: CourseId; hubKey?: keyof typeof aimlHubs }> = ({
  courseId,
  hubKey,
}) => {
  const course = getCourseById(courseId);
  const outline = getOutlineForCourse(courseId);
  const lessons = flattenOutline(outline, { includeExternal: false });
  const firstLesson = lessons[0];
  const hub = hubKey ? aimlHubs[hubKey] : undefined;
  const showCatalog = !hub && lessons.length > 0;

  return (
    <div className={`mx-auto px-4 py-10 sm:px-6 lg:px-8 ${hub ? 'max-w-5xl' : showCatalog ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
        {course.familyTitle}
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {course.title}
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
        {course.blurb} Pick a chapter from the outline.
      </p>
      {courseId === 'aiml-ml-system-design' && (
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
      {showCatalog && <LessonCatalog sections={outline} />}
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
        <Route path="ai" element={<Navigate to="/system-design/ai/ml-system-design" replace />} />
        <Route path="ai/fundamentals" element={<Navigate to="/system-design/ai/ml-system-design" replace />} />
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
