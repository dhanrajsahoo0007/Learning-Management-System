import { emptyContent, type ArchitectureTopic } from '../systemDesignTypes';
import { toArticle } from './types';

export const aimlInterviewTopics: ArchitectureTopic[] = [
  {
    id: "aiml-iv-deep-learning",
    title: "Deep learning interview",
    description: "Core DL questions with concise reference answers.",
    difficulty: "Intermediate",
    progress: 0,
    icon: "Brain",
    color: "bg-violet-600",
    section: "interviews",
    track: 'aiml',
    prerequisites: [],
    estimatedMinutes: 8,
    order: 0,
    content: emptyContent({ overview: "Core DL questions with concise reference answers." }),
    article: toArticle([
      { type: 'qa', question: "What causes vanishing gradients, and what mitigations exist?", answer: "Deep stacks of saturating activations or poorly scaled initialization can shrink gradients layer-by-layer. Mitigations include better initialization, residual connections, normalization layers, gated architectures, and modern activations." },
      { type: 'qa', question: "Why do we use batch normalization?", answer: "It stabilizes activations and gradients across minibatches, often enabling higher learning rates and faster convergence—while also acting as a mild regularizer during training." }
    ]),
  },
  {
    id: "aiml-iv-llms",
    title: "LLM interview",
    description: "Practical LLM topics for interviews and on-call conversations.",
    difficulty: "Intermediate",
    progress: 0,
    icon: "MessageSquare",
    color: "bg-violet-600",
    section: "interviews",
    track: 'aiml',
    prerequisites: [],
    estimatedMinutes: 8,
    order: 1,
    content: emptyContent({ overview: "Practical LLM topics for interviews and on-call conversations." }),
    article: toArticle([
      { type: 'qa', question: "What breaks when prompts exceed the context window?", answer: "Tokens beyond the window are truncated or rejected, so retrieval and summarization must compress or select content. Product behavior should degrade gracefully with explicit user messaging and logging." },
      { type: 'qa', question: "When would you choose RAG over fine-tuning?", answer: "RAG is strong when facts change often, you need citations, or you want to avoid expensive retraining. Fine-tuning helps when behavior or style must be deeply baked into the model and data is stable." }
    ]),
  },
  {
    id: "aiml-iv-ml-fundamentals",
    title: "ML fundamentals interview",
    description: "Short questions that map to day-one ML interviews.",
    difficulty: "Intermediate",
    progress: 0,
    icon: "BookOpen",
    color: "bg-violet-600",
    section: "interviews",
    track: 'aiml',
    prerequisites: [],
    estimatedMinutes: 8,
    order: 2,
    content: emptyContent({ overview: "Short questions that map to day-one ML interviews." }),
    article: toArticle([
      { type: 'qa', question: "Explain the bias–variance tradeoff in plain language.", answer: "High bias tends to underfit (too simple to capture signal). High variance tends to overfit (captures noise). The goal is a model that generalizes: enough capacity for the signal, plus regularization, data, and evaluation discipline to control variance." },
      { type: 'qa', question: "What is data leakage and why is it dangerous?", answer: "Leakage happens when information from the label or future appears in features during training, inflating offline metrics. It is dangerous because production performance collapses once that signal disappears." }
    ]),
  }
];
