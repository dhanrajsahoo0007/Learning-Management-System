import React, { useRef, useEffect } from 'react';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Configure loader to use local monaco instance instead of CDN
loader.config({ monaco });

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  height?: string;
  className?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '300px',
  className,
  readOnly = false
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure Monaco Editor
    monaco.editor.defineTheme('learning-management-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1C1C1E', // System Gray 6 Dark
        'editor.lineHighlightBackground': '#2C2C2E',
      }
    });

    monaco.editor.defineTheme('learning-management-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#FFFFFF', // Clean White
        'editor.lineHighlightBackground': '#F2F2F7',
      }
    });

    // Set initial theme
    const isDark = document.documentElement.classList.contains('dark');
    monaco.editor.setTheme(isDark ? 'learning-management-dark' : 'learning-management-light');
  };

  useEffect(() => {
    // Observer for dark mode class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          const monaco = (window as any).monaco;
          if (monaco) {
             monaco.editor.setTheme(isDark ? 'learning-management-dark' : 'learning-management-light');
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  return (
    <motion.div
      className={cn('rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-gray-50 dark:bg-[#1C1C1E]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="text-sm font-medium text-gray-500">Initializing Editor...</span>
            </div>
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "SF Mono, Menlo, Monaco, 'Courier New', monospace",
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          readOnly,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
        }}
      />
    </motion.div>
  );
};
