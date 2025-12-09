import { CodeExecutor, ExecutionResult } from './types';

// Web Worker code as a string to avoid external file loading issues
const workerScript = `
self.onmessage = function(e) {
  const { code, stdin } = e.data;
  let output = [];
  const originalConsoleLog = console.log;
  
  // Capture console.log
  console.log = function(...args) {
    output.push(args.join(' '));
  };

  try {
    // Basic sandboxing using Function constructor
    // Note: This is not a security boundary for malicious code, but isolates scope.
    const func = new Function(code);
    func();
    
    self.postMessage({ 
      status: 'Accepted', 
      output: output.join('\\n'), 
      error: null 
    });
  } catch (err) {
    self.postMessage({ 
      status: 'Error', 
      output: output.join('\\n'), 
      error: err.toString() 
    });
  } finally {
    console.log = originalConsoleLog;
  }
};
`;

export class JavascriptExecutor implements CodeExecutor {
  async execute(code: string, stdin?: string): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      const startTime = performance.now();

      // Timeout handler (5 seconds)
      const timeoutId = setTimeout(() => {
        worker.terminate();
        resolve({
          output: '',
          error: 'Execution Timed Out (5s limit)',
          status: 'Timeout',
          executionTime: 5000
        });
      }, 5000);

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        const endTime = performance.now();
        const { output, error, status } = e.data;
        worker.terminate();
        
        resolve({
          output,
          error,
          status,
          executionTime: endTime - startTime
        });
      };

      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        worker.terminate();
        resolve({
          output: '',
          error: 'Worker Error: ' + err.message,
          status: 'Error',
          executionTime: 0
        });
      };

      worker.postMessage({ code, stdin });
    });
  }
}
