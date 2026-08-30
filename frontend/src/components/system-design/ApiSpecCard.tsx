import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ApiEndpoint } from '@/data/systemDesignTypes';
import { CopyButton } from './CopyButton';

const METHOD_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'> = {
  GET: 'secondary',
  POST: 'success',
  PATCH: 'warning',
  PUT: 'warning',
  DELETE: 'danger',
};

export function ApiSpecCard({ api }: { api: ApiEndpoint }) {
  const expandable = Boolean(api.request || api.response || api.errors);
  const [open, setOpen] = useState(false);
  const variant = METHOD_VARIANT[api.method.toUpperCase()] ?? 'outline';

  return (
    <Collapsible open={expandable ? open : false} onOpenChange={setOpen}>
      <div className="group/api relative rounded-lg border border-border bg-muted/30">
        <div className="absolute top-2 right-9 opacity-0 transition-opacity duration-200 group-hover/api:opacity-100 focus-within:opacity-100">
          <CopyButton value={api.path} label="Copy path" />
        </div>
        <CollapsibleTrigger
          disabled={!expandable}
          className={cn(
            'flex w-full items-start gap-3 p-3 text-left',
            expandable && 'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <Badge variant={variant} className="mt-0.5 font-mono">
            {api.method}
          </Badge>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm text-foreground">{api.path}</p>
            <p className="mt-1 text-sm text-muted-foreground">{api.description}</p>
          </div>
          {expandable && (
            <ChevronDown
              className={cn('mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
              aria-hidden
            />
          )}
        </CollapsibleTrigger>
        {expandable && (
          <CollapsibleContent>
            <div className="space-y-3 border-t border-border px-3 py-3">
              <JsonBlock label="Request" value={api.request} />
              <JsonBlock label="Response" value={api.response} />
              <JsonBlock label="Errors" value={api.errors} />
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}

function JsonBlock({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <pre className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed text-foreground">
        {value}
      </pre>
    </div>
  );
}
