import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
}

interface TopTabsProps {
  tabs: TabItem[];
  className?: string;
}

export function TopTabs({ tabs, className }: TopTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = tabs.find((tab) => location.pathname.startsWith(tab.path))?.id ?? tabs[0]?.id;

  if (!tabs.length) return null;

  return (
    <Tabs value={active} onValueChange={(id) => {
      const next = tabs.find((tab) => tab.id === id);
      if (next) navigate(next.path);
    }} className={cn(className)}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
