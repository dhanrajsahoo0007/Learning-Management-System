import type { FC } from 'react';
import { MermaidDiagram, looksLikeMermaid } from './MermaidDiagram';

export const DiagramBlock: FC<{ diagram?: string; title?: string }> = ({
  diagram,
  title = 'Architecture',
}) => {
  if (!diagram) return null;

  const mermaid = looksLikeMermaid(diagram);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title} diagram
      </div>
      <div className="p-4">
        {mermaid ? (
          <MermaidDiagram source={diagram} />
        ) : (
          <pre className="overflow-x-auto whitespace-pre font-mono text-sm leading-relaxed text-foreground">
            {diagram}
          </pre>
        )}
      </div>
    </div>
  );
};
