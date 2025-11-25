import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Code, Award, Zap, Target, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const stats = [
    { label: 'Topics Completed', value: '24', icon: <BookOpen className="w-5 h-5 text-blue-500" />, color: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' },
    { label: 'Hours Studied', value: '127', icon: <Zap className="w-5 h-5 text-amber-500" />, color: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20' },
    { label: 'Current Streak', value: '7 Days', icon: <Target className="w-5 h-5 text-green-500" />, color: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' },
    { label: 'Certifications', value: '2', icon: <Award className="w-5 h-5 text-purple-500" />, color: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' }
  ];

  const learningPaths = [
    {
      title: 'System Architecture',
      description: 'Master scalable system design patterns and principles with real-world examples.',
      icon: <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      path: '/architecture',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'Data Structures & Algo',
      description: 'Ace your technical interviews with comprehensive DSA practice and solutions.',
      icon: <Code className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      path: '/dsa',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Professional Certifications',
      description: 'Prepare for cloud and specialized tech certifications with expert guidance.',
      icon: <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
      path: '/certifications',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  ];

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: 'Interactive Learning' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Track Progress' },
    { icon: <Award className="w-5 h-5" />, text: 'Earn Certificates' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-60">
          <div className="absolute -top-[40%] -right-[15%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary-200/40 via-blue-200/40 to-purple-200/40 blur-3xl animate-pulse-slow" />
          <div className="absolute top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-200/40 to-primary-200/40 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-primary-200/30 blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 mb-8 shadow-lg shadow-primary-500/10">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">New: System Design 2.0 Course</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-display leading-[1.1]">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 gradient-animate">
                Tech Career
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
              Elevate your skills with interactive learning paths in System Design, DSA, and Cloud Certifications.
            </motion.p>

            {/* Features */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => window.location.href = '/architecture'} className="group shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = '/dsa'} className="shadow-lg hover:shadow-xl transition-all">
                View Curriculum
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Choose Your Path
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 font-display"
            >
              Learning Paths
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light"
            >
              Structured curriculums designed to take you from beginner to expert in key technical domains.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full border-t-4 ${path.borderColor} hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden relative`}
                  onClick={() => window.location.href = path.path}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <CardContent className="p-8 relative">
                    <div className={`w-16 h-16 rounded-2xl ${path.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      {path.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${path.gradient} transition-all duration-300">
                      {path.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {path.description}
                    </p>
                    <div className={`flex items-center text-transparent bg-clip-text bg-gradient-to-r ${path.gradient} font-semibold group-hover:translate-x-2 transition-transform duration-300`}>
                      Explore Path 
                      <ArrowRight className="ml-2 w-5 h-5 text-current" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

