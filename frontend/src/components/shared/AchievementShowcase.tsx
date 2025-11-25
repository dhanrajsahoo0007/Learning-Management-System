import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Star, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const rarityConfig = {
  common: { color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-gray-200 dark:border-gray-700' },
  rare: { color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900', borderColor: 'border-blue-200 dark:border-blue-800' },
  epic: { color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900', borderColor: 'border-purple-200 dark:border-purple-800' },
  legendary: { color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900', borderColor: 'border-yellow-200 dark:border-yellow-800' }
};

const rarityIcons = {
  common: Star,
  rare: Award,
  epic: Trophy,
  legendary: Crown
};

interface AchievementShowcaseProps {
  showUnlockedOnly?: boolean;
  maxItems?: number;
  className?: string;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  showUnlockedOnly = false,
  maxItems,
  className
}) => {
  const { stats } = useGamification();

  const filteredAchievements = showUnlockedOnly
    ? stats.achievements.filter(a => a.unlocked)
    : stats.achievements;

  const displayedAchievements = maxItems
    ? filteredAchievements.slice(0, maxItems)
    : filteredAchievements;

  if (displayedAchievements.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {showUnlockedOnly ? 'No achievements unlocked yet' : 'Loading achievements...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      <AnimatePresence>
        {displayedAchievements.map((achievement, index) => {
          const config = rarityConfig[achievement.rarity];
          const IconComponent = rarityIcons[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                'relative overflow-hidden transition-all duration-300',
                achievement.unlocked
                  ? `${config.bgColor} ${config.borderColor} shadow-lg`
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
              )}>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </motion.div>
                )}

                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      'text-2xl',
                      achievement.unlocked ? config.color : 'text-gray-400'
                    )}>
                      {achievement.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={cn(
                          'font-semibold text-sm',
                          achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                        )}>
                          {achievement.title}
                        </h4>
                        <IconComponent className={cn('w-4 h-4', config.color)} />
                      </div>

                      <p className={cn(
                        'text-xs mb-2',
                        achievement.unlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'
                      )}>
                        {achievement.description}
                      </p>

                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs capitalize',
                          config.color,
                          config.bgColor
                        )}
                      >
                        {achievement.rarity}
                      </Badge>

                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Glow effect for unlocked achievements */}
                {achievement.unlocked && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 opacity-10 pointer-events-none',
                      config.bgColor
                    )}
                    animate={{
                      boxShadow: [
                        `0 0 0 0 ${config.color.replace('text-', '')}20`,
                        `0 0 0 10px ${config.color.replace('text-', '')}00`
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// XP and Level Display Component
export const XPLevelDisplay: React.FC<{ className?: string }> = ({ className }) => {
  const { stats } = useGamification();

  const xpForCurrentLevel = (stats.level - 1) * 100;
  const xpForNextLevel = stats.level * 100;
  const currentLevelXP = stats.xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (currentLevelXP / xpNeededForNextLevel) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Level {stats.level}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>XP: {stats.xp}</span>
            <span>{xpForNextLevel} XP to next level</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>{currentLevelXP} / {xpNeededForNextLevel} XP</span>
            <span>{Math.max(0, xpNeededForNextLevel - currentLevelXP)} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
