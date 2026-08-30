import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArchitectureTopic } from '@/data/systemDesignTypes';
import { getTopicPath } from '@/data/curriculum';
import {
  Scale, Grid3X3, Database, Router, MessageSquare, Split, Zap, Eye, Brain, Search,
  Target, Globe, Hash, Radio, Shield, HardDrive, Link, Newspaper, Briefcase, Heart,
  Home, Plane, Car, MessageCircle, Play, Camera, FileText, GitBranch, Server, Coins,
  Building, Code, Sparkles, Image, Phone, Users, Music, Tv, Video, Mail, Wallet,
  UtensilsCrossed, Ticket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Scale, Grid3X3, Database, Router, MessageSquare, Split, Zap, Eye, Brain, Search,
  Target, Globe, Hash, Radio, Shield, HardDrive, Link, Newspaper, Briefcase, Heart,
  Home, Plane, Car, MessageCircle, Play, Camera, FileText, GitBranch, Server, Coins,
  Building, Code, Sparkles, Image, Phone, Users, Music, Tv, Video, Mail, Wallet,
  UtensilsCrossed, Ticket,
};

export const TopicCard: React.FC<{ topic: ArchitectureTopic }> = ({ topic }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[topic.icon as keyof typeof iconMap] || Grid3X3;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full cursor-pointer group" onClick={() => navigate(getTopicPath(topic))}>
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', topic.color)}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
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
            <span className="capitalize">{topic.section}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
