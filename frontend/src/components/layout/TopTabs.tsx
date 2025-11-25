import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface TopTabsProps {
  tabs: TabItem[];
  className?: string;
}

export const TopTabs: React.FC<TopTabsProps> = ({ tabs, className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || tabs[0].id;

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              'relative px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              'flex items-center space-x-2',
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            <span>{tab.label}</span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
