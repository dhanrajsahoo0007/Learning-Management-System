import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { TopicCard } from './TopicCard';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DSATopic } from '@/data/dsaData';

export const TopicList: React.FC<{ topics: DSATopic[] }> = ({ topics }) => {
  const reduced = usePrefersReducedMotion();
  const totalProblems = topics.reduce((acc, t) => acc + (t.problemCount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
          Master <span className="text-primary">Data Structures &amp; Algorithms</span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
          Interactive coding challenges with visual explanations, a code playground, and
          comprehensive test cases.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Code className="size-4" aria-hidden />
            {topics.length} topics
          </span>
          <span aria-hidden>•</span>
          <span>{totalProblems}+ problems</span>
          <span aria-hidden>•</span>
          <span>4 languages</span>
        </div>
      </div>

      {topics.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No DSA topics available yet.</p>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={reduced ? false : { x: -16 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <TopicCard topic={topic} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
