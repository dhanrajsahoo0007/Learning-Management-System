export interface Certification {
  id: string;
  title: string;
  provider: 'AWS' | 'Azure' | 'GCP' | 'Kubernetes' | 'Terraform' | 'Docker';
  level: 'Foundational' | 'Associate' | 'Professional' | 'Expert';
  description: string;
  logo: string;
  color: string;
  progress: {
    completedModules: number;
    totalModules: number;
  };
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  roadmap: Array<{
    id: string;
    title: string;
    type: 'video' | 'reading' | 'practice' | 'exam';
    duration: string;
    completed: boolean;
    content?: string;
  }>;
}

export const certifications: Certification[] = [
  {
    id: 'aws-solutions-architect-associate',
    title: 'AWS Solutions Architect Associate',
    provider: 'AWS',
    level: 'Associate',
    description: 'Design secure, cost-effective, and scalable solutions on AWS',
    logo: 'Cloud',
    color: 'bg-orange-500',
    progress: {
      completedModules: 8,
      totalModules: 12
    },
    estimatedHours: 80,
    difficulty: 'Intermediate',
    roadmap: [
      {
        id: 'aws-fundamentals',
        title: 'AWS Cloud Fundamentals',
        type: 'video',
        duration: '2 hours',
        completed: true,
        content: 'Introduction to AWS services, pricing, and basic concepts'
      },
      {
        id: 'ec2-compute',
        title: 'EC2 and Compute Services',
        type: 'video',
        duration: '4 hours',
        completed: true,
        content: 'Virtual servers, auto scaling, load balancing'
      },
      {
        id: 's3-storage',
        title: 'S3 and Storage Solutions',
        type: 'video',
        duration: '3 hours',
        completed: true,
        content: 'Object storage, lifecycle policies, data transfer'
      },
      {
        id: 'vpc-networking',
        title: 'VPC and Networking',
        type: 'practice',
        duration: '6 hours',
        completed: false,
        content: 'Network architecture, security groups, subnets'
      },
      {
        id: 'rds-databases',
        title: 'RDS and Database Services',
        type: 'video',
        duration: '4 hours',
        completed: false,
        content: 'Managed databases, read replicas, backups'
      },
      {
        id: 'iam-security',
        title: 'IAM and Security',
        type: 'reading',
        duration: '3 hours',
        completed: false,
        content: 'Identity management, policies, encryption'
      },
      {
        id: 'cloudformation',
        title: 'CloudFormation',
        type: 'practice',
        duration: '5 hours',
        completed: false,
        content: 'Infrastructure as code, templates, stacks'
      },
      {
        id: 'monitoring',
        title: 'Monitoring and Logging',
        type: 'video',
        duration: '3 hours',
        completed: false,
        content: 'CloudWatch, CloudTrail, X-Ray'
      },
      {
        id: 'practice-exam-1',
        title: 'Practice Exam 1',
        type: 'exam',
        duration: '2 hours',
        completed: false,
        content: 'Full-length practice exam with explanations'
      },
      {
        id: 'practice-exam-2',
        title: 'Practice Exam 2',
        type: 'exam',
        duration: '2 hours',
        completed: false,
        content: 'Second practice exam for reinforcement'
      },
      {
        id: 'final-review',
        title: 'Final Review',
        type: 'reading',
        duration: '4 hours',
        completed: false,
        content: 'Key concepts, exam tips, and strategies'
      },
      {
        id: 'certification-exam',
        title: 'AWS SAA-C03 Exam',
        type: 'exam',
        duration: '2.5 hours',
        completed: false,
        content: 'Official certification examination'
      }
    ]
  },
  {
    id: 'azure-fundamentals',
    title: 'Azure Fundamentals (AZ-900)',
    provider: 'Azure',
    level: 'Foundational',
    description: 'Foundational knowledge of cloud services and Azure platform',
    logo: 'Cloud',
    color: 'bg-blue-600',
    progress: {
      completedModules: 5,
      totalModules: 8
    },
    estimatedHours: 40,
    difficulty: 'Beginner',
    roadmap: [
      {
        id: 'azure-overview',
        title: 'Azure Overview and Concepts',
        type: 'video',
        duration: '2 hours',
        completed: true,
        content: 'Cloud computing basics, Azure services overview'
      },
      {
        id: 'azure-core-services',
        title: 'Core Azure Services',
        type: 'video',
        duration: '3 hours',
        completed: true,
        content: 'Compute, storage, networking, databases'
      },
      {
        id: 'azure-security',
        title: 'Azure Security and Compliance',
        type: 'reading',
        duration: '2 hours',
        completed: true,
        content: 'Identity, governance, privacy, compliance'
      },
      {
        id: 'azure-pricing',
        title: 'Azure Pricing and Support',
        type: 'video',
        duration: '2 hours',
        completed: true,
        content: 'Cost management, service level agreements'
      },
      {
        id: 'azure-governance',
        title: 'Azure Governance',
        type: 'practice',
        duration: '3 hours',
        completed: true,
        content: 'Resource management, monitoring, automation'
      },
      {
        id: 'practice-questions',
        title: 'Practice Questions',
        type: 'exam',
        duration: '2 hours',
        completed: false,
        content: '250+ practice questions with explanations'
      },
      {
        id: 'final-prep',
        title: 'Exam Preparation',
        type: 'reading',
        duration: '2 hours',
        completed: false,
        content: 'Exam tips, key concepts review'
      },
      {
        id: 'az900-exam',
        title: 'AZ-900 Certification Exam',
        type: 'exam',
        duration: '2 hours',
        completed: false,
        content: 'Microsoft Azure Fundamentals examination'
      }
    ]
  },
  {
    id: 'gcp-professional-cloud-architect',
    title: 'GCP Professional Cloud Architect',
    provider: 'GCP',
    level: 'Professional',
    description: 'Design and plan cloud solution architecture on Google Cloud',
    logo: 'Cloud',
    color: 'bg-green-600',
    progress: {
      completedModules: 6,
      totalModules: 15
    },
    estimatedHours: 120,
    difficulty: 'Advanced',
    roadmap: [
      {
        id: 'gcp-fundamentals',
        title: 'Google Cloud Fundamentals',
        type: 'video',
        duration: '4 hours',
        completed: true,
        content: 'Cloud concepts, Google Cloud services overview'
      },
      {
        id: 'compute-engine',
        title: 'Compute Engine',
        type: 'video',
        duration: '5 hours',
        completed: true,
        content: 'VM instances, machine types, storage options'
      },
      {
        id: 'kubernetes-engine',
        title: 'Kubernetes Engine (GKE)',
        type: 'practice',
        duration: '8 hours',
        completed: true,
        content: 'Container orchestration, deployments, services'
      },
      {
        id: 'app-engine',
        title: 'App Engine',
        type: 'video',
        duration: '4 hours',
        completed: true,
        content: 'Serverless application platform'
      },
      {
        id: 'cloud-storage',
        title: 'Cloud Storage',
        type: 'video',
        duration: '3 hours',
        completed: true,
        content: 'Object storage, lifecycle management'
      },
      {
        id: 'bigquery',
        title: 'BigQuery',
        type: 'practice',
        duration: '6 hours',
        completed: true,
        content: 'Data warehouse, analytics, SQL queries'
      },
      {
        id: 'vpc-networking',
        title: 'VPC and Networking',
        type: 'video',
        duration: '5 hours',
        completed: false,
        content: 'Network design, security, connectivity'
      },
      {
        id: 'security-identity',
        title: 'Security and Identity',
        type: 'reading',
        duration: '4 hours',
        completed: false,
        content: 'IAM, data protection, compliance'
      },
      {
        id: 'operations',
        title: 'Operations and Monitoring',
        type: 'video',
        duration: '4 hours',
        completed: false,
        content: 'Logging, monitoring, error reporting'
      },
      {
        id: 'devops-ci-cd',
        title: 'DevOps and CI/CD',
        type: 'practice',
        duration: '6 hours',
        completed: false,
        content: 'Cloud Build, deployment pipelines'
      },
      {
        id: 'migration',
        title: 'Migration and Modernization',
        type: 'video',
        duration: '5 hours',
        completed: false,
        content: 'Migration strategies, modernization approaches'
      },
      {
        id: 'cost-optimization',
        title: 'Cost Optimization',
        type: 'reading',
        duration: '3 hours',
        completed: false,
        content: 'Cost management, billing, optimization strategies'
      },
      {
        id: 'practice-exam-1',
        title: 'Practice Exam 1',
        type: 'exam',
        duration: '3 hours',
        completed: false,
        content: 'Full practice exam with detailed explanations'
      },
      {
        id: 'practice-exam-2',
        title: 'Practice Exam 2',
        type: 'exam',
        duration: '3 hours',
        completed: false,
        content: 'Second practice exam for mastery'
      },
      {
        id: 'certification-exam',
        title: 'Professional Cloud Architect Exam',
        type: 'exam',
        duration: '3 hours',
        completed: false,
        content: 'Official Google Cloud certification examination'
      }
    ]
  },
  {
    id: 'kubernetes-administrator',
    title: 'Certified Kubernetes Administrator (CKA)',
    provider: 'Kubernetes',
    level: 'Professional',
    description: 'Certified Kubernetes Administrator certification',
    logo: 'Container',
    color: 'bg-cyan-500',
    progress: {
      completedModules: 4,
      totalModules: 10
    },
    estimatedHours: 100,
    difficulty: 'Advanced',
    roadmap: [
      {
        id: 'k8s-fundamentals',
        title: 'Kubernetes Fundamentals',
        type: 'video',
        duration: '6 hours',
        completed: true,
        content: 'Architecture, concepts, basic operations'
      },
      {
        id: 'cluster-setup',
        title: 'Cluster Setup and Configuration',
        type: 'practice',
        duration: '8 hours',
        completed: true,
        content: 'Installation, configuration, networking'
      },
      {
        id: 'workloads',
        title: 'Workloads and Scheduling',
        type: 'video',
        duration: '6 hours',
        completed: true,
        content: 'Pods, deployments, jobs, cronjobs'
      },
      {
        id: 'services-networking',
        title: 'Services and Networking',
        type: 'practice',
        duration: '7 hours',
        completed: true,
        content: 'Services, ingress, network policies'
      },
      {
        id: 'storage',
        title: 'Storage',
        type: 'video',
        duration: '5 hours',
        completed: false,
        content: 'Persistent volumes, storage classes'
      },
      {
        id: 'security',
        title: 'Security',
        type: 'reading',
        duration: '4 hours',
        completed: false,
        content: 'RBAC, security contexts, secrets'
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        type: 'practice',
        duration: '8 hours',
        completed: false,
        content: 'Debugging clusters, applications'
      },
      {
        id: 'maintenance',
        title: 'Cluster Maintenance',
        type: 'video',
        duration: '5 hours',
        completed: false,
        content: 'Upgrades, backups, etcd maintenance'
      },
      {
        id: 'practice-labs',
        title: 'Practice Labs',
        type: 'practice',
        duration: '12 hours',
        completed: false,
        content: 'Hands-on labs for all major topics'
      },
      {
        id: 'cka-exam',
        title: 'CKA Certification Exam',
        type: 'exam',
        duration: '3 hours',
        completed: false,
        content: 'Certified Kubernetes Administrator examination'
      }
    ]
  }
];
