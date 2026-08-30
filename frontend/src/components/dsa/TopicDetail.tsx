import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ListChecks, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { CodePlayground } from './CodePlayground';
import { difficultyVariant } from './TopicCard';
import { dsaService } from '@/api/dsa';
import type { DSATopic } from '@/data/dsaData';

export const TopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<DSATopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) return;
      setLoading(true);
      try {
        const data = await dsaService.getById(topicId);
        setTopic(data);
      } catch (error) {
        console.error('Failed to fetch topic:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
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
            <ProgressRing progress={topic.progress} size={80} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Problem explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-foreground">{topic.content.explanation}</p>
            </CardContent>
          </Card>

          {topic.content.examples?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topic.content.examples.map((example, index) => (
                  <div key={index} className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Example {index + 1}</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <dt className="font-medium text-foreground">Input:</dt>
                        <dd>
                          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                            {example.input}
                          </code>
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <dt className="font-medium text-foreground">Output:</dt>
                        <dd>
                          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                            {example.output}
                          </code>
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <dt className="font-medium text-foreground">Explanation:</dt>
                        <dd className="text-muted-foreground">{example.explanation}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Interactive code playground</CardTitle>
            </CardHeader>
            <CardContent>
              <CodePlayground topic={topic} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ProgressRing progress={topic.progress} size={100} className="mb-4" />
              <p className="text-sm text-muted-foreground">{topic.progress}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <ListChecks className="size-4" aria-hidden />
                Mark as complete
              </Button>
              <Button variant="secondary" className="w-full">
                <Heart className="size-4" aria-hidden />
                Add to favorites
              </Button>
              <Button variant="outline" className="w-full">
                <Sparkles className="size-4" aria-hidden />
                Practice similar
              </Button>
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
                <CardTitle>Subtopics</CardTitle>
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
