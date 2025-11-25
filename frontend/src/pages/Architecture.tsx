import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { architectureTopics } from '@/data/architectureData';
import { Scale, Grid3X3, Database, Router, MessageSquare, Split, Zap, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Scale,
  Grid3X3,
  Database,
  Router,
  MessageSquare,
  Split,
  Zap,
  Eye
};

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500'
};

// Architecture Topic Card Component
const TopicCard: React.FC<{ topic: typeof architectureTopics[0] }> = ({ topic }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[topic.icon as keyof typeof iconMap];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full cursor-pointer group"
        onClick={() => navigate(`/architecture/${topic.id}`)}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              topic.color
            )}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <Badge variant={
              topic.difficulty === 'Beginner' ? 'success' :
              topic.difficulty === 'Intermediate' ? 'warning' : 'danger'
            }>
              {topic.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {topic.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {topic.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ProgressRing progress={topic.progress} size={40} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {topic.progress}% complete
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


// Architecture Topic Detail Component
const TopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = architectureTopics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Topic not found
          </h2>
          <button
            onClick={() => navigate('/architecture')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Architecture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/architecture')}
          className="mb-4 px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          ← Back to Architecture
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {topic.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {topic.description}
            </p>
          </div>
          <div className="ml-6">
            <ProgressRing progress={topic.progress} size={80} />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {topic.content.overview}
              </p>
            </CardContent>
          </Card>

          {/* Concepts */}
          <Card>
            <CardHeader>
              <CardTitle>Key Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.content.concepts.map((concept, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {concept}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topic.content.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Real-world Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topic.content.examples.map((example, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {example}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <ProgressRing progress={topic.progress} size={100} className="mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.progress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Badge */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge variant={
                  topic.difficulty === 'Beginner' ? 'success' :
                  topic.difficulty === 'Intermediate' ? 'warning' : 'danger'
                } className="text-sm px-3 py-1">
                  {topic.difficulty} Level
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Mark as Complete
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Take Notes
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Practice Quiz
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Architecture Page Component
const Architecture: React.FC = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Master <span className="text-primary-600 dark:text-primary-400">System Design</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Learn scalable architecture patterns, distributed systems, and design principles used by top tech companies.
              </p>
            </motion.div>

            {/* Topics Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {architectureTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TopicCard topic={topic} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        }
      />
      <Route path=":topicId" element={<TopicDetail />} />
    </Routes>
  );
};

export default Architecture;
