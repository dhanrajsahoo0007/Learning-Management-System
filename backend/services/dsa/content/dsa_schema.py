"""
DSA Problem Schema Definitions

This module defines the data models for DSA problems in a code-agnostic format.
Uses Pydantic for validation and serialization.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class Example(BaseModel):
    """Represents a sample input/output example for a problem."""
    input: str = Field(..., description="Sample input as a string")
    output: str = Field(..., description="Expected output as a string")
    explanation: Optional[str] = Field(None, description="Optional explanation of the example")


class TestCase(BaseModel):
    """Represents a test case for validation."""
    input: str = Field(..., description="Test input")
    expected_output: str = Field(..., description="Expected result")
    hidden: bool = Field(False, description="Whether this is a hidden test case")


class ComplexityAnalysis(BaseModel):
    """Represents time and space complexity analysis."""
    time: Optional[str] = Field(None, description="Time complexity (e.g., 'O(n log n)')")
    space: Optional[str] = Field(None, description="Space complexity (e.g., 'O(n)')")
    explanation: Optional[str] = Field(None, description="Detailed complexity explanation")


class Solution(BaseModel):
    """Represents a solution implementation."""
    language: str = Field(..., description="Programming language (e.g., 'python', 'go', 'javascript')")
    code: str = Field(..., description="Solution code")
    name: Optional[str] = Field(None, description="Solution name/variant (e.g., 'using_map', 'optimized')")
    complexity: Optional[ComplexityAnalysis] = Field(None, description="Complexity analysis for this solution")


class Problem(BaseModel):
    """Represents a complete DSA problem."""
    id: str = Field(..., description="Unique problem identifier (e.g., 'frequency-sort-of-array')")
    title: str = Field(..., description="Problem title")
    statement: str = Field(..., description="Full problem description")
    examples: List[Example] = Field(default_factory=list, description="Sample input/output examples")
    test_cases: List[TestCase] = Field(default_factory=list, description="Test cases for validation")
    constraints: Optional[str] = Field(None, description="Problem constraints")
    solutions: List[Solution] = Field(default_factory=list, description="Solution implementations")
    difficulty: Optional[str] = Field(None, description="Problem difficulty (e.g., 'Easy', 'Medium', 'Hard')")
    topics: List[str] = Field(default_factory=list, description="Related topics/tags (e.g., ['Array', 'Sorting', 'HashMap'])")
    source_file: Optional[str] = Field(None, description="Original source file path")


class DSACollection(BaseModel):
    """Represents a collection of DSA problems."""
    problems: List[Problem] = Field(default_factory=list, description="List of problems")
    metadata: Optional[Dict[str, str]] = Field(default_factory=dict, description="Collection metadata")

    def to_json_file(self, filepath: str) -> None:
        """Export collection to JSON file."""
        import json
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.model_dump(), f, indent=2, ensure_ascii=False)

    @classmethod
    def from_json_file(cls, filepath: str) -> 'DSACollection':
        """Load collection from JSON file."""
        import json
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return cls(**data)
