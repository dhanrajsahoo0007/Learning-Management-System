import type { ComponentType } from 'react';
import { RecsPipelineAnimation } from './RecsPipelineAnimation';
import { GeoHashGridAnimation } from './GeoHashGridAnimation';
import { SwipeMatchAnimation } from './SwipeMatchAnimation';
import { HotCellAnimation } from './HotCellAnimation';

const LESSON_ANIMATIONS: Record<string, ComponentType<{ playing?: boolean }>> = {
  'recs-pipeline': RecsPipelineAnimation,
  geohash: GeoHashGridAnimation,
  'swipe-match': SwipeMatchAnimation,
  'hot-cell': HotCellAnimation,
};

export function LessonAnimation({ id, playing = true }: { id?: string; playing?: boolean }) {
  if (!id) return null;
  const Animation = LESSON_ANIMATIONS[id];
  if (!Animation) return null;
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <Animation playing={playing} />
    </div>
  );
}

export function hasLessonAnimation(id?: string) {
  return Boolean(id && LESSON_ANIMATIONS[id]);
}
