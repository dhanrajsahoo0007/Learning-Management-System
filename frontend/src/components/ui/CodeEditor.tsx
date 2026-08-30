import React, { useRef, useEffect } from 'react';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Configure loader to use local monaco instance instead of CDN
loader.config({ monaco });

const DARK_THEME = 'learning-management-dark';
const LIGHT_THEME = 'learning-management-light';

/**
 * Monaco only accepts hex colors, but the design tokens are authored in oklch.
 * Canvas does the color-space conversion for us.
 */
function tokenToHex(variable: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (!raw) return fallback;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return fallback;
  try {
    ctx.fillStyle = '#000000';
    ctx.fillStyle = raw;
  } catch {
    return fallback;
  }
  const resolved = ctx.fillStyle;
  return typeof resolved === 'string' && /^#[0-9a-f]{6}$/i.test(resolved) ? resolved : fallback;
}

function applyThemes(m: Monaco) {
  const isDark = document.documentElement.classList.contains('dark');

  m.editor.defineTheme(isDark ? DARK_THEME : LIGHT_THEME, {
    base: isDark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': tokenToHex('--card', isDark ? '#1c1c1e' : '#ffffff'),
      'editor.foreground': tokenToHex('--card-foreground', isDark ? '#fafafa' : '#0a0a0a'),
      'editor.lineHighlightBackground': tokenToHex('--muted', isDark ? '#2c2c2e' : '#f2f2f7'),
      'editorLineNumber.foreground': tokenToHex('--muted-foreground', isDark ? '#8e8e93' : '#6e6e73'),
      'editorGutter.background': tokenToHex('--card', isDark ? '#1c1c1e' : '#ffffff'),
    },
  });

  m.editor.setTheme(isDark ? DARK_THEME : LIGHT_THEME);
}

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
  readOnly = false,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = (editor: any, m: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = m;
    applyThemes(m);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const themeChanged = mutations.some((m) => m.attributeName === 'class');
      const m = monacoRef.current ?? (window as any).monaco;
      if (themeChanged && m) applyThemes(m);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-border bg-card', className)}>
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex h-full w-full items-center justify-center bg-card">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
              <span className="text-sm font-medium text-muted-foreground">Initializing editor…</span>
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
    </div>
  );
};
