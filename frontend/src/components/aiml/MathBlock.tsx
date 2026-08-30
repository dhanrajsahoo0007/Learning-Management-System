import katex from 'katex';

function renderTex(tex: string, displayMode: boolean) {
  return katex.renderToString(tex, {
    throwOnError: false,
    displayMode,
  });
}

export function MathBlock({ tex }: { tex: string }) {
  return (
    <div
      className="overflow-x-auto py-2 text-foreground"
      dangerouslySetInnerHTML={{ __html: renderTex(tex, true) }}
    />
  );
}

export function InlineMath({ tex }: { tex: string }) {
  return (
    <span
      className="text-foreground"
      dangerouslySetInnerHTML={{ __html: renderTex(tex, false) }}
    />
  );
}
