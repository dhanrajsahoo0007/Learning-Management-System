import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        'editor.background': '#1f2937',
      }
    });

    monaco.editor.defineTheme('learning-management-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      }
    });

    // Set theme based on system preference (will be updated by theme context)
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    monaco.editor.setTheme(isDark ? 'learning-management-dark' : 'learning-management-light');
  };

  useEffect(() => {
    // Update theme when system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (editorRef.current) {
        const monaco = (window as any).monaco;
        if (monaco) {
          monaco.editor.setTheme(mediaQuery.matches ? 'learning-management-dark' : 'learning-management-light');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
      className={cn('rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700', className)}
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
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          readOnly,
          theme: 'vs-dark'
        }}
      />
    </motion.div>
  );
};
