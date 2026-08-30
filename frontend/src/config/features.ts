export interface FeatureModule {
  id: string;
  enabled: boolean;
  label: string;
  path: string;
  description: string;
}

export const featureFlags = {
  systemDesign: true,
  aiSystemDesign: true,
  aiMl: true,
  dsa: true,
  certifications: true,
  gamification: true,
} as const;

export type FeatureKey = keyof typeof featureFlags;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return featureFlags[key];
}

export const featureModules: FeatureModule[] = [
  {
    id: 'systemDesign',
    enabled: featureFlags.systemDesign,
    label: 'System Design',
    path: '/system-design/fundamentals',
    description: 'Classic system design topics and interview patterns',
  },
  {
    id: 'aiSystemDesign',
    enabled: featureFlags.aiSystemDesign,
    label: 'AI System Design',
    path: '/system-design/ai/ml-system-design',
    description: 'Design patterns for AI and ML systems',
  },
  {
    id: 'aiMl',
    enabled: featureFlags.aiMl,
    label: 'AI / ML',
    path: '/ai-ml/learning-paths',
    description: 'Machine learning paths, ML system design, and interview drills',
  },
  {
    id: 'dsa',
    enabled: featureFlags.dsa,
    label: 'DSA',
    path: '/dsa',
    description: 'Data structures and algorithms practice',
  },
  {
    id: 'certifications',
    enabled: featureFlags.certifications,
    label: 'Certifications',
    path: '/certifications',
    description: 'Cloud and professional certification roadmaps',
  },
];
