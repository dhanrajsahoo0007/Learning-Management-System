import { apiClient } from './client';

export interface Achievement {
  id: number;
  userId: number;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

export interface GamificationStats {
  userId: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalPoints: number;
  lastActivityDate?: string;
  achievements: Achievement[];
}

export interface AddXPRequest {
  amount: number;
}

export interface UnlockAchievementRequest {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
}

export interface UpdateProgressRequest {
  topicId: string;
  topicType: string;
  progress: number;
}

export const gamificationService = {
  getStats: async (): Promise<GamificationStats> => {
    const response = await apiClient.get<GamificationStats>('/gamification/stats');
    // Ensure response.data is returned correctly. 
    // The backend uses utils.Success(c, stats) which usually wraps in { success: true, data: stats } 
    // or just JSON. standard utils.Success in this project returns { success: true, data: ... } ?
    // Let's assume standard wrapper based on previous services.
    // However, in client.ts I just return response.data.data usually.
    // Let's stick to consistent pattern.
    return (response.data as any).data; 
  },

  addXP: async (amount: number): Promise<GamificationStats> => {
    const response = await apiClient.post<{ data: GamificationStats }>('/gamification/xp', { amount });
    return response.data.data;
  },

  unlockAchievement: async (achievement: UnlockAchievementRequest): Promise<Achievement> => {
    const response = await apiClient.post<{ data: Achievement }>('/gamification/achievements', achievement);
    return response.data.data;
  },

  updateStreak: async (): Promise<GamificationStats> => {
    const response = await apiClient.post<{ data: GamificationStats }>('/gamification/streak', {});
    return response.data.data;
  },

  updateProgress: async (data: UpdateProgressRequest): Promise<any> => {
    const response = await apiClient.post('/progress', data);
    return response.data;
  }
};
