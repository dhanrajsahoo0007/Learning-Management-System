/**
 * Animation Utilities
 * 
 * Reusable Framer Motion animation variants and configurations.
 * Import these to maintain consistent animations across the application.
 */

import { Variants, Transition } from 'framer-motion';
import { duration, easing } from '@/config/theme';

/**
 * Fade in animation variant
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal / 1000,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide up animation variant
 */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow / 1000,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide in from right animation variant
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow / 1000,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale animation variant
 */
export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal / 1000,
      ease: easing.easeOut,
    },
  },
};

/**
 * Container animation with stagger children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Item animation for stagger container
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow / 1000,
    },
  },
};

/**
 * Hover scale animation
 */
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: duration.fast / 1000,
  },
};

/**
 * Tap scale animation
 */
export const tapScale = {
  scale: 0.98,
};

/**
 * Hover lift animation (translate Y)
 */
export const hoverLift = {
  y: -5,
  transition: {
    duration: duration.fast / 1000,
  },
};

/**
 * Spring transition configuration
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth transition configuration
 */
export const smoothTransition: Transition = {
  duration: duration.normal / 1000,
  ease: easing.easeInOut,
};

/**
 * Create a custom stagger container with configurable delay
 */
export const createStaggerContainer = (staggerDelay: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Create a custom fade in with delay
 */
export const createFadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal / 1000,
      delay,
      ease: easing.easeOut,
    },
  },
});

/**
 * Create a custom slide animation
 */
export const createSlide = (
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 20
): Variants => {
  const isVertical = direction === 'up' || direction === 'down';
  const isNegative = direction === 'down' || direction === 'right';
  const value = isNegative ? distance : -distance;

  if (isVertical) {
    return {
      hidden: { opacity: 0, y: value },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration.slow / 1000,
          ease: easing.easeOut,
        },
      },
    };
  }

  return {
    hidden: { opacity: 0, x: value },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: duration.slow / 1000,
        ease: easing.easeOut,
      },
    },
  };
};
