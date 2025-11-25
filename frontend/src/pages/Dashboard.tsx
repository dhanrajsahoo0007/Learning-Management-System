import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StreakCounter } from '@/components/shared/StreakCounter';
import { AchievementShowcase } from '@/components/shared/AchievementShowcase';
import { BookOpen, Clock, Target, Award, TrendingUp, Flame } from 'lucide-react';
import { fadeIn, staggerContainer, staggerItem } from '@/utils/animations';

const Dashboard: React.FC = () => {
  const { stats } = useGamification();

  const userStats = [
    {
      icon: BookOpen,
      label: 'Topics Completed',
      value: stats.totalTopicsCompleted,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      icon: Clock,
      label: 'Hours Studied',
      value: Math.floor(stats.totalHoursStudied),
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.streak} Days`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      iconBg: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      icon: Award,
      label: 'Certifications',
      value: stats.achievements.filter(a => a.unlocked).length,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Here's your learning progress overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {userStats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <Card className={`${stat.bgColor} border-none hover:shadow-lg transition-shadow duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Level & XP Progress */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Level {stats.level}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.xp} XP earned
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="text-2xl font-bold text-primary-600">
                  {stats.xp % 100}%
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.xp % 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {100 - (stats.xp % 100)} XP to next level
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak Counter - Large Display */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span>Your Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <StreakCounter className="transform scale-150" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Keep it up! Study every day to maintain your streak 🔥
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Achievements
        </h2>
        <AchievementShowcase />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Continue Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-600 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    System Design
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Continue your journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-3 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    DSA Practice
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solve problems
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-orange-400 to-red-600 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    Certifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn credentials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
