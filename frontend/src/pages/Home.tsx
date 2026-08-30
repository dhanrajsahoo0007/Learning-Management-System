import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  getCourseById,
  getCourseFamilies,
  getCourseProgress,
  getFirstIncompleteLesson,
} from '@/data/courseOutline';
import { getTopicPath } from '@/data/curriculum';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { isFeatureEnabled } from '@/config/features';

const Home: React.FC = () => {
  const { isComplete } = useCompletedLessons();
  const families = getCourseFamilies();
  const startLesson = isFeatureEnabled('systemDesign')
    ? getFirstIncompleteLesson('classic-fundamentals', isComplete)
    : undefined;
  const fundamentalsProgress = isFeatureEnabled('systemDesign')
    ? getCourseProgress('classic-fundamentals', isComplete)
    : undefined;
  const startHref = startLesson
    ? getTopicPath(startLesson)
    : getCourseById('classic-fundamentals').homePath;
  const startLabel = startLesson
    ? fundamentalsProgress && fundamentalsProgress.completed > 0
      ? `Continue ${startLesson.title}`
      : `Start with ${startLesson.title}`
    : 'Start Fundamentals';

  return (
    <div className="bg-background">
      <section className="px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" />
            System Design Hub
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Master system design
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Classic and AI system design courses, plus a full AI / ML track for algorithms and interviews.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isFeatureEnabled('systemDesign') && (
              <Button size="lg" asChild>
                <Link to={startHref}>
                  {startLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
            {isFeatureEnabled('aiSystemDesign') && (
              <Button size="lg" variant="outline" asChild>
                <Link to={getCourseById('aiml-ml-system-design').homePath}>Explore AI Fundamentals</Link>
              </Button>
            )}
            {isFeatureEnabled('aiMl') && (
              <Button size="lg" variant="outline" asChild>
                <Link to={getCourseById('aiml-paths').homePath}>Explore AI / ML</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {families.map((family) => (
            <div key={family.family}>
              <div className="mb-5">
                <h2 className="font-display text-2xl font-semibold tracking-tight">{family.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {family.family === 'classic'
                    ? 'Learn the primitives, then design real products.'
                    : family.family === 'ai'
                      ? 'Start with ML system design fundamentals, then apply them to AI product designs.'
                      : 'Learning paths, machine learning algorithms, and interview drills.'}
                </p>
              </div>
              <div className={`grid gap-4 ${family.courses.length === 1 ? 'max-w-xl' : 'md:grid-cols-2'}`}>
                {family.courses.map((course) => {
                  const progress = getCourseProgress(course.id, isComplete);
                  return (
                    <Link key={course.id} to={course.homePath}>
                      <Card className="h-full transition-colors hover:bg-accent/40">
                        <CardContent className="p-6">
                          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {course.kind === 'fundamentals' || course.kind === 'paths'
                              ? 'Start here'
                              : course.kind === 'algorithms' || course.kind === 'mlsd'
                                ? 'Go deeper'
                                : 'Apply it'}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{course.blurb}</p>
                          <div className="mt-5 space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {progress.total} lesson{progress.total === 1 ? '' : 's'}
                              </span>
                              <span>
                                {progress.completed}/{progress.total}
                              </span>
                            </div>
                            <Progress value={progress.percent} className="h-1" />
                          </div>
                          <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                            Open course
                            <ArrowRight className="size-4" />
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
