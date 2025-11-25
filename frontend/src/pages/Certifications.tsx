import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { certifications } from '@/data/certificationsData';
import { ConfettiTrigger } from '@/components/shared/ConfettiTrigger';
import {
  Filter,
  Search,
  Award,
  Clock,
  CheckCircle,
  Circle,
  Play,
  BookOpen,
  Code,
  FileText,
  ChevronRight,
  Star,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Certification Card Component
const CertificationCard: React.FC<{
  certification: typeof certifications[0];
  onClick: () => void;
}> = ({ certification, onClick }) => {
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'AWS': return 'bg-orange-500';
      case 'Azure': return 'bg-blue-600';
      case 'GCP': return 'bg-green-600';
      case 'Kubernetes': return 'bg-cyan-500';
      case 'Terraform': return 'bg-purple-500';
      case 'Docker': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'AWS': return '☁️';
      case 'Azure': return '☁️';
      case 'GCP': return '☁️';
      case 'Kubernetes': return '⎈';
      case 'Terraform': return '🏗️';
      case 'Docker': return '🐳';
      default: return '🏆';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full cursor-pointer group"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl',
                getProviderColor(certification.provider)
              )}>
                {getProviderIcon(certification.provider)}
              </div>
              <div>
                <Badge variant={
                  certification.level === 'Foundational' ? 'secondary' :
                  certification.level === 'Associate' ? 'default' :
                  certification.level === 'Professional' ? 'warning' : 'success'
                } className="text-xs mb-1">
                  {certification.level}
                </Badge>
                <CardTitle className="text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {certification.title}
                </CardTitle>
              </div>
            </div>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <CardDescription className="line-clamp-2">
            {certification.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ProgressRing progress={
                  (certification.progress.completedModules / certification.progress.totalModules) * 100
                } size={40} />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {certification.progress.completedModules}/{certification.progress.totalModules} modules
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round((certification.progress.completedModules / certification.progress.totalModules) * 100)}% complete
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{certification.estimatedHours}h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>{certification.difficulty}</span>
              </div>
            </div>

            {/* Start Learning Button */}
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Start Learning
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Roadmap View Component
const RoadmapView: React.FC<{
  certification: typeof certifications[0];
  onBack: () => void;
}> = ({ certification, onBack }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(certification.roadmap.filter(step => step.completed).map(step => step.id))
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
      // Check if all steps are completed
      if (newCompleted.size === certification.roadmap.length) {
        setShowConfetti(true);
      }
    }
    setCompletedSteps(newCompleted);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'practice': return <Code className="w-4 h-4" />;
      case 'exam': return <FileText className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-500';
      case 'reading': return 'text-green-500';
      case 'practice': return 'text-purple-500';
      case 'exam': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ConfettiTrigger trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          ← Back to Certifications
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {certification.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {certification.description}
            </p>
          </div>
          <div className="ml-6">
            <ProgressRing progress={
              (completedSteps.size / certification.roadmap.length) * 100
            } size={80} />
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-8">
          {certification.roadmap.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-6"
              >
                {/* Timeline dot */}
                <div className="relative z-10">
                  <motion.button
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      'w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center transition-colors',
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      getStepIcon(step.type)
                    )}
                  </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={cn('font-medium capitalize', getStepColor(step.type))}>
                          {step.type}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {step.content && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.content}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 flex items-center space-x-3">
                    <button className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      isCompleted
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    )}>
                      {isCompleted ? 'Completed ✓' : `Start ${step.type}`}
                    </button>
                    {!isCompleted && (
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completion Summary */}
      {completedSteps.size === certification.roadmap.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 text-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white"
        >
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="text-lg mb-4">
            You've completed all modules for {certification.title}
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm opacity-90">
            Ready to take the certification exam?
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Main Certifications Page Component
const Certifications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const providers = ['All', ...Array.from(new Set(certifications.map(c => c.provider)))];
  const levels = ['All', 'Foundational', 'Associate', 'Professional', 'Expert'];

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'All' || cert.provider === selectedProvider;
    const matchesLevel = selectedLevel === 'All' || cert.level === selectedLevel;

    return matchesSearch && matchesProvider && matchesLevel;
  });

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
                Cloud <span className="text-primary-600 dark:text-primary-400">Certifications</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Master cloud platforms and technologies with structured learning paths, practice exams, and industry-recognized certifications.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search certifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus-ring"
                    />
                  </div>
                </div>

                {/* Provider Filter */}
                <div className="md:w-48">
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus-ring"
                  >
                    {providers.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div className="md:w-48">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus-ring"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Certifications Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCertifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CertificationCard
                    certification={cert}
                    onClick={() => window.location.href = `/certifications/${cert.id}`}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredCertifications.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No certifications found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        }
      />
      <Route
        path=":certId"
        element={
          <CertificationDetail />
        }
      />
    </Routes>
  );
};

// Certification Detail Component
const CertificationDetail: React.FC = () => {
  const { certId } = useParams();
  const navigate = useNavigate();
  const certification = certifications.find(c => c.id === certId);

  if (!certification) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certification not found
          </h2>
          <button
            onClick={() => navigate('/certifications')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Certifications
          </button>
        </div>
      </div>
    );
  }

  return <RoadmapView certification={certification} onBack={() => navigate('/certifications')} />;
};

export default Certifications;
