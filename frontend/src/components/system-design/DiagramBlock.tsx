import React from 'react';

export const DiagramBlock: React.FC<{ diagram?: string; title?: string }> = ({
  diagram,
  title = 'Architecture',
}) => {
  if (!diagram) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
        {title} diagram
      </div>
      <pre className="p-4 text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto font-mono whitespace-pre">
        {diagram}
      </pre>
    </div>
  );
};
