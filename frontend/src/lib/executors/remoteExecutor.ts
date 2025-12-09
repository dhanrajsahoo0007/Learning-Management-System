import { CodeExecutor, ExecutionResult } from './types';
import { executeCode } from '../../api/judge0';

export class RemoteExecutor implements CodeExecutor {
  async execute(code: string, stdin: string = '', language: string): Promise<ExecutionResult> {
    // Map generic language name to Judge0 key if needed, or assume caller passes correct key
    // executeCode expects 'javascript' | 'python' | 'java' | 'cpp'
    const result = await executeCode(code, language as any, stdin);
    
    return {
      output: result.output,
      error: result.error,
      status: result.status === 'Accepted' ? 'Accepted' : 'Error', // Simplified mapping
      executionTime: result.executionTime
    };
  }
}
