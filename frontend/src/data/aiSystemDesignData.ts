export const aiSystemDesignTopics = [
  {
    id: 'ai-llm',
    title: 'Large Language Models (LLMs)',
    description: 'Understanding transformer architectures, prompting, and fine‑tuning.',
    difficulty: 'Intermediate',
    progress: 0,
    icon: 'Zap',
    color: 'bg-purple-500',
    content: {
      overview: 'LLMs are the backbone of modern AI applications, enabling natural language understanding and generation.',
      concepts: ['Transformer', 'Self‑Attention', 'Prompt Engineering', 'Fine‑Tuning'],
      steps: [
        { title: 'Setup Environment', description: 'Install Node, TypeScript, and required packages.' },
        { title: 'Load Model', description: 'Use OpenAI or HuggingFace APIs to load a model.' },
        { title: 'Design Prompt', description: 'Craft effective prompts for your use‑case.' },
        { title: 'Evaluate Output', description: 'Assess model responses and iterate.' }
      ],
      examples: ['ChatGPT', 'Claude', 'Gemini']
    }
  },
  {
    id: 'ai-rag',
    title: 'Retrieval‑Augmented Generation (RAG)',
    description: 'Combine LLMs with external knowledge sources for up‑to‑date answers.',
    difficulty: 'Advanced',
    progress: 0,
    icon: 'Database',
    color: 'bg-indigo-500',
    content: {
      overview: 'RAG pipelines retrieve relevant documents and feed them to LLMs for context‑aware generation.',
      concepts: ['Vector Embeddings', 'Similarity Search', 'Hybrid Retrieval', 'Chunking'],
      steps: [
        { title: 'Create Vector Store', description: 'Index documents with embeddings.' },
        { title: 'Query Retrieval', description: 'Search for relevant chunks at inference time.' },
        { title: 'Combine with LLM', description: 'Pass retrieved context to the model.' }
      ],
      examples: ['OpenAI Retrieval Plugin', 'LangChain RAG pipelines']
    }
  }
];
