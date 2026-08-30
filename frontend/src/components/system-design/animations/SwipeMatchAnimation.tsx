import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const PHASES = ['idle', 'aLikes', 'bLikes', 'match'] as const;

export function SwipeMatchAnimation({ playing = true }: { playing?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<(typeof PHASES)[number]>(reduced ? 'match' : 'idle');

  useEffect(() => {
    if (reduced || !playing) {
      setPhase('match');
      return;
    }
    setPhase('idle');
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % PHASES.length;
      setPhase(PHASES[index]);
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  const matched = phase === 'match';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <PersonCard name="Alex" liked={phase === 'aLikes' || phase === 'bLikes' || matched} />
        <motion.div
          animate={{ scale: matched ? 1 : 0.9, opacity: matched ? 1 : 0.4 }}
          className={cn(
            'flex size-12 items-center justify-center rounded-full border',
            matched ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
          )}
          aria-hidden
        >
          {matched ? <MessageCircle className="size-5" /> : <Heart className="size-5" />}
        </motion.div>
        <PersonCard name="Blake" liked={phase === 'bLikes' || matched} />
      </div>
      <p className="text-sm text-muted-foreground">
        {phase === 'idle' && 'No like yet. The reverse edge does not exist, so there is no conversation.'}
        {phase === 'aLikes' && 'Alex likes Blake. Write the swipe. Check likes(Blake → Alex). Miss — no match.'}
        {phase === 'bLikes' && 'Blake likes Alex. Same check now hits. Create exactly one match row for (min, max).'}
        {phase === 'match' && 'Compare-and-set on (user_min, user_max) prevents two chats if both likes land together.'}
      </p>
    </div>
  );
}

function PersonCard({ name, liked }: { name: string; liked: boolean }) {
  return (
    <motion.div
      animate={{ x: liked ? 4 : 0 }}
      className={cn(
        'min-w-28 rounded-xl border px-4 py-3',
        liked ? 'border-primary bg-primary/10' : 'border-border bg-card'
      )}
    >
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{liked ? 'Liked' : 'Browsing'}</p>
    </motion.div>
  );
}
