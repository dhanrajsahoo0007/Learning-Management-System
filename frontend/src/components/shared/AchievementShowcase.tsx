import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Trophy, Star, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Achievement } from '@/api/gamification';

const RARITY_ACCENT: Record<Achievement['rarity'], string> = {
  common: 'text-muted-foreground',
  rare: 'text-primary',
  epic: 'text-purple-500',
  legendary: 'text-warning',
};

const RARITY_BADGE: Record<Achievement['rarity'], 'secondary' | 'default' | 'warning'> = {
  common: 'secondary',
  rare: 'default',
  epic: 'default',
  legendary: 'warning',
};

const RARITY_ICON: Record<Achievement['rarity'], typeof Star> = {
  common: Star,
  rare: Award,
  epic: Trophy,
  legendary: Crown,
};

function isUnlocked(achievement: Achievement) {
  return Boolean(achievement.unlockedAt);
}

function formatUnlockedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

interface AchievementShowcaseProps {
  showUnlockedOnly?: boolean;
  maxItems?: number;
  className?: string;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  showUnlockedOnly = false,
  maxItems,
  className,
}) => {
  const { stats } = useGamification();
  const reduced = usePrefersReducedMotion();

  const filtered = showUnlockedOnly ? stats.achievements.filter(isUnlocked) : stats.achievements;
  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered;

  if (displayed.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Trophy className="mx-auto mb-3 size-10 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">
            {showUnlockedOnly ? 'No achievements unlocked yet' : 'Loading achievements...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {displayed.map((achievement, index) => {
        const unlocked = isUnlocked(achievement);
        const accent = RARITY_ACCENT[achievement.rarity];
        const RarityIcon = RARITY_ICON[achievement.rarity];
        const unlockedOn = unlocked ? formatUnlockedAt(achievement.unlockedAt) : null;

        return (
          <motion.div
            key={achievement.achievementId ?? achievement.id}
            initial={reduced ? false : { scale: 0.94 }}
            animate={{ scale: 1 }}
            transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              className={cn(
                'relative h-full transition-colors',
                unlocked ? 'border-primary/30 bg-card' : 'bg-muted/30 opacity-70'
              )}
            >
              {unlocked && (
                <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3.5" aria-hidden />
                </span>
              )}

              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn('text-2xl leading-none', unlocked ? accent : 'text-muted-foreground')}>
                    {achievement.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4
                        className={cn(
                          'truncate text-sm font-semibold',
                          unlocked ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {achievement.title}
                      </h4>
                      <RarityIcon
                        className={cn('size-4 shrink-0', unlocked ? accent : 'text-muted-foreground')}
                        aria-hidden
                      />
                    </div>

                    <p className="mb-2 text-xs text-muted-foreground">{achievement.description}</p>

                    <Badge variant={RARITY_BADGE[achievement.rarity]} className="capitalize">
                      {achievement.rarity}
                    </Badge>

                    {unlockedOn && (
                      <p className="mt-2 text-xs text-muted-foreground">Unlocked {unlockedOn}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export const XPLevelDisplay: React.FC<{ className?: string }> = ({ className }) => {
  const { stats } = useGamification();

  const xpForCurrentLevel = (stats.level - 1) * 100;
  const xpForNextLevel = stats.level * 100;
  const currentLevelXP = stats.xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXP / xpNeededForNextLevel) * 100));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="size-5 text-warning" aria-hidden />
          <span>Level {stats.level}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">XP: {stats.xp}</span>
            <span className="text-muted-foreground">{xpForNextLevel} XP to next level</span>
          </div>

          <Progress value={progressPercent} />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {currentLevelXP} / {xpNeededForNextLevel} XP
            </span>
            <span>{Math.max(0, xpNeededForNextLevel - currentLevelXP)} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
