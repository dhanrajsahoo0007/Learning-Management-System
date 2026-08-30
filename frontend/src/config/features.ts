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
  dsa: false,
  certifications: false,
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
    path: '/system-design',
    description: 'Classic system design topics and interview patterns',
  },
  {
    id: 'aiSystemDesign',
    enabled: featureFlags.aiSystemDesign,
    label: 'AI System Design',
    path: '/system-design/ai',
    description: 'Design patterns for AI and ML systems',
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
