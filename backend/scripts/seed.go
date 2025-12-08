package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/models"
)

func main() {
	log.Println("🌱 Starting database seeding...")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Connect to database
	db, err := database.Connect(database.Config{
		URL:       cfg.Database.URL,
		AuthToken: cfg.Database.AuthToken,
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	// Seed DSA Topics
	seedDSA(ctx, db)

	// Seed System Design Topics
	seedSystemDesign(ctx, db)

	// Seed Certifications
	seedCertifications(ctx, db)

	log.Println("✅ Database seeding completed successfully!")
}

func seedDSA(ctx context.Context, db *database.DB) {
	log.Println("Seeding DSA topics...")

	topics := []models.DSATopic{
		// Arrays & Hashing
		{
			ID:            "arrays-hashing",
			Title:         "Arrays & Hashing",
			Category:      "Arrays",
			Description:   "Master fundamental array operations and hashing techniques for efficient data storage and retrieval.",
			Difficulty:    "Easy",
			Progress:      0,
			Icon:          "Code",
			Color:         "blue",
			FolderPath:    "/dsa/arrays",
			ProblemCount:  12,
			Subcomponents: []string{"Dynamic Array", "Hash Map", "Prefix Sum", "Two Pointers"},
			Content: models.DSAContent{
				Explanation: "Arrays are contiguous memory blocks. Hashing allows O(1) lookups.",
				Examples: []models.DSAExample{
					{Input: "[1, 2, 3]", Output: "[1, 2, 3]", Explanation: "Basic array storage"},
				},
			},
		},
		{
			ID:            "two-pointers-technique",
			Title:         "Two Pointers",
			Category:      "Arrays",
			Description:   "Optimize time complexity using the two-pointer technique for sorted arrays and linked lists.",
			Difficulty:    "Medium",
			Progress:      0,
			Icon:          "Move",
			Color:         "green",
			FolderPath:    "/dsa/two-pointers",
			ProblemCount:  8,
			Subcomponents: []string{"Opposite Ends", "Fast & Slow", "Collision"},
			Content: models.DSAContent{
				Explanation: "Two pointers allow solving problems in O(n) time and O(1) space.",
			},
		},
		{
			ID:            "sliding-window",
			Title:         "Sliding Window",
			Category:      "Arrays",
			Description:   "Efficiently handle subarray problems using the sliding window pattern.",
			Difficulty:    "Medium",
			Progress:      0,
			Icon:          "Maximize",
			Color:         "yellow",
			FolderPath:    "/dsa/sliding-window",
			ProblemCount:  10,
			Subcomponents: []string{"Fixed Size", "Variable Size"},
			Content: models.DSAContent{
				Explanation: "Sliding window avoids re-computation by updating window state incrementally.",
			},
		},
		// Stack
		{
			ID:            "stack-intro",
			Title:         "Stack Data Structure",
			Category:      "Stack",
			Description:   "Understand LIFO principles and solve parenthesis, evaluation, and monotonic stack problems.",
			Difficulty:    "Easy",
			Progress:      0,
			Icon:          "Layers",
			Color:         "purple",
			FolderPath:    "/dsa/stack",
			ProblemCount:  15,
			Subcomponents: []string{"Valid Parentheses", "Min Stack", "RPN"},
			Content: models.DSAContent{
				Explanation: "Stack follows Last-In-First-Out (LIFO) order.",
			},
		},
		// Binary Search
		{
			ID:            "binary-search",
			Title:         "Binary Search",
			Category:      "Search",
			Description:   "Find elements in sorted data in O(log n) time. Applies to arrays and search spaces.",
			Difficulty:    "Medium",
			Progress:      0,
			Icon:          "Search",
			Color:         "indigo",
			FolderPath:    "/dsa/binary-search",
			ProblemCount:  12,
			Subcomponents: []string{"Binary Search", "2D Matrix Search", "Koko Eating Bananas"},
			Content: models.DSAContent{
				Explanation: "Binary search divides the search space in half at each step.",
			},
		},
		// Linked List
		{
			ID:            "linked-list",
			Title:         "Linked List",
			Category:      "Linked List",
			Description:   "Manipulate node-based data structures. Covers reversal, merging, and cycle detection.",
			Difficulty:    "Easy",
			Progress:      0,
			Icon:          "Link",
			Color:         "cyan",
			FolderPath:    "/dsa/linked-list",
			ProblemCount:  20,
			Subcomponents: []string{"Reverse List", "Merge Lists", "Reorder List", "LRU Cache"},
			Content: models.DSAContent{
				Explanation: "A linear collection of data elements whose order is not given by their physical placement in memory.",
			},
		},
		// Trees
		{
			ID:            "trees",
			Title:         "Trees",
			Category:      "Trees",
			Description:   "Hierarchy and recursion. Invert, traverse, and balance binary trees and BSTs.",
			Difficulty:    "Hard",
			Progress:      0,
			Icon:          "GitBranch",
			Color:         "teal",
			FolderPath:    "/dsa/trees",
			ProblemCount:  25,
			Subcomponents: []string{"Invert Tree", "Max Depth", "Level Order", "Valid BST"},
			Content: models.DSAContent{
				Explanation: "Trees are hierarchical data structures consisting of nodes connected by edges.",
			},
		},
		// Graphs
		{
			ID:            "graphs-intro",
			Title:         "Graphs",
			Category:      "Graphs",
			Description:   "Model real-world connections. BFS, DFS, Topological Sort, and shortest paths.",
			Difficulty:    "Hard",
			Progress:      0,
			Icon:          "Share2",
			Color:         "gray",
			FolderPath:    "/dsa/graphs",
			ProblemCount:  30,
			Subcomponents: []string{"Number of Islands", "Clone Graph", "Course Schedule"},
			Content: models.DSAContent{
				Explanation: "Graphs represent pairwise relationships between objects.",
			},
		},
	}

	for _, topic := range topics {
		subJSON, _ := json.Marshal(topic.Subcomponents)
		contentJSON, _ := json.Marshal(topic.Content)
		now := time.Now()

		_, err := db.ExecContext(ctx, `
			INSERT INTO dsa_topics (id, title, category, description, difficulty, progress, icon, color, folder_path, problem_count, subcomponents, content, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET 
				title=excluded.title, 
				description=excluded.description,
				problem_count=excluded.problem_count,
				subcomponents=excluded.subcomponents,
				updated_at=excluded.updated_at
		`, topic.ID, topic.Title, topic.Category, topic.Description, topic.Difficulty, topic.Progress, topic.Icon, topic.Color, topic.FolderPath, topic.ProblemCount, string(subJSON), string(contentJSON), now, now)

		if err != nil {
			log.Printf("Error seeding DSA topic %s: %v", topic.Title, err)
		}
	}
}

func seedSystemDesign(ctx context.Context, db *database.DB) {
	log.Println("Seeding System Design topics...")

	topics := []models.SystemDesignTopic{
		// Scalability
		{
			ID:          "scalability",
			Title:       "Scalability & Reliability",
			Description: "Core concepts of distributed systems. Vertical vs Horizontal scaling, Reliability metrics.",
			Difficulty:  "Beginner",
			Progress:    0,
			Icon:        "Scale",
			Color:       "orange",
			IsAITopic:   false,
			Content: models.SystemDesignContent{
				Overview: "Scalability is the property of a system to handle a growing amount of work by adding resources to the system.",
				Concepts: []string{"Vertical Scaling", "Horizontal Scaling", "Load Balancing", "Availability vs Reliability"},
				Steps: []models.SystemDesignStep{
					{Title: "Assess Workload", Description: "Identify if the bottleneck is CPU, Memory, or IO."},
					{Title: "Choose Strategy", Description: "Decide between scaling up (buffer) or scaling out (distributed)."},
				},
				Examples: []string{"AWS Auto Scaling", "Kubernetes HPA"},
			},
		},
		{
			ID:          "load-Balancers",
			Title:       "Load Balancers",
			Description: "Distributing traffic efficiently across multiple servers to ensure high availability.",
			Difficulty:  "Intermediate",
			Progress:    0,
			Icon:        "Split",
			Color:       "blue",
			IsAITopic:   false,
			Content: models.SystemDesignContent{
				Overview: "Load balancers distribute incoming network traffic across a group of backend servers.",
				Concepts: []string{"L4 vs L7 Balancing", "Round Robin", "Least Connections", "Consistent Hashing"},
				Steps: []models.SystemDesignStep{
					{Title: "Define Health Checks", Description: "Ensure traffic only goes to healthy instances."},
					{Title: "Select Algorithm", Description: "Choose routing logic based on request type."},
				},
				Examples: []string{"NGINX", "HAProxy", "AWS ALB"},
			},
		},
		{
			ID:          "databases-caching",
			Title:       "Databases & Caching",
			Description: "Data storage patterns, replication, sharding, and caching strategies.",
			Difficulty:  "Intermediate",
			Progress:    0,
			Icon:        "Database",
			Color:       "yellow",
			IsAITopic:   false,
			Content: models.SystemDesignContent{
				Overview: "Efficient data storage and retrieval is critical. Caching reduces latency.",
				Concepts: []string{"SQL vs NoSQL", "ACID vs BASE", "Replication", "Sharding", "Cache-Aside", "Write-Through"},
				Steps: []models.SystemDesignStep{
					{Title: "Data Modeling", Description: "Design schema based on access patterns."},
					{Title: "Implement Caching", Description: "Add Redis/Memcached for hot data."},
				},
				Examples: []string{"PostgreSQL", "MongoDB", "Redis", "Cassandra"},
			},
		},
		{
			ID:          "message-queues",
			Title:       "Message Queues",
			Description: "Asynchronous processing and decoupling services using queues and pub/sub.",
			Difficulty:  "Advanced",
			Progress:    0,
			Icon:        "MessageSquare",
			Color:       "green",
			IsAITopic:   false,
			Content: models.SystemDesignContent{
				Overview: "Message queues allow different parts of a system to communicate and process operations asynchronously.",
				Concepts: []string{"Pub/Sub", "Point-to-Point", "Dead Letter Queues", "Event Sourcing"},
				Steps: []models.SystemDesignStep{
					{Title: "Decouple Services", Description: "Producer sends message, consumer processes later."},
					{Title: "Handle Failures", Description: "Implement retries and DLQs."},
				},
				Examples: []string{"Kafka", "RabbitMQ", "AWS SQS"},
			},
		},
		// AI System Design
		{
			ID:          "llm-architecture",
			Title:       "LLM Architecture",
			Description: "Design of Large Language Models systems. Transformers, Attention, and Tokens.",
			Difficulty:  "Advanced",
			Progress:    0,
			Icon:        "Brain",
			Color:       "purple",
			IsAITopic:   true,
			Content: models.SystemDesignContent{
				Overview: "Modern LLMs are based on the Transformer architecture using self-attention mechanisms.",
				Concepts: []string{"Self-Attention", "Embeddings", "Tokenization", "Context Window"},
				Steps: []models.SystemDesignStep{
					{Title: "Pre-training", Description: "Train on massive text corpus."},
					{Title: "Fine-tuning", Description: "Adapt model to specific tasks (RLHF)."},
				},
				Examples: []string{"GPT-4", "Llama 3", "Claude"},
			},
		},
		{
			ID:          "rag-systems",
			Title:       "RAG Systems",
			Description: "Retrieval-Augmented Generation. Connecting LLMs to external knowledge bases.",
			Difficulty:  "Advanced",
			Progress:    0,
			Icon:        "Search",
			Color:       "indigo",
			IsAITopic:   true,
			Content: models.SystemDesignContent{
				Overview: "RAG combines an information retrieval component with a text generator model.",
				Concepts: []string{"Vector Database", "Semantic Search", "Prompt Engineering", "Hallucination Reduction"},
				Steps: []models.SystemDesignStep{
					{Title: "Ingestion", Description: "Chunk and embed documents into vector store."},
					{Title: "Retrieval", Description: "Fetch relevant chunks for usage in prompt."},
				},
				Examples: []string{"Pinecone", "LangChain", "ChromaDB"},
			},
		},
		{
			ID:          "ml-pipeline",
			Title:       "ML Ops & Pipelines",
			Description: "Managing the lifecycle of machine learning models in production.",
			Difficulty:  "Intermediate",
			Progress:    0,
			Icon:        "Grid3X3",
			Color:       "cyan",
			IsAITopic:   true,
			Content: models.SystemDesignContent{
				Overview: "MLOps unifies ML system development and operations.",
				Concepts: []string{"Feature Store", "Model Registry", "Training Pipeline", "Model Monitoring"},
				Steps: []models.SystemDesignStep{
					{Title: "Data Prep", Description: "Clean and feature engineer data."},
					{Title: "Deployment", Description: "Serve model via REST/gRPC API."},
				},
				Examples: []string{"MLflow", "Kubeflow", "Tecton"},
			},
		},
	}

	for _, topic := range topics {
		contentJSON, _ := json.Marshal(topic.Content)
		now := time.Now()

		_, err := db.ExecContext(ctx, `
			INSERT INTO system_design_topics (id, title, description, difficulty, progress, icon, color, content, is_ai_topic, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET 
				title=excluded.title,
				description=excluded.description,
				content=excluded.content,
				updated_at=excluded.updated_at
		`, topic.ID, topic.Title, topic.Description, topic.Difficulty, topic.Progress, topic.Icon, topic.Color, string(contentJSON), topic.IsAITopic, now, now)

		if err != nil {
			log.Printf("Error seeding System Design topic %s: %v", topic.Title, err)
		}
	}
}

func seedCertifications(ctx context.Context, db *database.DB) {
	log.Println("Seeding Certifications...")

	certs := []models.Certification{
		{
			ID:               "aws-saa",
			Title:            "Solutions Architect Associate",
			Provider:         "AWS",
			Level:            "Associate",
			Description:      "Comprehensive guide for AWS SAA-C03 exam. Covers EC2, S3, VPC, and more.",
			Logo:             "aws-logo",
			Color:            "orange",
			CompletedModules: 0,
			TotalModules:     12,
			EstimatedHours:   40,
			Difficulty:       "Intermediate",
			Roadmap: []models.RoadmapItem{
				{ID: "1", Title: "IAM & Security", Type: "video", Duration: "2h", Completed: false},
				{ID: "2", Title: "EC2 Fundamentals", Type: "reading", Duration: "1h", Completed: false},
				{ID: "3", Title: "VPC & Networking", Type: "video", Duration: "3h", Completed: false},
			},
		},
		{
			ID:               "aws-dev",
			Title:            "Developer Associate",
			Provider:         "AWS",
			Level:            "Associate",
			Description:      "Focus on developing and maintaining AWS-based applications.",
			Logo:             "aws-logo",
			Color:            "orange",
			CompletedModules: 0,
			TotalModules:     10,
			EstimatedHours:   35,
			Difficulty:       "Intermediate",
			Roadmap: []models.RoadmapItem{
				{ID: "1", Title: "Serverless (Lambda)", Type: "video", Duration: "2h", Completed: false},
				{ID: "2", Title: "DynamoDB", Type: "reading", Duration: "1h", Completed: false},
			},
		},
		{
			ID:               "kka",
			Title:            "Certified Kubernetes Administrator",
			Provider:         "Kubernetes",
			Level:            "Professional",
			Description:      "Master Kubernetes administration, including installation, configuration, and troubleshooting.",
			Logo:             "k8s-logo",
			Color:            "blue",
			CompletedModules: 0,
			TotalModules:     15,
			EstimatedHours:   50,
			Difficulty:       "Advanced",
			Roadmap: []models.RoadmapItem{
				{ID: "1", Title: "Cluster Architecture", Type: "video", Duration: "3h", Completed: false},
				{ID: "2", Title: "Workloads & Scheduling", Type: "video", Duration: "4h", Completed: false},
			},
		},
		{
			ID:               "az-104",
			Title:            "Azure Administrator",
			Provider:         "Azure",
			Level:            "Associate",
			Description:      "Manage Azure subscriptions, secure identities, administer infrastructure.",
			Logo:             "azure-logo",
			Color:            "blue",
			CompletedModules: 0,
			TotalModules:     14,
			EstimatedHours:   45,
			Difficulty:       "Intermediate",
			Roadmap: []models.RoadmapItem{
				{ID: "1", Title: "Manage Identities", Type: "reading", Duration: "2h", Completed: false},
			},
		},
		{
			ID:               "gcp-ace",
			Title:            "Associate Cloud Engineer",
			Provider:         "Google Cloud",
			Level:            "Associate",
			Description:      "Deploy applications, monitor operations, and manage enterprise solutions.",
			Logo:             "gcp-logo",
			Color:            "red",
			CompletedModules: 0,
			TotalModules:     12,
			EstimatedHours:   40,
			Difficulty:       "Intermediate",
			Roadmap: []models.RoadmapItem{
				{ID: "1", Title: "Setting up Cloud Config", Type: "lab", Duration: "1h", Completed: false},
			},
		},
	}

	for _, cert := range certs {
		roadmapJSON, _ := json.Marshal(cert.Roadmap)
		now := time.Now()

		_, err := db.ExecContext(ctx, `
			INSERT INTO certifications (id, title, provider, level, description, logo, color, completed_modules, total_modules, estimated_hours, difficulty, roadmap, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET 
				title=excluded.title,
				description=excluded.description,
				total_modules=excluded.total_modules,
				roadmap=excluded.roadmap,
				updated_at=excluded.updated_at
		`, cert.ID, cert.Title, cert.Provider, cert.Level, cert.Description, cert.Logo, cert.Color, cert.CompletedModules, cert.TotalModules, cert.EstimatedHours, cert.Difficulty, string(roadmapJSON), now, now)

		if err != nil {
			log.Printf("Error seeding Certification %s: %v", cert.Title, err)
		}
	}
}
