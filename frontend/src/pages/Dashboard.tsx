import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StreakCounter } from '@/components/shared/StreakCounter';
import { AchievementShowcase } from '@/components/shared/AchievementShowcase';
import { BookOpen, Clock, Target, Award, Flame, Cpu } from 'lucide-react';
import { fadeIn, staggerContainer, staggerItem } from '@/utils/animations';
import { isFeatureEnabled } from '@/config/features';

const Dashboard: React.FC = () => {
  const { stats } = useGamification();
  const navigate = useNavigate();
  const unlockedCount = stats.achievements.filter((a) => Boolean(a.unlockedAt)).length;
  const xpPercent = stats.xp % 100;

  const userStats = [
    { icon: BookOpen, label: 'Topics Completed', value: stats.totalTopicsCompleted, show: true },
    { icon: Clock, label: 'Hours Studied', value: Math.floor(stats.totalHoursStudied), show: true },
    { icon: Flame, label: 'Current Streak', value: `${stats.streak} Days`, show: isFeatureEnabled('gamification') },
    { icon: Award, label: 'Achievements', value: unlockedCount, show: isFeatureEnabled('gamification') && !isFeatureEnabled('certifications') },
    { icon: Award, label: 'Certifications', value: unlockedCount, show: isFeatureEnabled('certifications') },
  ].filter((stat) => stat.show);

  const continueLearning = [
    { title: 'System Design', description: 'Continue your journey', path: '/system-design', icon: Target, show: isFeatureEnabled('systemDesign') },
    { title: 'AI System Design', description: 'Design AI-powered systems', path: '/system-design/ai', icon: Cpu, show: isFeatureEnabled('aiSystemDesign') },
    { title: 'DSA Practice', description: 'Solve problems', path: '/dsa', icon: BookOpen, show: isFeatureEnabled('dsa') },
    { title: 'Certifications', description: 'Earn credentials', path: '/certifications', icon: Award, show: isFeatureEnabled('certifications') },
  ].filter((item) => item.show);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">Your system design progress overview</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={`mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${userStats.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
      >
        {userStats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <Card>
              <CardContent className="pt-6">
                <stat.icon className="mb-3 size-5 text-primary" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {isFeatureEnabled('gamification') && (
        <>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Level {stats.level}</h3>
                  <p className="text-sm text-muted-foreground">{stats.xp} XP earned</p>
                </div>
                <span className="text-sm font-medium text-primary">{xpPercent}%</span>
              </div>
              <Progress value={xpPercent} />
              <p className="mt-2 text-xs text-muted-foreground">{100 - xpPercent} XP to next level</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="size-5" />
                Your Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <StreakCounter />
              </div>
            </CardContent>
          </Card>

          <h2 className="mb-4 text-xl font-semibold">Your Achievements</h2>
          <AchievementShowcase />
        </>
      )}

      <h2 className="mt-8 mb-4 text-xl font-semibold">Continue Learning</h2>
      <div className={`grid gap-4 ${continueLearning.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {continueLearning.map((item) => (
          <Card
            key={item.title}
            className="cursor-pointer transition-colors hover:bg-accent/40"
            onClick={() => navigate(item.path)}
          >
            <CardContent className="flex items-center gap-4 pt-6">
              <item.icon className="size-5 text-primary" />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
