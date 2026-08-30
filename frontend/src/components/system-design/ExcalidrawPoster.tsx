import { useState, type ReactNode } from 'react';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ExcalidrawPoster({
  title,
  caption,
  children,
  className,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Maximize2 className="size-3.5" aria-hidden />
          Expand
        </Button>
      </div>
      <div className="overflow-x-auto p-4">{children}</div>
      {caption && <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{caption}</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">{children}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
