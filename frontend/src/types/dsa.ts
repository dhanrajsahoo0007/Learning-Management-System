/**
 * Types for individual DSA problems.
 *
 * These mirror the payloads served by the DSA service, which are generated
 * from the Python files under backend/services/dsa/content by extract.py.
 */

/** A problem is pending when its source file exists but has no solution yet. */
export type ProblemStatus = 'solved' | 'pending';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemComplexity {
  time?: string;
  space?: string;
}

/** One implementation. A file often holds several named variants. */
export interface ProblemSolution {
  language: string;
  code: string;
  name?: string;
  complexity?: ProblemComplexity;
}

export interface DSAProblem {
  id: string;
  topicId: string;
  title: string;
  /** Folder titles between the topic and the file, outermost first. */
  sectionPath: string[];
  statement: string;
  constraints?: string;
  /** Trailing write-up the author left below the code. */
  notes?: string;
  examples: ProblemExample[];
  solutions: ProblemSolution[];
  difficulty?: string;
  status: ProblemStatus;
  sourceFile: string;
  sortKey: string;
}

/** List payload; omits statements and solution bodies to keep responses small. */
export interface DSAProblemSummary {
  id: string;
  topicId: string;
  title: string;
  sectionPath: string[];
  difficulty?: string;
  status: ProblemStatus;
  sortKey: string;
  hasSolution: boolean;
  hasStatement: boolean;
  solutionCount: number;
}

/** A problem is worth opening when there is something to read or run. */
export function isProblemOpenable(problem: DSAProblemSummary): boolean {
  return problem.hasSolution || problem.hasStatement;
}

/** Groups problems into their sections while preserving curriculum order. */
export function groupBySection(
  problems: DSAProblemSummary[]
): Array<{ section: string; problems: DSAProblemSummary[] }> {
  const groups: Array<{ section: string; problems: DSAProblemSummary[] }> = [];
  const index = new Map<string, number>();

  for (const problem of problems) {
    const section = problem.sectionPath.join(' / ') || 'Overview';
    const existing = index.get(section);
    if (existing === undefined) {
      index.set(section, groups.length);
      groups.push({ section, problems: [problem] });
    } else {
      groups[existing].problems.push(problem);
    }
  }

  return groups;
}
