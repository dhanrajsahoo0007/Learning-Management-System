/**
 * TypeScript interfaces for DSA problems
 * Generated from Python Pydantic models
 */

export interface Example {
  input: string;
  output: string;
  explanation?: string | null;
}

export interface TestCase {
  input: string;
  expected_output: string;
  hidden: boolean;
}

export interface ComplexityAnalysis {
  time?: string | null;
  space?: string | null;
  explanation?: string | null;
}

export interface Solution {
  language: string;
  code: string;
  name?: string | null;
  complexity?: ComplexityAnalysis | null;
}

export interface Problem {
  id: string;
  title: string;
  statement: string;
  examples: Example[];
  test_cases: TestCase[];
  constraints?: string | null;
  solutions: Solution[];
  difficulty?: string | null;
  topics: string[];
  source_file?: string | null;
}

export interface DSACollection {
  problems: Problem[];
  metadata?: Record<string, string>;
}

/**
 * Load DSA problems from JSON file
 */
export async function loadProblems(jsonPath: string): Promise<DSACollection> {
  const response = await fetch(jsonPath);
  return response.json();
}

/**
 * Get problem by ID
 */
export function getProblemById(
  collection: DSACollection,
  id: string
): Problem | undefined {
  return collection.problems.find((p) => p.id === id);
}

/**
 * Get problems by topic
 */
export function getProblemsByTopic(
  collection: DSACollection,
  topic: string
): Problem[] {
  return collection.problems.filter((p) => p.topics.includes(topic));
}

/**
 * Get all unique topics
 */
export function getAllTopics(collection: DSACollection): string[] {
  const topics = new Set<string>();
  collection.problems.forEach((p) => {
    p.topics.forEach((t) => topics.add(t));
  });
  return Array.from(topics).sort();
}
