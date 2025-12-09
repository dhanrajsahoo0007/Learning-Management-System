export interface ExecutionResult {
  output: string;
  error: string | null;
  status: 'Accepted' | 'Error' | 'Timeout';
  executionTime: number;
}

export interface CodeExecutor {
  execute(code: string, stdin?: string): Promise<ExecutionResult>;
}

export type ExecutionMode = 'browser' | 'cloud';
