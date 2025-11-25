/**
 * Style Utilities
 * 
 * Helper functions for generating dynamic styles and class names.
 */

import { gradients } from '@/config/colors';

/**
 * Generate a gradient class string
 */
export const getGradient = (key: keyof typeof gradients): string => {
  return `bg-gradient-to-r ${gradients[key]}`;
};

/**
 * Generate a gradient text class string
 */
export const getGradientText = (key: keyof typeof gradients): string => {
  return `text-transparent bg-clip-text bg-gradient-to-r ${gradients[key]}`;
};

/**
 * Get difficulty color class
 */
export const getDifficultyColor = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string => {
  const colors = {
    Beginner: 'bg-success-500',
    Intermediate: 'bg-warning-500',
    Advanced: 'bg-danger-500',
  };
  return colors[difficulty];
};

/**
 * Get difficulty text color class
 */
export const getDifficultyTextColor = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string => {
  const colors = {
    Beginner: 'text-success-600 dark:text-success-400',
    Intermediate: 'text-warning-600 dark:text-warning-400',
    Advanced: 'text-danger-600 dark:text-danger-400',
  };
  return colors[difficulty];
};

/**
 * Get provider color class
 */
export const getProviderColor = (provider: string): string => {
  const colors: Record<string, string> = {
    AWS: 'bg-orange-500',
    Azure: 'bg-blue-600',
    GCP: 'bg-green-600',
    Kubernetes: 'bg-cyan-500',
    Terraform: 'bg-purple-500',
    Docker: 'bg-blue-500',
  };
  return colors[provider] || 'bg-slate-500';
};

/**
 * Get rarity color configuration
 */
export const getRarityConfig = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
  const configs = {
    common: {
      color: 'text-slate-500',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
    },
    rare: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    epic: {
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    legendary: {
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
  };
  return configs[rarity];
};

/**
 * Get streak color based on days
 */
export const getStreakColor = (days: number): string => {
  if (days >= 30) return 'text-danger-500';
  if (days >= 14) return 'text-warning-500';
  if (days >= 7) return 'text-success-500';
  return 'text-slate-500';
};

/**
 * Get streak intensity animation class
 */
export const getStreakIntensity = (days: number): string => {
  if (days >= 30) return 'animate-pulse';
  if (days >= 14) return 'animate-bounce-subtle';
  return '';
};

/**
 * Generate shadow class with glow effect
 */
export const getShadowGlow = (color: string = 'primary'): string => {
  return `shadow-lg shadow-${color}-500/30`;
};

/**
 * Generate hover shadow class
 */
export const getHoverShadow = (color: string = 'primary'): string => {
  return `hover:shadow-xl hover:shadow-${color}-500/40`;
};
