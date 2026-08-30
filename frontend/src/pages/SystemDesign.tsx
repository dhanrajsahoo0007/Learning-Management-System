import React from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { systemDesignService } from '@/api/systemDesign';
import { findTopicById, getTopicPath } from '@/data/curriculum';
import {
  flattenOutline,
  getCourseTitle,
  getOutlineForTrack,
} from '@/data/courseOutline';
import { LessonView } from '@/components/system-design/LessonView';
import { CourseLayout } from '@/components/system-design/CourseLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TrackHome: React.FC<{ isAIPath: boolean }> = ({ isAIPath }) => {
  const track = isAIPath ? 'ai' : 'classic';
  const outline = getOutlineForTrack(track);
  const firstLesson = flattenOutline(outline, { includeExternal: false })[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
        Course
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {getCourseTitle(track)}
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
        {isAIPath
          ? 'Start with the classic building blocks, then work through AI serving, RAG, eval, and product designs. Pick a chapter from the outline.'
          : 'Work through the primitives first, then design real products the way you would in a 45-minute interview. The outline on the left is the course.'}
      </p>
      {firstLesson && (
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
    const back = location.pathname.includes('/ai') ? '/system-design/ai' : '/system-design';
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Topic not found</h2>
        <Button type="button" onClick={() => navigate(back)}>
          Back
        </Button>
      </div>
    );
  }

  return <LessonView topic={topic} />;
};

const SystemDesign: React.FC = () => {
  return (
    <CourseLayout>
      <Routes>
        <Route index element={<TrackHome isAIPath={false} />} />
        <Route path="ai" element={<TrackHome isAIPath={true} />} />
        <Route path="ai/:topicId" element={<TopicDetail />} />
        <Route path=":topicId" element={<TopicDetail />} />
      </Routes>
    </CourseLayout>
  );
};

export default SystemDesign;
