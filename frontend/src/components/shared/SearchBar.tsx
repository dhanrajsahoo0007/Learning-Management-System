import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAllTopics, getTopicPath } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function SearchBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const topics = useMemo(() => getAllTopics(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-64 justify-start text-muted-foreground sm:inline-flex"
      >
        <Search className="size-4" />
        Search chapters...
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search chapters"
      >
        <Search className="size-4" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search chapters"
        description="Jump to a system design lesson"
      >
        <CommandInput placeholder="Search our lessons..." />
        <CommandList>
          <CommandEmpty>No lessons match that search.</CommandEmpty>
          <CommandGroup heading="Lessons">
            {topics.map((topic) => (
              <CommandItem
                key={topic.id}
                value={`${topic.title} ${topic.description}`}
                onSelect={() => {
                  setOpen(false);
                  navigate(getTopicPath(topic));
                }}
              >
                {topic.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
