import React, { useState } from 'react';
import { Eye, Lightbulb, Play, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeEditor } from '@/components/ui/CodeEditor';
import type { DSATopic } from '@/data/dsaData';
import { ExecutionManager } from '@/lib/executors';
import type { ExecutionMode, ExecutionResult } from '@/lib/executors/types';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

const FALLBACK_TEMPLATES: Record<Language, string> = {
  javascript: '// Write your code here',
  python: '# Write your code here',
  java: '// Write your code here',
  cpp: '// Write your code here',
};

export const CodePlayground: React.FC<{ topic: DSATopic }> = ({ topic }) => {
  const templates = topic.content.codeTemplates ?? FALLBACK_TEMPLATES;

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(
    templates[selectedLanguage] || FALLBACK_TEMPLATES[selectedLanguage]
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('browser');

  const handleLanguageChange = (value: string) => {
    const lang = value as Language;
    setSelectedLanguage(lang);
    setCode(templates[lang] || FALLBACK_TEMPLATES[lang]);
    setOutput('');
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(`Running in ${executionMode} mode...`);

    try {
      const input = topic.content.testCases?.[0]?.input || '';
      const result = await ExecutionManager.execute(code, selectedLanguage, input, executionMode);
      setExecutionResult(result);
      setOutput(result.error ? `Status: ${result.status}\nError:\n${result.error}` : result.output);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(templates[selectedLanguage] || FALLBACK_TEMPLATES[selectedLanguage]);
    setOutput('');
    setExecutionResult(null);
  };

  const hints = topic.content.hints ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="dsa-language">Language</Label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="dsa-language" size="sm" className="w-36">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={executionMode} onValueChange={(value) => setExecutionMode(value as ExecutionMode)}>
            <TabsList aria-label="Execution mode">
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint((v) => !v)}
            aria-expanded={showHint}
          >
            <Lightbulb className="size-4" aria-hidden />
            {showHint ? 'Hide hint' : 'Show hint'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSolution((v) => !v)}
            aria-expanded={showSolution}
          >
            <Eye className="size-4" aria-hidden />
            {showSolution ? 'Hide solution' : 'Show solution'}
          </Button>
        </div>
      </div>

      {showHint && (
        <Alert variant="warning">
          <Lightbulb aria-hidden />
          <AlertTitle>Hint</AlertTitle>
          <AlertDescription>
            {hints.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4">
                {hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            ) : (
              <p>No hints available for this problem.</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {showSolution && (
        <Alert variant="success">
          <Eye aria-hidden />
          <AlertTitle>Solution approach</AlertTitle>
          <AlertDescription>
            <p>{topic.content.solution}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground">Code editor</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleResetCode} disabled={isRunning}>
                <RotateCcw className="size-4" aria-hidden />
                Reset
              </Button>
              <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
                <Play className="size-4" aria-hidden />
                {isRunning ? 'Running…' : 'Run code'}
              </Button>
            </div>
          </div>

          <CodeEditor
            value={code}
            onChange={(val) => setCode(val || '')}
            language={selectedLanguage}
            height="400px"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Output and test cases</h3>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Console output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                aria-live="polite"
                className="min-h-[120px] overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-sm whitespace-pre-wrap text-foreground"
              >
                {output || 'Click “Run code” to execute your solution…'}
              </pre>
              {executionResult && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Execution time: {executionResult.executionTime}ms
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test cases</CardTitle>
            </CardHeader>
            <CardContent>
              {topic.content.testCases?.length ? (
                <div className="space-y-3">
                  {topic.content.testCases.map((testCase, index) => (
                    <div key={index} className="rounded-lg border border-border p-3">
                      <p className="mb-1 text-sm text-muted-foreground">Input: {testCase.input}</p>
                      <p className="text-sm text-foreground">Expected: {testCase.expectedOutput}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No test cases for this topic yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
