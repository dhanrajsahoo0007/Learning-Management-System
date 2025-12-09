import { CodeExecutor, ExecutionResult } from './types';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export class PythonExecutor implements CodeExecutor {
  private pyodideReady: Promise<any>;

  constructor() {
    this.pyodideReady = this.loadPyodideSDK();
  }

  private async loadPyodideSDK() {
    if (window.pyodide) return window.pyodide;

    // Load Pyodide script
    if (!document.getElementById('pyodide-script')) {
      const script = document.createElement('script');
      script.id = 'pyodide-script';
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Initialize Pyodide
    if (window.loadPyodide) {
      window.pyodide = await window.loadPyodide();
      return window.pyodide;
    }
  }

  async execute(code: string, stdin: string = ''): Promise<ExecutionResult> {
    try {
      const pyodide = await this.pyodideReady;
      
      // Capture stdout
      let output: string[] = [];
      pyodide.setStdout({ batched: (msg: string) => output.push(msg) });
      pyodide.setStderr({ batched: (msg: string) => output.push(msg) }); // Treat stderr as output for simplicity

      // Handle stdin if needed (Mocking input not fully supported in simple execution, 
      // typically requires SharedArrayBuffer or custom input handler. 
      // For now, we inject input as variables or skip).
      
      const startTime = performance.now();
      await pyodide.runPythonAsync(code);
      const endTime = performance.now();

      return {
        output: output.join('\\n'),
        error: null,
        status: 'Accepted',
        executionTime: endTime - startTime
      };

    } catch (err: any) {
      return {
        output: '',
        error: err.toString(),
        status: 'Error',
        executionTime: 0
      };
    }
  }
}
