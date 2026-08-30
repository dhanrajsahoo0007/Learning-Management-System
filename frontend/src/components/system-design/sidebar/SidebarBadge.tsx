import { cn } from '@/lib/utils';

type SidebarBadgeVariant = 'new' | 'practice';

const styles: Record<SidebarBadgeVariant, string> = {
  new: 'bg-emerald-500 text-white',
  practice: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
};

export function SidebarBadge({
  variant,
  children,
}: {
  variant: SidebarBadgeVariant;
  children: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        styles[variant]
      )}
    >
      {children}
    </span>
  );
}
