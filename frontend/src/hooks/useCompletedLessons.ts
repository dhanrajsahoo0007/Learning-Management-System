import { useMemo, useSyncExternalStore } from 'react';

export const COMPLETED_LESSONS_KEY = 'sd-completed-lessons';

const listeners = new Set<() => void>();
let cachedSnapshot: string | null = null;

function emit() {
  cachedSnapshot = null;
  listeners.forEach((listener) => listener());
}

function readRaw(): string {
  if (typeof window === 'undefined') return '[]';
  try {
    return window.localStorage.getItem(COMPLETED_LESSONS_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getSnapshot(): string {
  if (cachedSnapshot === null) {
    cachedSnapshot = readRaw();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): string {
  return '[]';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeIds(ids: string[]) {
  try {
    window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(ids));
  } catch {
    // Ignore quota / private mode failures.
  }
  emit();
}

export function useCompletedLessons() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const completed = useMemo(() => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return new Set<string>();
      return new Set(parsed.filter((id): id is string => typeof id === 'string'));
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const isComplete = (id: string) => completed.has(id);

  const markComplete = (id: string) => {
    if (completed.has(id)) return;
    writeIds([...completed, id]);
  };

  const toggleComplete = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeIds([...next]);
  };

  return { completed, isComplete, markComplete, toggleComplete };
}
