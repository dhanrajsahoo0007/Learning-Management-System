export interface ArchitectureTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  icon: string;
  color: string;
  content: {
    overview: string;
    concepts: string[];
    steps: Array<{
      title: string;
      description: string;
      diagram?: string;
    }>;
    examples: string[];
  };
}

export const architectureTopics: ArchitectureTopic[] = [
  {
    id: 'load-balancer',
    title: 'Load Balancer',
    description: 'Distribute traffic across multiple servers for high availability and scalability',
    difficulty: 'Intermediate',
    progress: 75,
    icon: 'Scale',
    color: 'bg-blue-500',
    content: {
      overview: 'Load balancers are essential components in distributed systems that distribute incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.',
      concepts: [
        'Traffic Distribution Algorithms',
        'Health Checks',
        'Session Persistence',
        'SSL Termination',
        'Auto Scaling Integration'
      ],
      steps: [
        {
          title: 'Traffic Reception',
          description: 'Load balancer receives incoming requests from clients'
        },
        {
          title: 'Server Selection',
          description: 'Algorithm selects the best available server based on current load'
        },
        {
          title: 'Request Forwarding',
          description: 'Request is forwarded to the selected server'
        },
        {
          title: 'Response Routing',
          description: 'Server response is routed back to the client through the load balancer'
        }
      ],
      examples: [
        'Round Robin: Distributes requests sequentially',
        'Least Connections: Routes to server with fewest active connections',
        'IP Hash: Uses client IP to determine server assignment'
      ]
    }
  },
  {
    id: 'microservices',
    title: 'Microservices',
    description: 'Break down monolithic applications into smaller, independent services',
    difficulty: 'Advanced',
    progress: 45,
    icon: 'Grid3X3',
    color: 'bg-green-500',
    content: {
      overview: 'Microservices architecture breaks down large applications into smaller, independent services that can be developed, deployed, and scaled independently.',
      concepts: [
        'Service Boundaries',
        'API Gateway',
        'Service Discovery',
        'Circuit Breaker Pattern',
        'Event-Driven Architecture'
      ],
      steps: [
        {
          title: 'Domain Analysis',
          description: 'Identify business domains and bounded contexts'
        },
        {
          title: 'Service Decomposition',
          description: 'Break down the monolith into smaller services'
        },
        {
          title: 'API Design',
          description: 'Define clear APIs for inter-service communication'
        },
        {
          title: 'Data Management',
          description: 'Implement appropriate data storage patterns'
        }
      ],
      examples: [
        'E-commerce: Product, Order, Payment, User services',
        'Social Media: Feed, Profile, Messaging, Notification services',
        'Banking: Account, Transaction, Loan, Customer services'
      ]
    }
  },
  {
    id: 'caching-strategies',
    title: 'Caching Strategies',
    description: 'Improve performance by storing frequently accessed data in memory',
    difficulty: 'Intermediate',
    progress: 60,
    icon: 'Database',
    color: 'bg-purple-500',
    content: {
      overview: 'Caching is a technique to store frequently accessed data in fast-access storage to reduce latency and improve application performance.',
      concepts: [
        'Cache-Aside Pattern',
        'Write-Through Cache',
        'Cache Invalidation',
        'TTL (Time To Live)',
        'Cache Warming'
      ],
      steps: [
        {
          title: 'Cache Hit Check',
          description: 'Check if requested data exists in cache'
        },
        {
          title: 'Cache Hit',
          description: 'Return cached data if available'
        },
        {
          title: 'Cache Miss',
          description: 'Fetch data from primary storage'
        },
        {
          title: 'Cache Storage',
          description: 'Store fetched data in cache for future requests'
        }
      ],
      examples: [
        'Redis for session storage',
        'CDN for static assets',
        'Browser cache for web resources',
        'Database query result cache'
      ]
    }
  },
  {
    id: 'database-sharding',
    title: 'Database Sharding',
    description: 'Horizontally partition data across multiple database instances',
    difficulty: 'Advanced',
    progress: 30,
    icon: 'Split',
    color: 'bg-red-500',
    content: {
      overview: 'Database sharding involves breaking a large database into smaller, more manageable pieces called shards, distributed across multiple servers.',
      concepts: [
        'Shard Key Selection',
        'Consistent Hashing',
        'Data Migration',
        'Cross-Shard Queries',
        'Shard Balancing'
      ],
      steps: [
        {
          title: 'Shard Key Design',
          description: 'Choose appropriate shard key for even data distribution'
        },
        {
          title: 'Sharding Strategy',
          description: 'Implement sharding logic in application layer'
        },
        {
          title: 'Data Routing',
          description: 'Route queries to appropriate shards'
        },
        {
          title: 'Shard Management',
          description: 'Monitor and rebalance shards as needed'
        }
      ],
      examples: [
        'User data sharded by user_id',
        'Geographic data sharded by region',
        'Time-series data sharded by date ranges'
      ]
    }
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    description: 'Single entry point for managing and routing API requests',
    difficulty: 'Intermediate',
    progress: 80,
    icon: 'Router',
    color: 'bg-yellow-500',
    content: {
      overview: 'An API Gateway acts as a single entry point for all client requests, providing features like routing, authentication, rate limiting, and request transformation.',
      concepts: [
        'Request Routing',
        'Authentication & Authorization',
        'Rate Limiting',
        'Request/Response Transformation',
        'Logging & Monitoring'
      ],
      steps: [
        {
          title: 'Request Reception',
          description: 'API Gateway receives client requests'
        },
        {
          title: 'Authentication',
          description: 'Validate client credentials and permissions'
        },
        {
          title: 'Request Processing',
          description: 'Apply transformations, rate limiting, etc.'
        },
        {
          title: 'Service Routing',
          description: 'Route request to appropriate microservice'
        }
      ],
      examples: [
        'Authentication middleware',
        'Request throttling for DDoS protection',
        'Response caching and compression',
        'API versioning and deprecation'
      ]
    }
  },
  {
    id: 'message-queues',
    title: 'Message Queues',
    description: 'Asynchronous communication between services using message queues',
    difficulty: 'Intermediate',
    progress: 55,
    icon: 'MessageSquare',
    color: 'bg-indigo-500',
    content: {
      overview: 'Message queues enable asynchronous communication between services, decoupling producers and consumers for better scalability and reliability.',
      concepts: [
        'Producer-Consumer Pattern',
        'Message Persistence',
        'Dead Letter Queues',
        'Message Ordering',
        'Idempotency'
      ],
      steps: [
        {
          title: 'Message Production',
          description: 'Producer sends message to queue'
        },
        {
          title: 'Message Storage',
          description: 'Message is stored durably in queue'
        },
        {
          title: 'Message Consumption',
          description: 'Consumer processes message from queue'
        },
        {
          title: 'Acknowledgment',
          description: 'Consumer acknowledges successful processing'
        }
      ],
      examples: [
        'Order processing workflows',
        'Email notification systems',
        'Data processing pipelines',
        'Event-driven architectures'
      ]
    }
  }
];
