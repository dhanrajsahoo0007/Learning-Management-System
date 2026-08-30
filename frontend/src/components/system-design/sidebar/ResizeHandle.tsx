import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const SIDEBAR_MIN = 240;
export const SIDEBAR_MAX = 440;
export const SIDEBAR_DEFAULT = 300;
export const SIDEBAR_WIDTH_KEY = 'sd-sidebar-width';

interface ResizeHandleProps {
  width: number;
  onWidthChange: (width: number) => void;
}

export function ResizeHandle({ width, onWidthChange }: ResizeHandleProps) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  const clamp = (value: number) => Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, value));

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!dragging.current) return;
      const next = clamp(startWidth.current + (event.clientX - startX.current));
      onWidthChange(next);
    },
    [onWidthChange]
  );

  const stopDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDrag);
    };
  }, [onPointerMove, stopDrag]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize course outline"
      aria-valuemin={SIDEBAR_MIN}
      aria-valuemax={SIDEBAR_MAX}
      aria-valuenow={Math.round(width)}
      tabIndex={0}
      onPointerDown={(event) => {
        dragging.current = true;
        startX.current = event.clientX;
        startWidth.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          onWidthChange(clamp(width - 16));
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          onWidthChange(clamp(width + 16));
        }
      }}
      className={cn(
        'group absolute inset-y-0 right-0 z-10 w-3 cursor-col-resize touch-none',
        'flex items-center justify-center focus-visible:outline-none'
      )}
    >
      <span
        className="grid grid-cols-2 gap-0.5 rounded-sm p-0.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="h-1 w-1 rounded-full bg-border" />
        ))}
      </span>
    </div>
  );
}

export function readSidebarWidth(): number {
  try {
    const raw = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const parsed = raw ? Number(raw) : SIDEBAR_DEFAULT;
    if (Number.isNaN(parsed)) return SIDEBAR_DEFAULT;
    return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, parsed));
  } catch {
    return SIDEBAR_DEFAULT;
  }
}
