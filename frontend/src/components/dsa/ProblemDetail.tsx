import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  FileCode2,
  Import,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CodePlayground, STARTER_TEMPLATES } from './CodePlayground';
import type { Language } from './CodePlayground';
import { difficultyVariant } from './TopicCard';
import { dsaService } from '@/api/dsa';
import type { DSAProblem, DSAProblemSummary } from '@/types/dsa';
import { isProblemOpenable } from '@/types/dsa';
import type { DSATopic } from '@/data/dsaData';
import { cn } from '@/lib/utils';

function difficultyOf(problem: DSAProblem, topic: DSATopic | null): DSATopic['difficulty'] {
  const value = problem.difficulty || topic?.difficulty || 'Medium';
  return (['Easy', 'Medium', 'Hard'].includes(value) ? value : 'Medium') as DSATopic['difficulty'];
}

export const ProblemDetail: React.FC = () => {
  // The route is /dsa/problem/* because ids are slash-separated paths.
  const params = useParams();
  const problemId = params['*'] ?? '';
  const navigate = useNavigate();

  const [problem, setProblem] = useState<DSAProblem | null>(null);
  const [topic, setTopic] = useState<DSATopic | null>(null);
  const [siblings, setSiblings] = useState<DSAProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSolution, setShowSolution] = useState(false);
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(STARTER_TEMPLATES.python);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!problemId) return;
      setLoading(true);
      setShowSolution(false);
      try {
        const loaded = await dsaService.getProblem(problemId);
        if (cancelled) return;
        setProblem(loaded);
        setCode(STARTER_TEMPLATES.python);
        setLanguage('python');

        // Fetched for the breadcrumb and for previous/next navigation.
        const [loadedTopic, loadedSiblings] = await Promise.allSettled([
          dsaService.getById(loaded.topicId),
          dsaService.getProblems(loaded.topicId),
        ]);
        if (cancelled) return;
        if (loadedTopic.status === 'fulfilled') setTopic(loadedTopic.value);
        if (loadedSiblings.status === 'fulfilled') setSiblings(loadedSiblings.value);
      } catch (error) {
        console.error('Failed to fetch problem:', error);
        if (!cancelled) setProblem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [problemId]);

  const { previous, next } = useMemo(() => {
    const openable = siblings.filter(isProblemOpenable);
    const index = openable.findIndex((item) => item.id === problemId);
    return {
      previous: index > 0 ? openable[index - 1] : null,
      next: index >= 0 && index < openable.length - 1 ? openable[index + 1] : null,
    };
  }, [siblings, problemId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Problem not found</h2>
        <p className="mb-6 text-muted-foreground">
          This problem does not exist or has not been imported yet.
        </p>
        <Button onClick={() => navigate('/dsa')}>
          <ArrowLeft className="size-4" aria-hidden />
          Back to DSA
        </Button>
      </div>
    );
  }

  const solutions = problem.solutions;
  const hasSolution = solutions.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        onClick={() => navigate(`/dsa/${problem.topicId}`)}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to {topic?.title ?? 'topic'}
      </Button>

      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/dsa" className="hover:text-foreground">
              DSA
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to={`/dsa/${problem.topicId}`} className="hover:text-foreground">
              {topic?.title ?? problem.topicId}
            </Link>
          </li>
          {problem.sectionPath.map((section) => (
            <React.Fragment key={section}>
              <li aria-hidden>/</li>
              <li>{section}</li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{problem.title}</h1>
        <Badge variant={difficultyVariant(difficultyOf(problem, topic))}>
          {difficultyOf(problem, topic)}
        </Badge>
        {!hasSolution && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" aria-hidden />
            Solution coming soon
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {problem.statement ? (
          <Card>
            <CardHeader>
              <CardTitle>Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {problem.statement}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <FileCode2 aria-hidden />
            <AlertTitle>No write-up yet</AlertTitle>
            <AlertDescription>
              This problem is part of the curriculum but its file does not include a description.
            </AlertDescription>
          </Alert>
        )}

        {problem.examples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {problem.examples.map((example, index) => (
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
                    {example.explanation && (
                      <div className="flex flex-wrap items-baseline gap-2">
                        <dt className="font-medium text-foreground">Explanation:</dt>
                        <dd className="text-muted-foreground">{example.explanation}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {problem.constraints && (
          <Card>
            <CardHeader>
              <CardTitle>Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                {problem.constraints}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your solution</CardTitle>
          </CardHeader>
          <CardContent>
            <CodePlayground
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={(next) => {
                setLanguage(next);
                setCode(STARTER_TEMPLATES[next]);
              }}
              onReset={() => setCode(STARTER_TEMPLATES[language])}
            />
          </CardContent>
        </Card>

        {hasSolution && (
          <Card>
            <CardHeader>
              <CardTitle>
                Reference {solutions.length > 1 ? `solutions (${solutions.length})` : 'solution'}
              </CardTitle>
              <CardDescription>
                Try the problem yourself first, then compare against the worked solution.
              </CardDescription>
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution((value) => !value)}
                  aria-expanded={showSolution}
                >
                  {showSolution ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  {showSolution ? 'Hide solution' : 'Show solution'}
                </Button>
              </CardAction>
            </CardHeader>
            {showSolution && (
              <CardContent>
                <Tabs defaultValue={solutions[0].name || 'solution-0'}>
                  {solutions.length > 1 && (
                    <TabsList className="mb-4 flex-wrap" aria-label="Solution approaches">
                      {solutions.map((solution, index) => (
                        <TabsTrigger
                          key={index}
                          value={solution.name || `solution-${index}`}
                          className="font-mono text-xs"
                        >
                          {solution.name || `Approach ${index + 1}`}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  )}
                  {solutions.map((solution, index) => (
                    <TabsContent
                      key={index}
                      value={solution.name || `solution-${index}`}
                      className="space-y-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {solution.complexity?.time && (
                          <Badge variant="secondary">Time {solution.complexity.time}</Badge>
                        )}
                        {solution.complexity?.space && (
                          <Badge variant="secondary">Space {solution.complexity.space}</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            setLanguage('python');
                            setCode(solution.code);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <Import className="size-4" aria-hidden />
                          Load into editor
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
                        <code>{solution.code}</code>
                      </pre>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            )}
          </Card>
        )}

        {problem.notes && <NotesCard notes={problem.notes} />}

        <nav className="flex items-center justify-between gap-4 border-t border-border pt-6">
          {previous ? (
            <Button variant="outline" asChild className="max-w-[45%]">
              <Link to={`/dsa/problem/${previous.id}`}>
                <ArrowLeft className="size-4" aria-hidden />
                <span className="truncate">{previous.title}</span>
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button variant="outline" asChild className="ml-auto max-w-[45%]">
              <Link to={`/dsa/problem/${next.id}`}>
                <span className="truncate">{next.title}</span>
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
};

const NotesCard: React.FC<{ notes: string }> = ({ notes }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto w-full justify-between px-6 py-4 text-left">
            <span className="font-semibold">Author&rsquo;s notes</span>
            <ChevronDown
              className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {notes}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
