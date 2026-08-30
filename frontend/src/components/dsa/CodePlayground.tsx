import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { ExecutionManager } from '@/lib/executors';
import type { ExecutionMode, ExecutionResult } from '@/lib/executors/types';

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
] as const;

export type Language = (typeof LANGUAGES)[number]['value'];

export const STARTER_TEMPLATES: Record<Language, string> = {
  javascript: '// Write your solution here',
  python: '# Write your solution here',
  java: '// Write your solution here',
  cpp: '// Write your solution here',
};

interface CodePlaygroundProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  /** Restores the editor to the problem's starting point. */
  onReset: () => void;
  testCases?: Array<{ input: string; expectedOutput: string }>;
}

/**
 * Editor, runner and output panel. Code and language are controlled by the
 * parent so a solution can be loaded into the editor from outside.
 */
export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onReset,
  testCases = [],
}) => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('browser');

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(`Running in ${executionMode} mode...`);

    try {
      const input = testCases[0]?.input || '';
      const result = await ExecutionManager.execute(code, language, input, executionMode);
      setExecutionResult(result);
      setOutput(result.error ? `Status: ${result.status}\nError:\n${result.error}` : result.output);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    onReset();
    setOutput('');
    setExecutionResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="dsa-language">Language</Label>
            <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
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

          <Tabs
            value={executionMode}
            onValueChange={(value) => setExecutionMode(value as ExecutionMode)}
          >
            <TabsList aria-label="Execution mode">
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={isRunning}>
            <RotateCcw className="size-4" aria-hidden />
            Reset
          </Button>
          <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
            <Play className="size-4" aria-hidden />
            {isRunning ? 'Running…' : 'Run code'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CodeEditor
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          language={language}
          height="420px"
        />

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
      </div>
    </div>
  );
};
