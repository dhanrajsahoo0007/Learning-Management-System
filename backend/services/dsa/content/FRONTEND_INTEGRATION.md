# Frontend Integration Guide

## Overview

This guide shows how to integrate the extracted DSA problems into your React/TypeScript frontend.

## Step 1: Copy Extracted JSON Files

Copy the extracted JSON files to your frontend public directory:

```bash
# From the backend/dsa directory
cp -r extracted ../frontend/public/dsa-problems/
```

Or import them directly in your TypeScript code if using Vite:

```bash
cp extracted/all_problems.json ../frontend/src/data/dsa-problems.json
```

## Step 2: Use TypeScript Interfaces

The TypeScript interfaces are already created in `src/types/dsa.ts`. Import them in your components:

```typescript
import { Problem, DSACollection } from "@/types/dsa";
```

## Step 3: Load Problems in Your Component

### Option A: Static Import (Recommended for Vite)

```typescript
import dsaProblems from "@/data/dsa-problems.json";
import { DSACollection } from "@/types/dsa";

const problems = dsaProblems as DSACollection;
```

### Option B: Fetch from Public Directory

```typescript
import { useState, useEffect } from "react";
import { DSACollection, loadProblems } from "@/types/dsa";

function DSAPage() {
  const [problems, setProblems] = useState<DSACollection | null>(null);

  useEffect(() => {
    loadProblems("/dsa-problems/all_problems.json")
      .then(setProblems)
      .catch(console.error);
  }, []);

  if (!problems) return <div>Loading...</div>;

  return (
    <div>
      {problems.problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
```

## Step 4: Display Problems

### Example: Problem List Component

```typescript
import { Problem } from "@/types/dsa";

interface ProblemCardProps {
  problem: Problem;
}

function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <div className="problem-card">
      <h3>{problem.title}</h3>
      <div className="topics">
        {problem.topics.map((topic) => (
          <span key={topic} className="topic-badge">
            {topic}
          </span>
        ))}
      </div>
      <p>{problem.statement}</p>

      {/* Examples */}
      <div className="examples">
        <h4>Examples:</h4>
        {problem.examples.map((example, idx) => (
          <div key={idx} className="example">
            <div>
              <strong>Input:</strong> {example.input}
            </div>
            <div>
              <strong>Output:</strong> {example.output}
            </div>
            {example.explanation && (
              <div>
                <strong>Explanation:</strong> {example.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div className="constraints">
          <h4>Constraints:</h4>
          <pre>{problem.constraints}</pre>
        </div>
      )}

      {/* Solutions */}
      <div className="solutions">
        <h4>Solutions ({problem.solutions.length}):</h4>
        {problem.solutions.map((solution, idx) => (
          <div key={idx} className="solution">
            <h5>{solution.name || `Solution ${idx + 1}`}</h5>
            <div className="language-badge">{solution.language}</div>
            <pre>
              <code>{solution.code}</code>
            </pre>
            {solution.complexity && (
              <div className="complexity">
                {solution.complexity.time && (
                  <div>Time: {solution.complexity.time}</div>
                )}
                {solution.complexity.space && (
                  <div>Space: {solution.complexity.space}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 5: Filter and Search

### Example: Topic Filter

```typescript
import { useState } from "react";
import { DSACollection, getAllTopics, getProblemsByTopic } from "@/types/dsa";

function DSABrowser({ collection }: { collection: DSACollection }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const topics = getAllTopics(collection);

  const displayedProblems = selectedTopic
    ? getProblemsByTopic(collection, selectedTopic)
    : collection.problems;

  return (
    <div>
      <div className="topic-filter">
        <button onClick={() => setSelectedTopic(null)}>All</button>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={selectedTopic === topic ? "active" : ""}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="problems-list">
        {displayedProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
}
```

## Step 6: Code Editor Integration

For multi-language support, you can use Monaco Editor or CodeMirror:

```typescript
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Problem } from "@/types/dsa";

function CodeEditor({ problem }: { problem: Problem }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  // Get starter code from solutions
  const starterCode =
    problem.solutions.find((s) => s.language === language)?.code || "";

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="go">Go</option>
      </select>

      <Editor
        height="400px"
        language={language}
        value={code || starterCode}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <button onClick={() => submitSolution(problem.id, code, language)}>
        Submit Solution
      </button>
    </div>
  );
}

function submitSolution(problemId: string, code: string, language: string) {
  // Send to your backend API for execution/validation
  fetch("/api/dsa/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, code, language }),
  });
}
```

## Next Steps

1. **Copy JSON files** to your frontend
2. **Import TypeScript types** in your components
3. **Create UI components** for displaying problems
4. **Add code editor** for multi-language support
5. **Integrate with backend API** for solution submission and validation
