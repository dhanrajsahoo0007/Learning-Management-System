import { cn } from '@/lib/utils';
import { SYMBOL_GLYPHS, type SymbolType } from './glyphs';

const SIZES = { sm: 32, md: 48, lg: 64 } as const;

export function ArchitectureSymbol({
  type,
  size = 'md',
  label,
  className,
}: {
  type: SymbolType;
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  const px = SIZES[size];
  return (
    <span className={cn('inline-flex flex-col items-center gap-1 text-foreground', className)}>
      <svg
        viewBox="0 0 48 48"
        width={px}
        height={px}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? 'img' : 'presentation'}
        aria-label={label}
      >
        {SYMBOL_GLYPHS[type]}
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </span>
  );
}
