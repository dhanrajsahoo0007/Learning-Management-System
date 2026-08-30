import type { HubPage } from './types';

export const aimlHubs: Record<string, HubPage> = {
  "machine-learning": {
    "id": "aiml-path-machine-learning",
    "title": "Machine learning path",
    "description": "Core ideas, workflows, and practice for classical and modern ML.",
    "icon": "cpu",
    "categories": [
      {
        "title": "Regression",
        "icon": "trending-up",
        "subtitle": "Predict continuous values and understand relationships between variables.",
        "cards": [
          {
            "title": "Linear Regression",
            "icon": "trending-up",
            "description": "Fit a line through data points to minimize error.",
            "href": "/ai-ml/learning-paths/machine-learning/linear-regression",
            "topicId": "aiml-ml-linear-regression"
          },
          {
            "title": "Lasso & Ridge",
            "icon": "target",
            "description": "Understand L1 and L2 regularization to prevent overfitting.",
            "href": "/ai-ml/learning-paths/machine-learning/lasso-ridge-regression",
            "topicId": "aiml-ml-lasso-ridge-regression"
          },
          {
            "title": "Polynomial Regression",
            "icon": "triangle",
            "description": "Explore non-linear relationships and the bias-variance tradeoff.",
            "href": "/ai-ml/learning-paths/machine-learning/polynomial-regression",
            "topicId": "aiml-ml-polynomial-regression"
          },
          {
            "title": "ElasticNet Regression",
            "icon": "network",
            "description": "Combine L1 and L2 penalties for robust feature selection.",
            "href": "/ai-ml/learning-paths/machine-learning/elasticnet-regression",
            "topicId": "aiml-ml-elasticnet-regression"
          },
          {
            "title": "Support Vector Regression",
            "icon": "route",
            "description": "Use support vectors to fit a continuous curve within a margin.",
            "href": "/ai-ml/learning-paths/machine-learning/support-vector-regression",
            "topicId": "aiml-ml-support-vector-regression"
          },
          {
            "title": "Decision Tree Regression",
            "icon": "tree-deciduous",
            "description": "Partition data space to predict continuous values.",
            "href": "/ai-ml/learning-paths/machine-learning/decision-tree-regression",
            "topicId": "aiml-ml-decision-tree-regression"
          },
          {
            "title": "Random Forest Regression",
            "icon": "tree-pine",
            "description": "Ensemble of trees to reduce variance in continuous predictions.",
            "href": "/ai-ml/learning-paths/machine-learning/random-forest-regression",
            "topicId": "aiml-ml-random-forest-regression"
          },
          {
            "title": "Gradient Boosting Regression",
            "icon": "rocket",
            "description": "Sequentially correct errors to optimize continuous predictions.",
            "href": "/ai-ml/learning-paths/machine-learning/gradient-boosting-regression",
            "topicId": "aiml-ml-gradient-boosting-regression"
          }
        ]
      },
      {
        "title": "Classification",
        "icon": "folder-tree",
        "subtitle": "Predict categories and learn decision boundaries.",
        "cards": [
          {
            "title": "Logistic Regression",
            "icon": "bar-chart",
            "description": "Classification with sigmoid curves and decision boundaries.",
            "href": "/ai-ml/learning-paths/machine-learning/logistic-regression",
            "topicId": "aiml-ml-logistic-regression"
          },
          {
            "title": "K-Nearest Neighbors",
            "icon": "users",
            "description": "Classify points based on proximity to their neighbors.",
            "href": "/ai-ml/learning-paths/machine-learning/k-nearest-neighbors",
            "topicId": "aiml-ml-k-nearest-neighbors"
          },
          {
            "title": "Naive Bayes",
            "icon": "dices",
            "description": "Learn probabilistic classification with Bayes' theorem.",
            "href": "/ai-ml/learning-paths/machine-learning/naive-bayes",
            "topicId": "aiml-ml-naive-bayes"
          },
          {
            "title": "Support Vector Machines",
            "icon": "search",
            "description": "Visualize support vectors and margins with different kernels.",
            "href": "/ai-ml/learning-paths/machine-learning/support-vector-machines",
            "topicId": "aiml-ml-support-vector-machines"
          },
          {
            "title": "Decision Tree Classifier",
            "icon": "tree-deciduous",
            "description": "Build trees step-by-step to partition and classify data.",
            "href": "/ai-ml/learning-paths/machine-learning/decision-tree-classifier",
            "topicId": "aiml-ml-decision-tree-classifier"
          },
          {
            "title": "Random Forest Classifier",
            "icon": "tree-pine",
            "description": "Use multiple trees to make robust classifications.",
            "href": "/ai-ml/learning-paths/machine-learning/random-forest-classifier",
            "topicId": "aiml-ml-random-forest-classifier"
          },
          {
            "title": "Gradient Boosting Classifier",
            "icon": "rocket",
            "description": "State-of-the-art boosted trees for classification.",
            "href": "/ai-ml/learning-paths/machine-learning/gradient-boosting-classifier",
            "topicId": "aiml-ml-gradient-boosting-classifier"
          }
        ]
      },
      {
        "title": "Clustering",
        "icon": "circle-dot",
        "subtitle": "Unsupervised learning to group similar data.",
        "cards": [
          {
            "title": "K-Means Clustering",
            "icon": "target",
            "description": "Iteratively group data into K distinct clusters.",
            "href": "/ai-ml/learning-paths/machine-learning/k-means-clustering",
            "topicId": "aiml-ml-k-means-clustering"
          },
          {
            "title": "Hierarchical Clustering",
            "icon": "git-branch",
            "description": "Build a hierarchy of clusters using agglomerative techniques.",
            "href": "/ai-ml/learning-paths/machine-learning/hierarchical-clustering",
            "topicId": "aiml-ml-hierarchical-clustering"
          },
          {
            "title": "DBSCAN",
            "icon": "map-pin",
            "description": "Density-based clustering that finds arbitrarily shaped clusters.",
            "href": "/ai-ml/learning-paths/machine-learning/dbscan",
            "topicId": "aiml-ml-dbscan"
          },
          {
            "title": "Gaussian Mixture Models",
            "icon": "bell",
            "description": "Probabilistic model assuming data is generated from a mixture of Gaussians.",
            "href": "/ai-ml/learning-paths/machine-learning/gaussian-mixture-models",
            "topicId": "aiml-ml-gaussian-mixture-models"
          }
        ]
      },
      {
        "title": "Tree-Based Models",
        "icon": "tree-pine",
        "subtitle": "Models based on decision trees used for both regression and classification.",
        "cards": [
          {
            "title": "Decision Tree",
            "icon": "tree-deciduous",
            "description": "The foundational building block of tree-based methods.",
            "href": "/ai-ml/learning-paths/machine-learning/decision-tree",
            "topicId": "aiml-ml-decision-tree"
          },
          {
            "title": "Random Forest",
            "icon": "tree-pine",
            "description": "A powerful bagging ensemble of decision trees.",
            "href": "/ai-ml/learning-paths/machine-learning/random-forest",
            "topicId": "aiml-ml-random-forest"
          },
          {
            "title": "Extra Trees",
            "icon": "palmtree",
            "description": "Extremely randomized trees to further reduce variance.",
            "href": "/ai-ml/learning-paths/machine-learning/extra-trees",
            "topicId": "aiml-ml-extra-trees"
          },
          {
            "title": "Gradient Boosting",
            "icon": "rocket",
            "description": "Sequential tree building to correct previous mistakes.",
            "href": "/ai-ml/learning-paths/machine-learning/gradient-boosting",
            "topicId": "aiml-ml-gradient-boosting"
          },
          {
            "title": "XGBoost",
            "icon": "zap",
            "description": "Highly optimized, scalable gradient boosting system.",
            "href": "/ai-ml/learning-paths/machine-learning/xgboost",
            "topicId": "aiml-ml-xgboost"
          },
          {
            "title": "LightGBM",
            "icon": "lightbulb",
            "description": "Fast, distributed gradient boosting framework by Microsoft.",
            "href": "/ai-ml/learning-paths/machine-learning/lightgbm",
            "topicId": "aiml-ml-lightgbm"
          },
          {
            "title": "CatBoost",
            "icon": "cat",
            "description": "Gradient boosting with built-in handling of categorical features.",
            "href": "/ai-ml/learning-paths/machine-learning/catboost",
            "topicId": "aiml-ml-catboost"
          }
        ]
      },
      {
        "title": "Dimensionality Reduction",
        "icon": "minimize",
        "subtitle": "Reduce the number of features while preserving information.",
        "cards": [
          {
            "title": "PCA",
            "icon": "compass",
            "description": "Linear technique to find the principal components of data.",
            "href": "/ai-ml/learning-paths/machine-learning/pca",
            "topicId": "aiml-ml-pca"
          },
          {
            "title": "t-SNE",
            "icon": "orbit",
            "description": "Non-linear technique for visualizing high-dimensional data.",
            "href": "/ai-ml/learning-paths/machine-learning/t-sne",
            "topicId": "aiml-ml-t-sne"
          },
          {
            "title": "UMAP",
            "icon": "map",
            "description": "Fast and scalable non-linear dimensionality reduction.",
            "href": "/ai-ml/learning-paths/machine-learning/umap",
            "topicId": "aiml-ml-umap"
          }
        ]
      },
      {
        "title": "Ensemble Models",
        "icon": "combine",
        "subtitle": "Combine multiple models to improve overall performance.",
        "cards": [
          {
            "title": "Bagging",
            "icon": "package",
            "description": "Bootstrap aggregating to decrease model variance.",
            "href": "/ai-ml/learning-paths/machine-learning/bagging",
            "topicId": "aiml-ml-bagging"
          },
          {
            "title": "Boosting",
            "icon": "rocket",
            "description": "Sequential training to reduce bias and underfitting.",
            "href": "/ai-ml/learning-paths/machine-learning/boosting",
            "topicId": "aiml-ml-boosting"
          },
          {
            "title": "Stacking",
            "icon": "layers",
            "description": "Combine predictions of several base estimators with a meta-model.",
            "href": "/ai-ml/learning-paths/machine-learning/stacking",
            "topicId": "aiml-ml-stacking"
          },
          {
            "title": "Voting",
            "icon": "vote",
            "description": "Aggregate predictions of multiple models via majority or average.",
            "href": "/ai-ml/learning-paths/machine-learning/voting",
            "topicId": "aiml-ml-voting"
          }
        ]
      }
    ]
  },
  "ml-system-design": {
    "id": "aiml-path-ml-system-design",
    "title": "ML System Design",
    "description": "End-to-end architecture patterns for building production ML and LLM systems — covering data pipelines, model serving, orchestration, observability, and operational excellence.",
    "icon": "server",
    "categories": [
      {
        "title": "System Design Interview",
        "icon": "presentation",
        "subtitle": "End-to-end system design problems covering online serving, feature engineering, and architecture trade-offs.",
        "cards": [
          {
            "title": "Online Model Serving",
            "icon": "radio",
            "description": "Latency, scaling, and safe rollout for real-time ML.",
            "href": "/system-design/ai/ml-system-design/online-serving",
            "topicId": "aiml-mlsd-online-serving"
          },
          {
            "title": "Batch vs Streaming Features",
            "icon": "git-merge",
            "description": "How data movement shapes ML system design.",
            "href": "/system-design/ai/ml-system-design/batch-and-streaming",
            "topicId": "aiml-mlsd-batch-and-streaming"
          }
        ]
      },
      {
        "title": "Data & Ingestion Layer",
        "icon": "database",
        "subtitle": "Connectors, processing pipelines, and versioning for getting data into your ML system.",
        "cards": [
          {
            "title": "Data Sources & Connectors",
            "icon": "link2",
            "description": "Integrate structured, unstructured, and streaming data sources into ML pipelines.",
            "href": "/system-design/ai/ml-system-design/data-sources-connectors",
            "topicId": "aiml-mlsd-data-sources-connectors"
          },
          {
            "title": "Document Processing & Chunking",
            "icon": "scissors",
            "description": "Parse, split, and prepare documents for embedding and retrieval.",
            "href": "/system-design/ai/ml-system-design/document-processing-chunking",
            "topicId": "aiml-mlsd-document-processing-chunking"
          },
          {
            "title": "Embedding Generation Pipeline",
            "icon": "binary",
            "description": "Design scalable pipelines that convert raw data into vector representations.",
            "href": "/system-design/ai/ml-system-design/embedding-generation-pipeline",
            "topicId": "aiml-mlsd-embedding-generation-pipeline"
          },
          {
            "title": "Data Versioning & Lineage",
            "icon": "git-commit",
            "description": "Track data provenance, schema evolution, and reproducibility across experiments.",
            "href": "/system-design/ai/ml-system-design/data-versioning-lineage",
            "topicId": "aiml-mlsd-data-versioning-lineage"
          },
          {
            "title": "Ingestion Orchestration",
            "icon": "workflow",
            "description": "Coordinate ETL/ELT workflows for reliable data movement at scale.",
            "href": "/system-design/ai/ml-system-design/ingestion-orchestration",
            "topicId": "aiml-mlsd-ingestion-orchestration"
          }
        ]
      },
      {
        "title": "Model Serving & Inference",
        "icon": "server",
        "subtitle": "Engines, optimization, and scaling strategies for serving ML models in production.",
        "cards": [
          {
            "title": "LLM Inference Engine",
            "icon": "cpu",
            "description": "vLLM, TensorRT-LLM, TGI — high-throughput engines for large language models.",
            "href": "/system-design/ai/ml-system-design/llm-inference-engine",
            "topicId": "aiml-mlsd-llm-inference-engine"
          },
          {
            "title": "Quantization & Optimization",
            "icon": "gauge",
            "description": "Reduce model size and latency with quantization, pruning, and distillation.",
            "href": "/system-design/ai/ml-system-design/quantization-optimization",
            "topicId": "aiml-mlsd-quantization-optimization"
          },
          {
            "title": "Load Balancing & Auto-Scaling",
            "icon": "scale",
            "description": "Distribute inference load and scale GPU resources dynamically.",
            "href": "/system-design/ai/ml-system-design/load-balancing-autoscaling",
            "topicId": "aiml-mlsd-load-balancing-autoscaling"
          },
          {
            "title": "Batch vs Real-time Inference",
            "icon": "clock",
            "description": "Choose between throughput-optimized batch and latency-sensitive online serving.",
            "href": "/system-design/ai/ml-system-design/batch-vs-realtime-inference",
            "topicId": "aiml-mlsd-batch-vs-realtime-inference"
          },
          {
            "title": "Multi-Model Routing & Fallbacks",
            "icon": "shuffle",
            "description": "Route requests across models with fallback chains and cost optimization.",
            "href": "/system-design/ai/ml-system-design/multi-model-routing-fallbacks",
            "topicId": "aiml-mlsd-multi-model-routing-fallbacks"
          }
        ]
      },
      {
        "title": "Prompt & Orchestration Layer",
        "icon": "message-circle",
        "subtitle": "Template management, chain orchestration, and output validation for LLM workflows.",
        "cards": [
          {
            "title": "Prompt Templates & Versioning",
            "icon": "book-template",
            "description": "Manage prompt templates with version control and A/B testing support.",
            "href": "/system-design/ai/ml-system-design/prompt-templates-versioning",
            "topicId": "aiml-mlsd-prompt-templates-versioning"
          },
          {
            "title": "Prompt Management & Optimization",
            "icon": "wrench",
            "description": "Optimize prompts systematically for cost, quality, and latency.",
            "href": "/system-design/ai/ml-system-design/prompt-management-optimization",
            "topicId": "aiml-mlsd-prompt-management-optimization"
          },
          {
            "title": "Chain / Flow Orchestration",
            "icon": "workflow",
            "description": "Build multi-step LLM pipelines with LangGraph, DSPy, and custom DAGs.",
            "href": "/system-design/ai/ml-system-design/chain-flow-orchestration",
            "topicId": "aiml-mlsd-chain-flow-orchestration"
          },
          {
            "title": "Structured Output Generation",
            "icon": "code2",
            "description": "Enforce JSON schemas, function calling, and typed outputs from LLMs.",
            "href": "/system-design/ai/ml-system-design/structured-output-generation",
            "topicId": "aiml-mlsd-structured-output-generation"
          },
          {
            "title": "Guardrails & Output Validation",
            "icon": "shield-check",
            "description": "Validate, filter, and constrain LLM outputs for safety and correctness.",
            "href": "/system-design/ai/ml-system-design/guardrails-output-validation",
            "topicId": "aiml-mlsd-guardrails-output-validation"
          }
        ]
      },
      {
        "title": "Memory & State Management",
        "icon": "brain",
        "subtitle": "Short-term context, long-term recall, caching, and state persistence for stateful AI systems.",
        "cards": [
          {
            "title": "Conversation / Short-Term Memory",
            "icon": "message-square",
            "description": "Manage conversation context windows and sliding-window strategies.",
            "href": "/system-design/ai/ml-system-design/conversation-short-term-memory",
            "topicId": "aiml-mlsd-conversation-short-term-memory"
          },
          {
            "title": "Long-Term Vector Memory",
            "icon": "hard-drive",
            "description": "Store and retrieve episodic memory using vector databases.",
            "href": "/system-design/ai/ml-system-design/long-term-vector-memory",
            "topicId": "aiml-mlsd-long-term-vector-memory"
          },
          {
            "title": "Semantic Caching",
            "icon": "thermometer",
            "description": "Cache semantically similar queries to reduce latency and cost.",
            "href": "/system-design/ai/ml-system-design/semantic-caching",
            "topicId": "aiml-mlsd-semantic-caching"
          },
          {
            "title": "Memory Summarization & Compression",
            "icon": "archive",
            "description": "Compress conversation history while preserving key information.",
            "href": "/system-design/ai/ml-system-design/memory-summarization-compression",
            "topicId": "aiml-mlsd-memory-summarization-compression"
          },
          {
            "title": "State Persistence & Retrieval",
            "icon": "save",
            "description": "Persist agent and workflow state across sessions and restarts.",
            "href": "/system-design/ai/ml-system-design/state-persistence-retrieval",
            "topicId": "aiml-mlsd-state-persistence-retrieval"
          }
        ]
      },
      {
        "title": "Monitoring & Observability",
        "icon": "activity",
        "subtitle": "Tracing, metrics, cost tracking, and quality monitoring for LLMOps.",
        "cards": [
          {
            "title": "Tracing & Logging",
            "icon": "eye",
            "description": "Capture end-to-end traces of prompts, responses, tool calls, and retrievals.",
            "href": "/system-design/ai/ml-system-design/tracing-logging",
            "topicId": "aiml-mlsd-tracing-logging"
          },
          {
            "title": "Latency & Token Monitoring",
            "icon": "timer",
            "description": "Track inference latency percentiles and token consumption patterns.",
            "href": "/system-design/ai/ml-system-design/latency-token-monitoring",
            "topicId": "aiml-mlsd-latency-token-monitoring"
          },
          {
            "title": "Cost Tracking & Attribution",
            "icon": "dollar-sign",
            "description": "Attribute LLM costs to features, users, and teams for budgeting.",
            "href": "/system-design/ai/ml-system-design/cost-tracking-attribution",
            "topicId": "aiml-mlsd-cost-tracking-attribution"
          },
          {
            "title": "Quality Metrics",
            "icon": "star",
            "description": "Measure faithfulness, relevance, helpfulness, and coherence of outputs.",
            "href": "/system-design/ai/ml-system-design/quality-metrics",
            "topicId": "aiml-mlsd-quality-metrics"
          },
          {
            "title": "Hallucination & Safety Detection",
            "icon": "alert-triangle",
            "description": "Detect and flag hallucinated content and unsafe outputs in real time.",
            "href": "/system-design/ai/ml-system-design/hallucination-safety-detection",
            "topicId": "aiml-mlsd-hallucination-safety-detection"
          },
          {
            "title": "LLM-as-Judge Evaluation",
            "icon": "gavel",
            "description": "Use LLMs to evaluate other LLM outputs with rubric-based scoring.",
            "href": "/system-design/ai/ml-system-design/llm-as-judge-evaluation",
            "topicId": "aiml-mlsd-llm-as-judge-evaluation"
          },
          {
            "title": "Alerting & Dashboards",
            "icon": "layout-dashboard",
            "description": "Build operational dashboards with anomaly detection and alerting.",
            "href": "/system-design/ai/ml-system-design/alerting-dashboards",
            "topicId": "aiml-mlsd-alerting-dashboards"
          }
        ]
      },
      {
        "title": "Evaluation & Testing",
        "icon": "test-tube",
        "subtitle": "Offline benchmarks, online evaluation, regression testing, and drift detection.",
        "cards": [
          {
            "title": "Offline Evaluation Benchmarks",
            "icon": "flask",
            "description": "Design benchmark suites for systematic model comparison before deployment.",
            "href": "/system-design/ai/ml-system-design/offline-evaluation-benchmarks",
            "topicId": "aiml-mlsd-offline-evaluation-benchmarks"
          },
          {
            "title": "Online / Production Evaluation",
            "icon": "radio",
            "description": "Evaluate model quality in production with shadow scoring and live metrics.",
            "href": "/system-design/ai/ml-system-design/online-production-evaluation",
            "topicId": "aiml-mlsd-online-production-evaluation"
          },
          {
            "title": "Automated Regression Testing",
            "icon": "bug",
            "description": "Catch quality regressions with automated test suites on every change.",
            "href": "/system-design/ai/ml-system-design/automated-regression-testing",
            "topicId": "aiml-mlsd-automated-regression-testing"
          },
          {
            "title": "Human Feedback Collection",
            "icon": "thumbs-up",
            "description": "Design feedback loops for collecting and incorporating human judgments.",
            "href": "/system-design/ai/ml-system-design/human-feedback-collection",
            "topicId": "aiml-mlsd-human-feedback-collection"
          },
          {
            "title": "A/B Testing for Prompts & Models",
            "icon": "split",
            "description": "Run controlled experiments to compare prompts, models, and configurations.",
            "href": "/system-design/ai/ml-system-design/ab-testing-prompts-models",
            "topicId": "aiml-mlsd-ab-testing-prompts-models"
          },
          {
            "title": "Drift Detection",
            "icon": "trending-down",
            "description": "Monitor for data, concept, and output drift in production systems.",
            "href": "/system-design/ai/ml-system-design/drift-detection",
            "topicId": "aiml-mlsd-drift-detection"
          }
        ]
      },
      {
        "title": "MLOps / LLMOps Pipelines",
        "icon": "settings",
        "subtitle": "CI/CD, experiment tracking, model registry, and continuous training for ML systems.",
        "cards": [
          {
            "title": "CI/CD/CT for Prompts & Pipelines",
            "icon": "workflow",
            "description": "Automate testing, validation, and deployment of prompts and ML pipelines.",
            "href": "/system-design/ai/ml-system-design/cicd-ct-pipelines",
            "topicId": "aiml-mlsd-cicd-ct-pipelines"
          },
          {
            "title": "Experiment Tracking & Version Control",
            "icon": "git-commit",
            "description": "Track experiments, hyperparameters, and artifacts systematically.",
            "href": "/system-design/ai/ml-system-design/experiment-tracking-version-control",
            "topicId": "aiml-mlsd-experiment-tracking-version-control"
          },
          {
            "title": "Model Registry & Governance",
            "icon": "archive",
            "description": "Catalog, version, and govern models from training to retirement.",
            "href": "/system-design/ai/ml-system-design/model-registry-governance",
            "topicId": "aiml-mlsd-model-registry-governance"
          },
          {
            "title": "Automated Retraining & Fine-tuning",
            "icon": "rotate-cw",
            "description": "Trigger retraining and fine-tuning based on data drift or schedule.",
            "href": "/system-design/ai/ml-system-design/automated-retraining-finetuning",
            "topicId": "aiml-mlsd-automated-retraining-finetuning"
          },
          {
            "title": "Continuous Data & Knowledge Integration",
            "icon": "repeat",
            "description": "Continuously ingest and integrate new data and knowledge sources.",
            "href": "/system-design/ai/ml-system-design/continuous-data-knowledge-integration",
            "topicId": "aiml-mlsd-continuous-data-knowledge-integration"
          }
        ]
      },
      {
        "title": "Safety, Security & Governance",
        "icon": "shield",
        "subtitle": "Content moderation, access control, compliance, and data privacy for responsible AI.",
        "cards": [
          {
            "title": "Content Moderation & Red-Teaming",
            "icon": "shield-alert",
            "description": "Proactively test and moderate AI outputs for harmful content.",
            "href": "/system-design/ai/ml-system-design/content-moderation-red-teaming",
            "topicId": "aiml-mlsd-content-moderation-red-teaming"
          },
          {
            "title": "Bias & Toxicity Detection",
            "icon": "siren",
            "description": "Detect and mitigate bias, toxicity, and fairness issues in model outputs.",
            "href": "/system-design/ai/ml-system-design/bias-toxicity-detection",
            "topicId": "aiml-mlsd-bias-toxicity-detection"
          },
          {
            "title": "Access Control & RBAC",
            "icon": "lock",
            "description": "Implement role-based access control for models, data, and endpoints.",
            "href": "/system-design/ai/ml-system-design/access-control-rbac",
            "topicId": "aiml-mlsd-access-control-rbac"
          },
          {
            "title": "Compliance & Audit Logging",
            "icon": "scroll-text",
            "description": "Meet GDPR, AI Act, and SOC2 requirements with comprehensive audit trails.",
            "href": "/system-design/ai/ml-system-design/compliance-audit-logging",
            "topicId": "aiml-mlsd-compliance-audit-logging"
          },
          {
            "title": "Data Privacy & PII Handling",
            "icon": "fingerprint",
            "description": "Detect, mask, and manage personally identifiable information in ML pipelines.",
            "href": "/system-design/ai/ml-system-design/data-privacy-pii-handling",
            "topicId": "aiml-mlsd-data-privacy-pii-handling"
          }
        ]
      },
      {
        "title": "Deployment & Scaling",
        "icon": "cloud",
        "subtitle": "Containerization, GPU management, multi-region deployment, and traffic management.",
        "cards": [
          {
            "title": "Containerization & Orchestration",
            "icon": "container",
            "description": "Package and orchestrate ML workloads with Kubernetes and serverless.",
            "href": "/system-design/ai/ml-system-design/containerization-orchestration",
            "topicId": "aiml-mlsd-containerization-orchestration"
          },
          {
            "title": "GPU/TPU Resource Management",
            "icon": "cpu",
            "description": "Optimize GPU allocation, sharing, and scheduling for cost efficiency.",
            "href": "/system-design/ai/ml-system-design/gpu-tpu-resource-management",
            "topicId": "aiml-mlsd-gpu-tpu-resource-management"
          },
          {
            "title": "Multi-Region / Edge Deployment",
            "icon": "globe",
            "description": "Deploy models closer to users with multi-region and edge strategies.",
            "href": "/system-design/ai/ml-system-design/multi-region-edge-deployment",
            "topicId": "aiml-mlsd-multi-region-edge-deployment"
          },
          {
            "title": "Rollback & Blue-Green Deployment",
            "icon": "undo2",
            "description": "Safely roll out model updates with blue-green and canary strategies.",
            "href": "/system-design/ai/ml-system-design/rollback-blue-green-deployment",
            "topicId": "aiml-mlsd-rollback-blue-green-deployment"
          },
          {
            "title": "Rate Limiting & Throttling",
            "icon": "gauge",
            "description": "Protect services with rate limiting, throttling, and backpressure.",
            "href": "/system-design/ai/ml-system-design/rate-limiting-throttling",
            "topicId": "aiml-mlsd-rate-limiting-throttling"
          }
        ]
      },
      {
        "title": "Feedback & Improvement Loop",
        "icon": "refresh-cw",
        "subtitle": "User feedback, preference learning, continuous improvement, and knowledge base automation.",
        "cards": [
          {
            "title": "User Feedback Collection",
            "icon": "heart",
            "description": "Design feedback mechanisms — thumbs up/down, corrections, and ratings.",
            "href": "/system-design/ai/ml-system-design/user-feedback-collection",
            "topicId": "aiml-mlsd-user-feedback-collection"
          },
          {
            "title": "Reinforcement & Preference Learning",
            "icon": "trending-up",
            "description": "Apply RLHF, DPO, and preference optimization from collected feedback.",
            "href": "/system-design/ai/ml-system-design/reinforcement-preference-learning",
            "topicId": "aiml-mlsd-reinforcement-preference-learning"
          },
          {
            "title": "Continuous Improvement Pipeline",
            "icon": "rotate-cw",
            "description": "Automate the cycle from feedback to root cause analysis to model updates.",
            "href": "/system-design/ai/ml-system-design/continuous-improvement-pipeline",
            "topicId": "aiml-mlsd-continuous-improvement-pipeline"
          },
          {
            "title": "Knowledge Base Update Automation",
            "icon": "book-open",
            "description": "Keep knowledge bases current with automated ingestion and refresh.",
            "href": "/system-design/ai/ml-system-design/knowledge-base-update-automation",
            "topicId": "aiml-mlsd-knowledge-base-update-automation"
          }
        ]
      }
    ],
    "groups": [
      {
        "name": "Core Principles",
        "icon": "book-open",
        "categories": [
          "Data & Ingestion Layer",
          "Model Serving & Inference",
          "Prompt & Orchestration Layer",
          "Memory & State Management",
          "Monitoring & Observability",
          "Evaluation & Testing",
          "MLOps / LLMOps Pipelines",
          "Safety, Security & Governance",
          "Deployment & Scaling",
          "Feedback & Improvement Loop"
        ]
      },
      {
        "name": "System Design Interview",
        "icon": "presentation",
        "categories": [
          "System Design Interview"
        ]
      }
    ]
  }
};

