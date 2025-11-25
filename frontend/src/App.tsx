import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TopTabs } from '@/components/layout/TopTabs';
import { Grid3X3, Code, Award } from 'lucide-react';

// Lazy load page components
const Architecture = lazy(() => import('@/pages/Architecture'));
const DSA = lazy(() => import('@/pages/DSA'));
const Certifications = lazy(() => import('@/pages/Certifications'));

// Loading component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Home redirect component
const Home: React.FC = () => {
  // Mock stats for the home page
  const stats = [
    { label: 'Topics Completed', value: 24, color: 'text-green-500' },
    { label: 'Hours Studied', value: 127, color: 'text-blue-500' },
    { label: 'Current Streak', value: 7, color: 'text-orange-500' },
    { label: 'Certifications', value: 2, color: 'text-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-primary-600 dark:text-primary-400">LearnForge</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Master System Design, Data Structures & Algorithms, and Cloud Certifications with interactive tutorials and hands-on practice.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Choose your learning path below
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/architecture'}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Start Learning Architecture
            </button>
            <button
              onClick={() => window.location.href = '/dsa'}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Practice DSA
            </button>
            <button
              onClick={() => window.location.href = '/certifications'}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Get Certified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const tabs = [
    {
      id: 'architecture',
      label: 'Architecture',
      path: '/architecture',
      icon: <Grid3X3 className="w-4 h-4" />
    },
    {
      id: 'dsa',
      label: 'DSA',
      path: '/dsa',
      icon: <Code className="w-4 h-4" />
    },
    {
      id: 'certifications',
      label: 'Certifications',
      path: '/certifications',
      icon: <Award className="w-4 h-4" />
    }
  ];

  return (
    <ThemeProvider>
      <GamificationProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout showBottomNav={false} showTopTabs={false}>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/architecture/*"
              element={
                <MainLayout
                  showTopTabs={true}
                  topTabs={<TopTabs tabs={tabs} />}
                >
                  <Suspense fallback={<PageLoader />}>
                    <Architecture />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/dsa/*"
              element={
                <MainLayout
                  showTopTabs={true}
                  topTabs={<TopTabs tabs={tabs} />}
                >
                  <Suspense fallback={<PageLoader />}>
                    <DSA />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/certifications/*"
              element={
                <MainLayout
                  showTopTabs={true}
                  topTabs={<TopTabs tabs={tabs} />}
                >
                  <Suspense fallback={<PageLoader />}>
                    <Certifications />
                  </Suspense>
                </MainLayout>
              }
            />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GamificationProvider>
    </ThemeProvider>
  );
};

export default App;
