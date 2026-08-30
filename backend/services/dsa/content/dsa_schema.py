"""
Schema definitions for extracted DSA content.

These dataclasses describe the JSON that `extract.py` writes and that the Go
importer (`backend/services/dsa/cmd/import`) reads. Standard library only, so
the extractor runs with a bare `python3` and no virtualenv.
"""

from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional

# A problem is "solved" when its source file contains real code, and "pending"
# when the file exists in the curriculum but is still empty.
STATUS_SOLVED = "solved"
STATUS_PENDING = "pending"


@dataclass
class Example:
    input: str
    output: str
    explanation: Optional[str] = None


@dataclass
class ComplexityAnalysis:
    time: Optional[str] = None
    space: Optional[str] = None
    explanation: Optional[str] = None


@dataclass
class Solution:
    language: str
    code: str
    name: Optional[str] = None
    complexity: Optional[ComplexityAnalysis] = None


@dataclass
class Problem:
    # Slug of the full path relative to the content root, which keeps the id
    # unique even though 127 files share a filename with another problem.
    id: str
    topic_id: str
    title: str
    # Folder titles between the topic and the file, outermost first.
    section_path: List[str] = field(default_factory=list)
    statement: str = ""
    constraints: Optional[str] = None
    notes: Optional[str] = None
    examples: List[Example] = field(default_factory=list)
    solutions: List[Solution] = field(default_factory=list)
    difficulty: Optional[str] = None
    status: str = STATUS_PENDING
    source_file: str = ""
    # Zero-padded per-segment key that reproduces the on-disk teaching order
    # under a plain lexicographic sort.
    sort_key: str = ""


@dataclass
class Topic:
    id: str
    title: str
    category: str
    description: str
    difficulty: str
    icon: str
    color: str
    folder_path: str
    problem_count: int = 0
    solved_count: int = 0
    sections: List[str] = field(default_factory=list)


def to_dict(obj: Any) -> Dict[str, Any]:
    """Serialize a dataclass, dropping keys that are None or empty lists."""

    def prune(value: Any) -> Any:
        if isinstance(value, dict):
            return {k: prune(v) for k, v in value.items() if v is not None}
        if isinstance(value, list):
            return [prune(v) for v in value]
        return value

    return prune(asdict(obj))
