import React, { createContext, useContext, useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  streak: number;
  totalTopicsCompleted: number;
  totalHoursStudied: number;
  xp: number;
  level: number;
  achievements: Achievement[];
  lastStudyDate: string | null;
}

interface GamificationContextType {
  stats: UserStats;
  updateStreak: () => void;
  completeTopic: (topicId: string) => void;
  addStudyTime: (minutes: number) => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

const initialAchievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first topic',
    icon: '🎯',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: '⚔️',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 10 topics',
    icon: '📚',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'architecture-expert',
    title: 'Architecture Expert',
    description: 'Complete all architecture topics',
    icon: '🏗️',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'code-master',
    title: 'Code Master',
    description: 'Solve 25 DSA problems',
    icon: '👨‍💻',
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'certified-cloud',
    title: 'Certified Cloud',
    description: 'Complete a cloud certification roadmap',
    icon: '☁️',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'learning-addict',
    title: 'Learning Addict',
    description: 'Study for 100 hours total',
    icon: '🎓',
    unlocked: false,
    rarity: 'legendary'
  }
];

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const getXPReward = (action: string): number => {
  const rewards = {
    complete_topic: 50,
    study_minute: 1,
    daily_streak: 10,
    achievement_unlock: 100
  };
  return rewards[action as keyof typeof rewards] || 0;
};

interface GamificationProviderProps {
  children: React.ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('gamification-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastStudyDate: parsed.lastStudyDate ? new Date(parsed.lastStudyDate) : null
      };
    }
    return {
      streak: 0,
      totalTopicsCompleted: 0,
      totalHoursStudied: 0,
      xp: 0,
      level: 1,
      achievements: initialAchievements,
      lastStudyDate: null
    };
  });

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('gamification-stats', JSON.stringify(stats));
  }, [stats]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStudy = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;

    let newStreak = stats.streak;

    if (lastStudy === today) {
      // Already studied today, no change
      return;
    } else if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
      // Studied yesterday, increment streak
      newStreak = stats.streak + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    setStats(prev => ({
      ...prev,
      streak: newStreak,
      lastStudyDate: today,
      xp: prev.xp + getXPReward('daily_streak')
    }));

    // Check for streak achievements
    checkStreakAchievements(newStreak);
  };

  const checkStreakAchievements = (streak: number) => {
    if (streak >= 7 && !stats.achievements.find(a => a.id === 'streak-master')?.unlocked) {
      unlockAchievement('streak-master');
    }
    if (streak >= 7 && !stats.achievements.find(a => a.id === 'week-warrior')?.unlocked) {
      unlockAchievement('week-warrior');
    }
  };

  const completeTopic = (topicId: string) => {
    const completedTopics = JSON.parse(localStorage.getItem('completed-topics') || '[]');

    if (!completedTopics.includes(topicId)) {
      completedTopics.push(topicId);

      localStorage.setItem('completed-topics', JSON.stringify(completedTopics));

      setStats(prev => {
        const newTopicsCompleted = prev.totalTopicsCompleted + 1;
        const newXP = prev.xp + getXPReward('complete_topic');
        const newLevel = calculateLevel(newXP);

        return {
          ...prev,
          totalTopicsCompleted: newTopicsCompleted,
          xp: newXP,
          level: newLevel
        };
      });

      // Check for topic completion achievements
      checkTopicAchievements();
    }
  };

  const checkTopicAchievements = () => {
    const newTotal = stats.totalTopicsCompleted + 1;

    if (newTotal >= 1 && !stats.achievements.find(a => a.id === 'first-steps')?.unlocked) {
      unlockAchievement('first-steps');
    }
    if (newTotal >= 10 && !stats.achievements.find(a => a.id === 'knowledge-seeker')?.unlocked) {
      unlockAchievement('knowledge-seeker');
    }
    // Add more achievement checks as needed
  };

  const addStudyTime = (minutes: number) => {
    setStats(prev => {
      const newHours = prev.totalHoursStudied + (minutes / 60);
      const newXP = prev.xp + (minutes * getXPReward('study_minute'));

      return {
        ...prev,
        totalHoursStudied: newHours,
        xp: newXP,
        level: calculateLevel(newXP)
      };
    });

    // Check for study time achievements
    const newTotalHours = stats.totalHoursStudied + (minutes / 60);
    if (newTotalHours >= 100 && !stats.achievements.find(a => a.id === 'learning-addict')?.unlocked) {
      unlockAchievement('learning-addict');
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      ),
      xp: prev.xp + getXPReward('achievement_unlock'),
      level: calculateLevel(prev.xp + getXPReward('achievement_unlock'))
    }));
  };

  const resetProgress = () => {
    setStats({
      streak: 0,
      totalTopicsCompleted: 0,
      totalHoursStudied: 0,
      xp: 0,
      level: 1,
      achievements: initialAchievements.map(a => ({ ...a, unlocked: false, unlockedAt: undefined })),
      lastStudyDate: null
    });
    localStorage.removeItem('completed-topics');
    localStorage.removeItem('gamification-stats');
  };

  return (
    <GamificationContext.Provider value={{
      stats,
      updateStreak,
      completeTopic,
      addStudyTime,
      unlockAchievement,
      resetProgress
    }}>
      {children}
    </GamificationContext.Provider>
  );
};
