import axios from 'axios';

// Judge0 Language IDs
const LANGUAGE_IDS = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  java: 62,       // Java (OpenJDK 13.0.1)
  cpp: 54,        // C++ (GCC 9.2.0)
};

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
  status: string;
}

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY || '';

const api = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(JUDGE0_API_KEY ? {
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    } : {})
  },
});

export const executeCode = async (
  sourceCode: string,
  language: keyof typeof LANGUAGE_IDS,
  stdin: string = ''
): Promise<ExecutionResult> => {
  try {
    const languageId = LANGUAGE_IDS[language];
    
    // 1. Submit Code
    const submissionResponse = await api.post('/submissions', {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      base64_encoded: false,
      wait: false // Async execution
    });

    const token = submissionResponse.data.token;

    // 2. Poll for Status
    let result = null;
    let attempts = 0;
    const maxAttempts = 20; // 20 * 2s = 40s max wait

    while (attempts < maxAttempts) {
      const statusResponse = await api.get(`/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,time,compile_output`);
      result = statusResponse.data;

      // Status ID 1 (In Queue) or 2 (Processing)
      if (result.status.id <= 2) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        attempts++;
        continue;
      }
      break;
    }

    if (!result) {
      throw new Error('Execution timed out');
    }

    // 3. Format Result
    // If output is null (e.g. compilation error), check compile_output or stderr
    const output = result.stdout || result.compile_output || '';
    const error = result.stderr || (result.status.id >= 6 ? result.status.description : null);

    return {
      output: output,
      error: error,
      executionTime: parseFloat(result.time || '0') * 1000, // Convert s to ms
      status: result.status.description
    };

  } catch (error: any) {
    console.error('Judge0 Execution Error:', error);
    const errorMessage = error.message === 'Network Error' 
      ? 'Network Error: CORS blocked or API unreachable. If using the default demo API, it may be rate-limited. Try again or check console.'
      : (error.response?.data?.message || error.message || 'Failed to execute code');

    return {
      output: '',
      error: errorMessage,
      executionTime: 0,
      status: 'Error'
    };
  }
};
