import { Fragment, type ReactNode } from 'react';
import { InlineMath } from './MathBlock';

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$\n]+\$)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return <InlineMath key={index} tex={part.slice(1, -1)} />;
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

export function renderRich(text: string): ReactNode {
  return <RichText text={text} />;
}
