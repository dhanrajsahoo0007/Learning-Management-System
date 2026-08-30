import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      onClick={(event) => {
        event.stopPropagation();
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1200);
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
    >
      <motion.span
        key={copied ? 'done' : 'idle'}
        initial={{ scale: 0.75 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-1"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-primary" aria-hidden />
            Copied
          </>
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </motion.span>
    </button>
  );
}
