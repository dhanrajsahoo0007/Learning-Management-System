import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { getTopicPath } from '@/data/curriculum';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  Scale, Grid3X3, Database, Router, MessageSquare, Split, Zap, Eye, Brain, Search,
  Target, Globe, Hash, Radio, Shield, HardDrive, Link, Newspaper, Briefcase, Heart,
  Home, Plane, Car, MessageCircle, Play, Camera, FileText, GitBranch, Server, Coins,
  Building, Code, Sparkles, Image, Phone, Users, Music, Tv, Video, Mail, Wallet,
  UtensilsCrossed, Ticket, Copy, Gauge, Hexagon, Lock, Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductMark, hasProductMark } from './marks/ProductMark';

const iconMap = {
  Scale, Grid3X3, Database, Router, MessageSquare, Split, Zap, Eye, Brain, Search,
  Target, Globe, Hash, Radio, Shield, HardDrive, Link, Newspaper, Briefcase, Heart,
  Home, Plane, Car, MessageCircle, Play, Camera, FileText, GitBranch, Server, Coins,
  Building, Code, Sparkles, Image, Phone, Users, Music, Tv, Video, Mail, Wallet,
  UtensilsCrossed, Ticket, Copy, Gauge, Hexagon, Lock, Layers,
};

export const TopicCard: React.FC<{ topic: ArchitectureTopic }> = ({ topic }) => {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const IconComponent = iconMap[topic.icon as keyof typeof iconMap] || Grid3X3;
  const useMark = topic.section === 'products' && hasProductMark(topic.id);

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group/card h-full"
    >
      <Card
        className="h-full cursor-pointer group ring-0 transition-shadow duration-200 group-hover/card:ring-1 group-hover/card:ring-primary/25"
        onClick={() => navigate(getTopicPath(topic))}
      >
        <CardHeader>
          <div className="mb-3 flex items-start justify-between">
            <motion.div
              className={cn('flex h-12 w-12 items-center justify-center rounded-lg text-white', topic.color)}
              whileHover={reduced ? undefined : { scale: 1.06 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {useMark ? <ProductMark id={topic.id} size="md" className="h-6 w-6" /> : <IconComponent className="h-6 w-6" />}
            </motion.div>
            <Badge variant={
              topic.difficulty === 'Beginner' ? 'success' :
              topic.difficulty === 'Intermediate' ? 'warning' : 'danger'
            }>
              {topic.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg transition-colors group-hover:text-primary">
            {topic.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {topic.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{topic.estimatedMinutes} min</span>
            <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
              Open
              <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
