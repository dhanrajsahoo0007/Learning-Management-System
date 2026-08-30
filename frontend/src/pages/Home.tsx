import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Cpu, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isFeatureEnabled } from '@/config/features';

const Home: React.FC = () => {
  const stats = [
    { label: 'System Design Topics', value: '20+', icon: BookOpen, show: isFeatureEnabled('systemDesign') },
    { label: 'AI Design Patterns', value: '12+', icon: Cpu, show: isFeatureEnabled('aiSystemDesign') },
    { label: 'Hours Studied', value: '127', icon: Zap, show: true },
    { label: 'Current Streak', value: '7 Days', icon: Target, show: isFeatureEnabled('gamification') },
  ].filter((stat) => stat.show);

  const learningPaths = [
    {
      title: 'System Design',
      description: 'Learn the primitives, then design real products the way you would in a 45-minute interview.',
      path: '/system-design',
      show: isFeatureEnabled('systemDesign'),
    },
    {
      title: 'AI System Design',
      description: 'Serving, RAG, eval, and product designs that still need caches, queues, and load balancers.',
      path: '/system-design/ai',
      show: isFeatureEnabled('aiSystemDesign'),
    },
  ].filter((path) => path.show);

  return (
    <div className="bg-background">
      <section className="px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" />
            System Design Hub
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Master system design
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Interview-ready fundamentals and product designs, with an AI track that still requires the classic building blocks.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/system-design">
                Start Learning
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {isFeatureEnabled('aiSystemDesign') && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/system-design/ai">Explore AI System Design</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      <section className="border-y bg-card/40 px-4 py-12 sm:px-6">
        <div className={`mx-auto grid max-w-4xl gap-4 ${stats.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} grid-cols-2`}>
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-4 text-center">
              <stat.icon className="mx-auto mb-2 size-5 text-primary" />
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Learning paths</h2>
          <p className="mt-2 text-muted-foreground">Pick a track. The outline on the left is the course.</p>
        </div>
        <div className={`mx-auto grid gap-4 ${learningPaths.length === 1 ? 'max-w-xl' : 'max-w-4xl md:grid-cols-2'}`}>
          {learningPaths.map((path) => (
            <Link key={path.title} to={path.path}>
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">{path.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{path.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explore path
                    <ArrowRight className="size-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
