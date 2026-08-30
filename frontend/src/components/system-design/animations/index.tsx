import type { ComponentType } from 'react';
import { RecsPipelineAnimation } from './RecsPipelineAnimation';
import { GeoHashGridAnimation } from './GeoHashGridAnimation';
import { SwipeMatchAnimation } from './SwipeMatchAnimation';
import { HotCellAnimation } from './HotCellAnimation';
import { FlowAnimation } from './FlowAnimation';
import { FLOW_SPECS } from './flows';

const LESSON_ANIMATIONS: Record<string, ComponentType<{ playing?: boolean }>> = {
  'recs-pipeline': RecsPipelineAnimation,
  geohash: GeoHashGridAnimation,
  'swipe-match': SwipeMatchAnimation,
  'hot-cell': HotCellAnimation,
};

export function LessonAnimation({ id, playing = true }: { id?: string; playing?: boolean }) {
  if (!id) return null;

  const Animation = LESSON_ANIMATIONS[id];
  const flow = FLOW_SPECS[id];
  if (!Animation && !flow) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      {Animation ? (
        <Animation playing={playing} />
      ) : (
        <FlowAnimation nodes={flow.nodes} phases={flow.phases} playing={playing} />
      )}
    </div>
  );
}

export function hasLessonAnimation(id?: string) {
  return Boolean(id && (LESSON_ANIMATIONS[id] || FLOW_SPECS[id]));
}
