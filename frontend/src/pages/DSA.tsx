import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { TopicList } from '@/components/dsa/TopicList';
import { TopicDetail } from '@/components/dsa/TopicDetail';
import { dsaService } from '@/api/dsa';
import type { DSATopic } from '@/data/dsaData';

const DSAHub: React.FC = () => {
  const [topics, setTopics] = useState<DSATopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await dsaService.getAll();
        setTopics(data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mx-auto h-12 w-2/3" />
        <Skeleton className="mx-auto mb-8 h-6 w-1/2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return <TopicList topics={topics} />;
};

const DSA: React.FC = () => (
  <Routes>
    <Route index element={<DSAHub />} />
    <Route path=":topicId" element={<TopicDetail />} />
  </Routes>
);

export default DSA;
