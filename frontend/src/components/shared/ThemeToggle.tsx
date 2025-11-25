import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, isRainbow } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-lg transition-colors focus-ring',
        'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isRainbow ? 1.1 : 1
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isRainbow ? (
          <Palette className="w-5 h-5 text-purple-500" />
        ) : isDark ? (
          <Moon className="w-5 h-5 text-yellow-500" />
        ) : (
          <Sun className="w-5 h-5 text-orange-500" />
        )}
      </motion.div>

      {/* Rainbow indicator */}
      {isRainbow && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-20"
          animate={{
            background: [
              'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              'linear-gradient(45deg, #4ecdc4, #45b7d1)',
              'linear-gradient(45deg, #45b7d1, #f9ca24)',
              'linear-gradient(45deg, #f9ca24, #ff6b6b)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.button>
  );
};
