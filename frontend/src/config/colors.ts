/**
 * Color Palette Configuration
 * 
 * Centralized color definitions for the Learning Management application.
 * These colors are used in Tailwind configuration and can be imported
 * throughout the application for type-safe color usage.
 */

export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

/**
 * Semantic color mappings for common use cases
 */
export const semanticColors = {
  // Status colors
  info: colors.primary,
  success: colors.success,
  warning: colors.warning,
  error: colors.danger,
  
  // Difficulty levels
  difficulty: {
    beginner: colors.success[500],
    intermediate: colors.warning[500],
    advanced: colors.danger[500],
  },
  
  // Provider colors (for certifications)
  providers: {
    aws: '#FF9900',
    azure: '#0078D4',
    gcp: '#4285F4',
    kubernetes: '#326CE5',
    terraform: '#7B42BC',
    docker: '#2496ED',
  },
  
  // Rarity colors (for achievements)
  rarity: {
    common: colors.slate[500],
    rare: colors.primary[500],
    epic: '#a855f7', // purple-500
    legendary: '#eab308', // yellow-500
  },
} as const;

/**
 * Gradient definitions
 */
export const gradients = {
  primary: 'from-primary-600 via-blue-600 to-purple-600',
  hero: 'from-slate-50 via-white to-slate-50',
  heroDark: 'from-slate-950 via-slate-900 to-slate-950',
  
  // Learning path gradients
  architecture: 'from-indigo-500 to-purple-600',
  dsa: 'from-emerald-500 to-teal-600',
  certifications: 'from-orange-500 to-red-600',
  
  // Background gradients
  bgArchitecture: 'from-indigo-50 to-purple-50',
  bgArchitectureDark: 'from-indigo-950/50 to-purple-950/50',
  bgDsa: 'from-emerald-50 to-teal-50',
  bgDsaDark: 'from-emerald-950/50 to-teal-950/50',
  bgCertifications: 'from-orange-50 to-red-50',
  bgCertificationsDark: 'from-orange-950/50 to-red-950/50',
} as const;

export type ColorScale = typeof colors[keyof typeof colors];
export type ColorShade = keyof ColorScale;
export type SemanticColor = keyof typeof semanticColors;
