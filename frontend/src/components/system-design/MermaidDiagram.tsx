import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsDark } from '@/hooks/useIsDark';

const MERMAID_START = /^(flowchart|graph|sequenceDiagram|erDiagram|classDiagram|stateDiagram|journey|gantt|pie|mindmap|timeline|quadrantChart|gitGraph|C4Context|sankey)/;

export function looksLikeMermaid(source: string) {
  return MERMAID_START.test(source.trim());
}

export function MermaidDiagram({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const reactId = useId().replace(/:/g, '');
  const dark = useIsDark();
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const renderId = `mermaid-${reactId}-${dark ? 'dark' : 'light'}`;

    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: dark ? 'dark' : 'neutral',
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: { curve: 'basis', padding: 16 },
          themeVariables: dark
            ? {
                primaryColor: '#312e81',
                primaryTextColor: '#e2e8f0',
                primaryBorderColor: '#6366f1',
                lineColor: '#94a3b8',
                secondaryColor: '#1e293b',
                tertiaryColor: '#0f172a',
              }
            : {
                primaryColor: '#eef2ff',
                primaryTextColor: '#1e1b4b',
                primaryBorderColor: '#6366f1',
                lineColor: '#64748b',
                secondaryColor: '#f8fafc',
                tertiaryColor: '#fff',
              },
        });
        const { svg: nextSvg } = await mermaid.render(renderId, source.trim());
        if (!cancelled) {
          setSvg(nextSvg);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setSvg('');
          setError(err instanceof Error ? err.message : 'Could not render diagram');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, dark, reactId]);

  if (error) {
    return (
      <pre className="overflow-x-auto whitespace-pre rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground">
        {source}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className="flex h-40 items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground"
        aria-busy="true"
      >
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className={cn('mermaid-diagram overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
