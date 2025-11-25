import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  className
}) => {
  const { stats } = useGamification();
  const { streak } = stats;
  const getStreakColor = (days: number) => {
    if (days >= 30) return 'text-red-500';
    if (days >= 14) return 'text-orange-500';
    if (days >= 7) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStreakIntensity = (days: number) => {
    if (days >= 30) return 'animate-pulse';
    if (days >= 14) return 'animate-bounce-subtle';
    return '';
  };

  return (
    <motion.div
      className={cn(
        'flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm',
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Flame
          className={cn(
            'w-5 h-5',
            getStreakColor(streak),
            getStreakIntensity(streak)
          )}
        />
      </motion.div>

      <motion.span
        className={cn(
          'font-semibold text-sm',
          getStreakColor(streak)
        )}
        key={streak}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {streak} day{streak !== 1 ? 's' : ''} streak
      </motion.span>

      {/* Achievement badges for milestones */}
      {streak >= 7 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.5 }}
          className="w-2 h-2 bg-yellow-400 rounded-full"
        />
      )}
      {streak >= 14 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.7 }}
          className="w-2 h-2 bg-orange-400 rounded-full"
        />
      )}
      {streak >= 30 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.9 }}
          className="w-2 h-2 bg-red-400 rounded-full"
        />
      )}
    </motion.div>
  );
};
