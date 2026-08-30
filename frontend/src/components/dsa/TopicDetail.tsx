import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProblemList } from './ProblemList';
import { difficultyVariant } from './TopicCard';
import { dsaService } from '@/api/dsa';
import type { DSATopic } from '@/data/dsaData';
import type { DSAProblemSummary } from '@/types/dsa';

export const TopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<DSATopic | null>(null);
  const [problems, setProblems] = useState<DSAProblemSummary[]>([]);
  const [problemsError, setProblemsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTopic = async () => {
      if (!topicId) return;
      setLoading(true);
      setProblemsError(null);
      try {
        const [loadedTopic, problemsResult] = await Promise.all([
          dsaService.getById(topicId),
          dsaService.getProblems(topicId).then(
            (value) => ({ ok: true as const, value }),
            (error: unknown) => ({
              ok: false as const,
              error: error instanceof Error ? error.message : 'Failed to load problems',
            })
          ),
        ]);
        if (cancelled) return;
        setTopic(loadedTopic);
        if (problemsResult.ok) {
          setProblems(problemsResult.value);
        } else {
          setProblems([]);
          setProblemsError(problemsResult.error);
        }
      } catch (error) {
        console.error('Failed to fetch topic:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTopic();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Topic not found</h2>
        <p className="mb-6 text-muted-foreground">
          This DSA topic does not exist or is no longer available.
        </p>
        <Button onClick={() => navigate('/dsa')}>
          <ArrowLeft className="size-4" aria-hidden />
          Back to DSA
        </Button>
      </div>
    );
  }

  const solved = topic.solvedCount ?? problems.filter((problem) => problem.hasSolution).length;
  const total = problems.length || topic.problemCount;
  const coverage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/dsa')}>
          <ArrowLeft className="size-4" aria-hidden />
          Back to DSA
        </Button>

        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{topic.title}</h1>
              <Badge variant={difficultyVariant(topic.difficulty)}>{topic.difficulty}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{topic.description}</p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <ProgressRing progress={coverage} size={80} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="size-5 text-primary" aria-hidden />
                Problems
              </CardTitle>
            </CardHeader>
            <CardContent>
              {problemsError ? (
                <Alert variant="destructive">
                  <AlertTitle>Could not load problems</AlertTitle>
                  <AlertDescription>
                    The topic loaded, but the problem list request failed. Restart the DSA
                    service so it includes the new `/topics/:id/problems` route, then refresh.
                  </AlertDescription>
                </Alert>
              ) : (
                <ProblemList problems={problems} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coverage</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ProgressRing progress={coverage} size={100} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {solved} of {total} problems have a worked solution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="w-full justify-center">
                {topic.category}
              </Badge>
            </CardContent>
          </Card>

          {(topic.subcomponents?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {topic.subcomponents.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
