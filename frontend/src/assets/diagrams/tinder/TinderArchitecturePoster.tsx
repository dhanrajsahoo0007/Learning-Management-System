import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const SERVICES = ['Profile', 'Location', 'Recs', 'Swipe / Match', 'Chat', 'Notify'];
const STORES = ['Redis GEO · seen · last-active', 'Postgres', 'Kafka events'];
const EDGES = ['Photos: S3 + CDN', 'Push: APNs / FCM'];

export function TinderArchitecturePoster() {
  return (
    <div className="space-y-3" role="img" aria-label="Tinder high-level architecture">
      <Layer>
        <Box accent>Mobile clients</Box>
      </Layer>
      <Arrow />
      <Layer>
        <Box>API Gateway · auth · rate limits</Box>
      </Layer>
      <Arrow />
      <Layer className="grid-cols-2 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <Box key={service}>{service}</Box>
        ))}
      </Layer>
      <Arrow />
      <Layer className="grid-cols-1 sm:grid-cols-3">
        {STORES.map((store) => (
          <Box key={store} muted>
            {store}
          </Box>
        ))}
      </Layer>
      <Arrow />
      <Layer className="grid-cols-1 sm:grid-cols-2">
        {EDGES.map((edge) => (
          <Box key={edge} muted>
            {edge}
          </Box>
        ))}
      </Layer>
    </div>
  );
}

function Layer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-2', className)}>{children}</div>;
}

function Box({
  children,
  accent,
  muted,
}: {
  children: ReactNode;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-center text-sm font-medium',
        accent && 'border-primary bg-primary text-primary-foreground',
        muted && 'border-border bg-muted/50 text-foreground',
        !accent && !muted && 'border-primary/40 bg-primary/5 text-foreground'
      )}
    >
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-muted-foreground" aria-hidden>
      ↓
    </div>
  );
}
