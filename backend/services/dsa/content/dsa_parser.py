"""
DSA Problem Parser

This module extracts DSA problems from Python files and converts them
into a code-agnostic JSON structure.
"""

import ast
import re
from pathlib import Path
from typing import List, Optional, Tuple
from dsa_schema import Problem, Example, TestCase, Solution, ComplexityAnalysis


class DSAParser:
    """Parser for extracting DSA problems from Python files."""

    def __init__(self, filepath: str):
        self.filepath = Path(filepath)
        self.content = self.filepath.read_text(encoding='utf-8')
        self.tree = ast.parse(self.content)
        
    def parse(self) -> Problem:
        """Parse the file and extract problem information."""
        problem_id = self._generate_problem_id()
        title = self._extract_title()
        statement = self._extract_statement()
        examples = self._extract_examples()
        constraints = self._extract_constraints()
        solutions = self._extract_solutions()
        topics = self._infer_topics()
        
        return Problem(
            id=problem_id,
            title=title,
            statement=statement,
            examples=examples,
            test_cases=[],  # Can be enhanced to extract from test functions
            constraints=constraints,
            solutions=solutions,
            topics=topics,
            source_file=str(self.filepath)
        )
    
    def _generate_problem_id(self) -> str:
        """Generate a unique problem ID from filename."""
        # Remove numbering prefix (e.g., "01. ") and file extension
        name = self.filepath.stem
        name = re.sub(r'^\d+\.\s*', '', name)
        # Convert to lowercase and replace spaces with hyphens
        problem_id = name.lower().replace(' ', '-')
        # Remove special characters
        problem_id = re.sub(r'[^a-z0-9-]', '', problem_id)
        return problem_id
    
    def _extract_title(self) -> str:
        """Extract problem title from filename or docstring."""
        # Try to get from "Problem Statement:" in docstring
        docstring = ast.get_docstring(self.tree)
        if docstring:
            match = re.search(r'Problem Statement:\s*(.+?)(?:\n|$)', docstring)
            if match:
                return match.group(1).strip()
        
        # Fallback to filename
        name = self.filepath.stem
        name = re.sub(r'^\d+\.\s*', '', name)
        return name.title()
    
    def _extract_statement(self) -> str:
        """Extract the problem statement from module docstring."""
        docstring = ast.get_docstring(self.tree)
        if not docstring:
            return ""
        
        # Remove "Problem Statement:" prefix if present
        statement = re.sub(r'^Problem Statement:\s*', '', docstring, flags=re.MULTILINE)
        
        # Remove examples section (we'll extract them separately)
        statement = re.split(r'\n\s*Example \d+:', statement)[0]
        
        # Remove constraints section (we'll extract them separately)
        statement = re.split(r'\n\s*Constraints?:', statement)[0]
        
        return statement.strip()
    
    def _extract_examples(self) -> List[Example]:
        """Extract examples from docstring."""
        docstring = ast.get_docstring(self.tree)
        if not docstring:
            return []
        
        examples = []
        # Split docstring into lines for better parsing
        lines = docstring.split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Look for "Example N:" pattern
            if re.match(r'Example \d+:', line):
                example_data = {'input': '', 'output': '', 'explanation': None}
                i += 1
                
                # Extract Input
                while i < len(lines):
                    line = lines[i].strip()
                    if line.startswith('Input:'):
                        example_data['input'] = line.replace('Input:', '').strip()
                        i += 1
                        break
                    i += 1
                
                # Extract Output
                while i < len(lines):
                    line = lines[i].strip()
                    if line.startswith('Output:'):
                        example_data['output'] = line.replace('Output:', '').strip()
                        i += 1
                        break
                    i += 1
                
                # Extract Explanation (optional)
                if i < len(lines):
                    line = lines[i].strip()
                    if line.startswith('Explanation:'):
                        example_data['explanation'] = line.replace('Explanation:', '').strip()
                        i += 1
                
                if example_data['input'] and example_data['output']:
                    examples.append(Example(
                        input=example_data['input'],
                        output=example_data['output'],
                        explanation=example_data['explanation']
                    ))
            else:
                i += 1
        
        return examples
    
    def _extract_constraints(self) -> Optional[str]:
        """Extract constraints from docstring."""
        docstring = ast.get_docstring(self.tree)
        if not docstring:
            return None
        
        lines = docstring.split('\n')
        constraints_lines = []
        in_constraints = False
        
        for line in lines:
            stripped = line.strip()
            if re.match(r'Constraints?:', stripped):
                in_constraints = True
                # Get constraint text on same line if present
                constraint_text = re.sub(r'Constraints?:\s*', '', stripped)
                if constraint_text:
                    constraints_lines.append(constraint_text)
            elif in_constraints:
                # Stop if we hit an empty line or another section
                if not stripped or re.match(r'(Example|Note|Solution):', stripped):
                    break
                constraints_lines.append(stripped)
        
        return '\n'.join(constraints_lines).strip() if constraints_lines else None
    
    def _extract_solutions(self) -> List[Solution]:
        """Extract solution functions from the file."""
        solutions = []
        
        # Only get top-level functions (not nested ones)
        for node in self.tree.body:
            if isinstance(node, ast.FunctionDef):
                # Skip private functions and test functions
                if node.name.startswith('_') or node.name.startswith('test_'):
                    continue
                
                # Extract function code
                code = self._get_function_code(node)
                
                # Extract complexity analysis
                complexity = self._extract_complexity_for_function(node.name)
                
                solutions.append(Solution(
                    language="python",
                    code=code,
                    name=node.name,
                    complexity=complexity
                ))
        
        return solutions
    
    def _get_function_code(self, node: ast.FunctionDef) -> str:
        """Extract the source code for a function."""
        lines = self.content.splitlines()
        start_line = node.lineno - 1
        end_line = node.end_lineno if node.end_lineno else start_line + 1
        
        function_lines = lines[start_line:end_line]
        return '\n'.join(function_lines)
    
    def _extract_complexity_for_function(self, func_name: str) -> Optional[ComplexityAnalysis]:
        """Extract complexity analysis from comments following a function."""
        lines = self.content.splitlines()
        
        # Find the function definition
        func_pattern = rf'def {re.escape(func_name)}\('
        func_end_line = None
        
        # Parse AST to find function end line
        for node in self.tree.body:
            if isinstance(node, ast.FunctionDef) and node.name == func_name:
                func_end_line = node.end_lineno
                break
        
        if func_end_line is None:
            return None
        
        # Look for complexity comments/docstrings after the function
        complexity_text = []
        for i in range(func_end_line, min(func_end_line + 30, len(lines))):
            line = lines[i]
            
            # Stop if we hit another function or class
            if re.match(r'^(def |class )', line):
                break
            
            # Collect docstrings and comments about complexity
            stripped = line.strip()
            if any(keyword in stripped.lower() for keyword in ['complexity', 'time:', 'space:']):
                complexity_text.append(stripped)
        
        if not complexity_text:
            return None
        
        full_text = '\n'.join(complexity_text)
        
        # Extract time complexity - look for O(...) notation
        time_match = re.search(r'Time Complexity[:\s]+for[^:]*:\s*([O\(][^\n,]+)', full_text, re.IGNORECASE)
        if not time_match:
            time_match = re.search(r'Time Complexity[:\s]+([O\(][^\n,]+)', full_text, re.IGNORECASE)
        time_complexity = time_match.group(1).strip() if time_match else None
        
        # Extract space complexity
        space_match = re.search(r'Space Complexity[:\s]+for[^:]*:\s*([O\(][^\n,]+)', full_text, re.IGNORECASE)
        if not space_match:
            space_match = re.search(r'Space Complexity[:\s]+([O\(][^\n,]+)', full_text, re.IGNORECASE)
        space_complexity = space_match.group(1).strip() if space_match else None
        
        if time_complexity or space_complexity:
            return ComplexityAnalysis(
                time=time_complexity,
                space=space_complexity,
                explanation=full_text.strip()
            )
        
        return None
    
    def _infer_topics(self) -> List[str]:
        """Infer topics from file path and content."""
        topics = []
        
        # Extract from directory name
        parent_dir = self.filepath.parent.name
        # Remove numbering prefix
        topic = re.sub(r'^\d+\.\s*', '', parent_dir).strip()
        if topic and topic != 'dsa':
            topics.append(topic)
        
        # Infer from imports and code patterns
        if 'Counter' in self.content:
            topics.append('HashMap')
        if 'sorted' in self.content or 'sort' in self.content:
            topics.append('Sorting')
        if 'List[' in self.content or 'arr' in self.content:
            topics.append('Array')
        
        return list(set(topics))  # Remove duplicates


def parse_dsa_file(filepath: str) -> Problem:
    """
    Parse a DSA Python file and extract problem information.
    
    Args:
        filepath: Path to the Python file
        
    Returns:
        Problem object containing extracted information
    """
    parser = DSAParser(filepath)
    return parser.parse()


if __name__ == "__main__":
    # Example usage
    import sys
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python dsa_parser.py <filepath>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    problem = parse_dsa_file(filepath)
    
    # Print as JSON
    print(json.dumps(problem.model_dump(), indent=2, ensure_ascii=False))
