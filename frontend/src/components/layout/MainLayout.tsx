import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/shared/SearchBar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { StreakCounter } from '@/components/shared/StreakCounter';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showTopTabs?: boolean;
  topTabs?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showBottomNav = true,
  showTopTabs = false,
  topTabs
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SkipLink />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                LearnForge
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className={cn(
              'hidden md:flex items-center space-x-6',
              showTopTabs ? 'flex-1 justify-center' : 'flex-1 justify-end'
            )}>
              {showTopTabs && topTabs}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <SearchBar />
              <StreakCounter />
              <ThemeToggle />

              {/* Profile Avatar */}
              <motion.button
                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus-ring"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open user profile menu"
                aria-haspopup="menu"
                role="button"
              >
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Top Tabs */}
        {showTopTabs && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2">
              {topTabs}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className={cn(
          'flex-1',
          showBottomNav ? 'pb-20 md:pb-0' : ''
        )}
        role="main"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && (
        <BottomNav />
      )}
    </div>
  );
};

// Skip Link for Accessibility
const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium focus-ring"
  >
    Skip to main content
  </a>
);

// Bottom Navigation Component
const BottomNav: React.FC = () => {
  const navItems = [
    { id: 'architecture', label: 'Architecture', path: '/architecture', icon: 'Grid3X3' },
    { id: 'dsa', label: 'DSA', path: '/dsa', icon: 'Code' },
    { id: 'certifications', label: 'Certifications', path: '/certifications', icon: 'Award' }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
            aria-label={`Navigate to ${item.label} section`}
          >
            <motion.div
              className="w-6 h-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* We'll use Lucide icons here */}
              <span className="text-sm">{item.icon}</span>
            </motion.div>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
