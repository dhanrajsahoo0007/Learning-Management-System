import React, { useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { dsaTopics, dsaCategories } from '@/data/dsaData';
import { mockExecuteCode, ExecutionResult } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Play,
  Lightbulb,
  CheckCircle,
  Code,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Topic Category Component
const TopicCategory: React.FC<{
  category: string;
  topics: typeof dsaTopics;
  expanded: boolean;
  onToggle: () => void;
}> = ({ category, topics, expanded, onToggle }) => {
  const categoryTopics = topics.filter(t => t.category === category);

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Code className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {category}
          </span>
          <Badge variant="secondary" className="text-xs">
            {categoryTopics.length}
          </Badge>
        </div>
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2 pl-4">
              {categoryTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Topic Card Component
const TopicCard: React.FC<{ topic: typeof dsaTopics[0] }> = ({ topic }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer group border-l-4 border-l-primary-500"
        onClick={() => navigate(`/dsa/${topic.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {topic.title}
            </h4>
            <Badge variant={
              topic.difficulty === 'Easy' ? 'success' :
              topic.difficulty === 'Medium' ? 'warning' : 'danger'
            } className="text-xs">
              {topic.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {topic.description}
          </p>
          <div className="flex items-center justify-between">
            <ProgressRing progress={topic.progress} size={32} />
            <span className="text-xs text-gray-500">
              {topic.progress}% complete
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Code Playground Component
const CodePlayground: React.FC<{ topic: typeof dsaTopics[0] }> = ({ topic }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof topic.content.codeTemplates>('javascript');
  const [code, setCode] = useState(topic.content.codeTemplates[selectedLanguage]);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      const result = await mockExecuteCode(code, selectedLanguage);
      setExecutionResult(result);
      setOutput(result.output);
      if (result.error) {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(topic.content.codeTemplates[selectedLanguage]);
    setOutput('');
    setExecutionResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              const lang = e.target.value as keyof typeof topic.content.codeTemplates;
              setSelectedLanguage(lang);
              setCode(topic.content.codeTemplates[lang]);
              setOutput('');
              setExecutionResult(null);
            }}
            className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus-ring"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHint ? 'Hide' : 'Show'} Hint</span>
          </motion.button>

          <motion.button
            onClick={() => setShowSolution(!showSolution)}
            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className={cn("w-4 h-4", showSolution && "text-green-600")} />
            <span>{showSolution ? 'Hide' : 'Show'} Solution</span>
          </motion.button>
        </div>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Hint
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              {topic.content.hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution */}
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Solution Approach
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {topic.content.solution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Code Editor
            </h3>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleResetCode}
                disabled={isRunning}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>

              <motion.button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </motion.button>
            </div>
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={selectedLanguage}
            height="400px"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Output & Test Cases
          </h3>

          {/* Console Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Console Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg min-h-[120px] whitespace-pre-wrap">
                {output || 'Click "Run Code" to execute your solution...'}
              </div>
              {executionResult && (
                <div className="mt-2 text-xs text-gray-500">
                  Execution time: {executionResult.executionTime}ms
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topic.content.testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Input: {testCase.input}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Expected: {testCase.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Topic Detail Component
const TopicDetail: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = dsaTopics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Topic not found
          </h2>
          <button
            onClick={() => navigate('/dsa')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to DSA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dsa')}
          className="mb-4 px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          ← Back to DSA
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {topic.title}
              </h1>
              <Badge variant={
                topic.difficulty === 'Easy' ? 'success' :
                topic.difficulty === 'Medium' ? 'warning' : 'danger'
              }>
                {topic.difficulty}
              </Badge>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {topic.description}
            </p>
          </div>
          <div className="ml-6">
            <ProgressRing progress={topic.progress} size={80} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {topic.content.explanation}
              </p>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topic.content.examples.map((example, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Example {index + 1}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                        <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Output:</span>
                        <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {example.output}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Explanation:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {example.explanation}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Playground */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Code Playground</CardTitle>
            </CardHeader>
            <CardContent>
              <CodePlayground topic={topic} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <ProgressRing progress={topic.progress} size={100} className="mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.progress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Mark as Complete
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Add to Favorites
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Practice Similar
              </button>
            </CardContent>
          </Card>

          {/* Category Info */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="w-full justify-center">
                {topic.category}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main DSA Page Component
const DSA: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Arrays & Strings']) // Default expanded
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

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
                Master <span className="text-primary-600 dark:text-primary-400">Data Structures</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Interactive coding challenges with visual explanations, code playground, and comprehensive test cases.
              </p>
            </motion.div>

            {/* Topic Categories */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {dsaCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TopicCategory
                    category={category}
                    topics={dsaTopics}
                    expanded={expandedCategories.has(category)}
                    onToggle={() => toggleCategory(category)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        }
      />
      <Route path=":topicId" element={<TopicDetail />} />
    </Routes>
  );
};

export default DSA;