export const aimlOutlineDefs = {
  "machineLearning": [
    {
      "id": "regression",
      "title": "Regression",
      "icon": "TrendingUp",
      "ids": [
        "aiml-ml-linear-regression",
        "aiml-ml-lasso-ridge-regression",
        "aiml-ml-polynomial-regression",
        "aiml-ml-elasticnet-regression",
        "aiml-ml-support-vector-regression",
        "aiml-ml-decision-tree-regression",
        "aiml-ml-random-forest-regression",
        "aiml-ml-gradient-boosting-regression"
      ]
    },
    {
      "id": "classification",
      "title": "Classification",
      "icon": "FolderTree",
      "ids": [
        "aiml-ml-logistic-regression",
        "aiml-ml-k-nearest-neighbors",
        "aiml-ml-naive-bayes",
        "aiml-ml-support-vector-machines",
        "aiml-ml-decision-tree-classifier",
        "aiml-ml-random-forest-classifier",
        "aiml-ml-gradient-boosting-classifier"
      ]
    },
    {
      "id": "clustering",
      "title": "Clustering",
      "icon": "CircleDot",
      "ids": [
        "aiml-ml-k-means-clustering",
        "aiml-ml-hierarchical-clustering",
        "aiml-ml-dbscan",
        "aiml-ml-gaussian-mixture-models"
      ]
    },
    {
      "id": "tree-based-models",
      "title": "Tree-Based Models",
      "icon": "TreePine",
      "ids": [
        "aiml-ml-decision-tree",
        "aiml-ml-random-forest",
        "aiml-ml-extra-trees",
        "aiml-ml-gradient-boosting",
        "aiml-ml-xgboost",
        "aiml-ml-lightgbm",
        "aiml-ml-catboost"
      ]
    },
    {
      "id": "dimensionality-reduction",
      "title": "Dimensionality Reduction",
      "icon": "Minimize2",
      "ids": [
        "aiml-ml-pca",
        "aiml-ml-t-sne",
        "aiml-ml-umap"
      ]
    },
    {
      "id": "ensemble-models",
      "title": "Ensemble Models",
      "icon": "Combine",
      "ids": [
        "aiml-ml-bagging",
        "aiml-ml-boosting",
        "aiml-ml-stacking",
        "aiml-ml-voting"
      ]
    }
  ],
  "mlSystemDesign": [
    {
      "id": "core-principles",
      "title": "Core Principles",
      "icon": "BookOpen",
      "ids": [
        "aiml-mlsd-data-sources-connectors",
        "aiml-mlsd-document-processing-chunking",
        "aiml-mlsd-embedding-generation-pipeline",
        "aiml-mlsd-data-versioning-lineage",
        "aiml-mlsd-ingestion-orchestration",
        "aiml-mlsd-llm-inference-engine",
        "aiml-mlsd-quantization-optimization",
        "aiml-mlsd-load-balancing-autoscaling",
        "aiml-mlsd-batch-vs-realtime-inference",
        "aiml-mlsd-multi-model-routing-fallbacks",
        "aiml-mlsd-prompt-templates-versioning",
        "aiml-mlsd-prompt-management-optimization",
        "aiml-mlsd-chain-flow-orchestration",
        "aiml-mlsd-structured-output-generation",
        "aiml-mlsd-guardrails-output-validation",
        "aiml-mlsd-conversation-short-term-memory",
        "aiml-mlsd-long-term-vector-memory",
        "aiml-mlsd-semantic-caching",
        "aiml-mlsd-memory-summarization-compression",
        "aiml-mlsd-state-persistence-retrieval",
        "aiml-mlsd-tracing-logging",
        "aiml-mlsd-latency-token-monitoring",
        "aiml-mlsd-cost-tracking-attribution",
        "aiml-mlsd-quality-metrics",
        "aiml-mlsd-hallucination-safety-detection",
        "aiml-mlsd-llm-as-judge-evaluation",
        "aiml-mlsd-alerting-dashboards",
        "aiml-mlsd-offline-evaluation-benchmarks",
        "aiml-mlsd-online-production-evaluation",
        "aiml-mlsd-automated-regression-testing",
        "aiml-mlsd-human-feedback-collection",
        "aiml-mlsd-ab-testing-prompts-models",
        "aiml-mlsd-drift-detection",
        "aiml-mlsd-cicd-ct-pipelines",
        "aiml-mlsd-experiment-tracking-version-control",
        "aiml-mlsd-model-registry-governance",
        "aiml-mlsd-automated-retraining-finetuning",
        "aiml-mlsd-continuous-data-knowledge-integration",
        "aiml-mlsd-content-moderation-red-teaming",
        "aiml-mlsd-bias-toxicity-detection",
        "aiml-mlsd-access-control-rbac",
        "aiml-mlsd-compliance-audit-logging",
        "aiml-mlsd-data-privacy-pii-handling",
        "aiml-mlsd-containerization-orchestration",
        "aiml-mlsd-gpu-tpu-resource-management",
        "aiml-mlsd-multi-region-edge-deployment",
        "aiml-mlsd-rollback-blue-green-deployment",
        "aiml-mlsd-rate-limiting-throttling",
        "aiml-mlsd-user-feedback-collection",
        "aiml-mlsd-reinforcement-preference-learning",
        "aiml-mlsd-continuous-improvement-pipeline",
        "aiml-mlsd-knowledge-base-update-automation"
      ],
      "groups": [
        {
          "title": "Data & Ingestion Layer",
          "ids": [
            "aiml-mlsd-data-sources-connectors",
            "aiml-mlsd-document-processing-chunking",
            "aiml-mlsd-embedding-generation-pipeline",
            "aiml-mlsd-data-versioning-lineage",
            "aiml-mlsd-ingestion-orchestration"
          ]
        },
        {
          "title": "Model Serving & Inference",
          "ids": [
            "aiml-mlsd-llm-inference-engine",
            "aiml-mlsd-quantization-optimization",
            "aiml-mlsd-load-balancing-autoscaling",
            "aiml-mlsd-batch-vs-realtime-inference",
            "aiml-mlsd-multi-model-routing-fallbacks"
          ]
        },
        {
          "title": "Prompt & Orchestration Layer",
          "ids": [
            "aiml-mlsd-prompt-templates-versioning",
            "aiml-mlsd-prompt-management-optimization",
            "aiml-mlsd-chain-flow-orchestration",
            "aiml-mlsd-structured-output-generation",
            "aiml-mlsd-guardrails-output-validation"
          ]
        },
        {
          "title": "Memory & State Management",
          "ids": [
            "aiml-mlsd-conversation-short-term-memory",
            "aiml-mlsd-long-term-vector-memory",
            "aiml-mlsd-semantic-caching",
            "aiml-mlsd-memory-summarization-compression",
            "aiml-mlsd-state-persistence-retrieval"
          ]
        },
        {
          "title": "Monitoring & Observability",
          "ids": [
            "aiml-mlsd-tracing-logging",
            "aiml-mlsd-latency-token-monitoring",
            "aiml-mlsd-cost-tracking-attribution",
            "aiml-mlsd-quality-metrics",
            "aiml-mlsd-hallucination-safety-detection",
            "aiml-mlsd-llm-as-judge-evaluation",
            "aiml-mlsd-alerting-dashboards"
          ]
        },
        {
          "title": "Evaluation & Testing",
          "ids": [
            "aiml-mlsd-offline-evaluation-benchmarks",
            "aiml-mlsd-online-production-evaluation",
            "aiml-mlsd-automated-regression-testing",
            "aiml-mlsd-human-feedback-collection",
            "aiml-mlsd-ab-testing-prompts-models",
            "aiml-mlsd-drift-detection"
          ]
        },
        {
          "title": "MLOps / LLMOps Pipelines",
          "ids": [
            "aiml-mlsd-cicd-ct-pipelines",
            "aiml-mlsd-experiment-tracking-version-control",
            "aiml-mlsd-model-registry-governance",
            "aiml-mlsd-automated-retraining-finetuning",
            "aiml-mlsd-continuous-data-knowledge-integration"
          ]
        },
        {
          "title": "Safety, Security & Governance",
          "ids": [
            "aiml-mlsd-content-moderation-red-teaming",
            "aiml-mlsd-bias-toxicity-detection",
            "aiml-mlsd-access-control-rbac",
            "aiml-mlsd-compliance-audit-logging",
            "aiml-mlsd-data-privacy-pii-handling"
          ]
        },
        {
          "title": "Deployment & Scaling",
          "ids": [
            "aiml-mlsd-containerization-orchestration",
            "aiml-mlsd-gpu-tpu-resource-management",
            "aiml-mlsd-multi-region-edge-deployment",
            "aiml-mlsd-rollback-blue-green-deployment",
            "aiml-mlsd-rate-limiting-throttling"
          ]
        },
        {
          "title": "Feedback & Improvement Loop",
          "ids": [
            "aiml-mlsd-user-feedback-collection",
            "aiml-mlsd-reinforcement-preference-learning",
            "aiml-mlsd-continuous-improvement-pipeline",
            "aiml-mlsd-knowledge-base-update-automation"
          ]
        }
      ]
    },
    {
      "id": "system-design-interview",
      "title": "System Design Interview",
      "icon": "Presentation",
      "ids": [
        "aiml-mlsd-online-serving",
        "aiml-mlsd-batch-and-streaming"
      ],
      "groups": [
        {
          "title": "System Design Interview",
          "ids": [
            "aiml-mlsd-online-serving",
            "aiml-mlsd-batch-and-streaming"
          ]
        }
      ]
    }
  ],
  "paths": [
    {
      "id": "learning-paths",
      "title": "Learning paths",
      "icon": "BookOpen",
      "ids": [
        "aiml-path-agentic-ai",
        "aiml-path-deep-learning",
        "aiml-path-generative-ai",
        "aiml-path-llms",
        "aiml-path-machine-learning"
      ]
    }
  ],
  "interviews": [
    {
      "id": "interview-sets",
      "title": "Interview sets",
      "icon": "Sparkles",
      "ids": [
        "aiml-iv-deep-learning",
        "aiml-iv-llms",
        "aiml-iv-ml-fundamentals"
      ]
    }
  ]
} as const;
