import { CodeExecutor, ExecutionMode, ExecutionResult } from './types';
import { JavascriptExecutor } from './jsExecutor';
import { PythonExecutor } from './pythonExecutor';
import { RemoteExecutor } from './remoteExecutor';

const jsExecutor = new JavascriptExecutor();
const pythonExecutor = new PythonExecutor();
const remoteExecutor = new RemoteExecutor();

export class ExecutionManager {
  static async execute(
    code: string,
    language: string,
    stdin: string = '',
    mode: ExecutionMode = 'browser'
  ): Promise<ExecutionResult> {
    
    // 1. Browser Mode Preference
    if (mode === 'browser') {
      if (language === 'javascript') {
        return jsExecutor.execute(code, stdin);
      }
      if (language === 'python') {
        return pythonExecutor.execute(code, stdin);
      }
      // Fallback to cloud for unsupported browser languages (Java, C++)
      // Or we could return an error "Browser execution not supported for this language"
      // But typically hybrid means "use browser if possible, else cloud"
    }

    // 2. Cloud Mode (or Fallback)
    // RemoteExecutor needs language passed to it. 
    // Since our interface defined execute(code, stdin), 
    // we cast remoteExecutor to access the extended method or update the interface.
    // For simplicity, we just call the underlying executeCode directly or fix RemoteExecutor.
    
    return remoteExecutor.execute(code, stdin, language);
  }
}
