/**
 * Type Definitions
 * 
 * Centralized TypeScript type definitions for the Learning Management application.
 */

import { HTMLMotionProps } from 'framer-motion';

/**
 * Common component variant types
 */
export type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type Size = 'sm' | 'md' | 'lg';
export type Status = 'success' | 'warning' | 'danger' | 'info';

/**
 * Badge variant types
 */
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Difficulty levels
 */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Achievement rarity levels
 */
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Cloud providers
 */
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Kubernetes' | 'Terraform' | 'Docker';

/**
 * Common component props
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface MotionComponentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Button props
 */
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Card props
 */
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Badge props
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: Size;
  className?: string;
}

/**
 * Progress ring props
 */
export interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

/**
 * Theme context types
 */
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isRainbow: boolean;
  toggleRainbow: () => void;
}

/**
 * Gamification types
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  requirement?: number;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalPoints: number;
  achievements: Achievement[];
}

export interface GamificationContextType {
  stats: GamificationStats;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
}

/**
 * Learning content types
 */
export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  progress: number;
  estimatedTime: string;
  content: {
    overview: string;
    keyPoints: string[];
    examples: string[];
    bestPractices: string[];
  };
}

export interface Certification {
  id: string;
  title: string;
  provider: CloudProvider;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  progress: number;
  topics: string[];
}

/**
 * Animation variant types
 */
export interface AnimationVariant {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
      staggerChildren?: number;
    };
  };
}
