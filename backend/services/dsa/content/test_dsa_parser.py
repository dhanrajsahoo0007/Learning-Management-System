"""
Unit tests for DSA Parser

Run with: python -m pytest test_dsa_parser.py -v
"""

import json
from pathlib import Path
from dsa_parser import parse_dsa_file
from dsa_schema import Problem


def test_parse_frequency_sort():
    """Test parsing the frequency sort problem."""
    filepath = "00. Basic Python /01. Frequency sort of array.py"
    
    if not Path(filepath).exists():
        print(f"Skipping test - file not found: {filepath}")
        return
    
    problem = parse_dsa_file(filepath)
    
    # Verify basic fields
    assert problem.id == "frequency-sort-of-array"
    assert "frequency" in problem.title.lower()
    assert len(problem.statement) > 0
    
    # Verify examples
    assert len(problem.examples) >= 2
    assert problem.examples[0].input is not None
    assert problem.examples[0].output is not None
    
    # Verify constraints
    assert problem.constraints is not None
    assert "10^5" in problem.constraints
    
    # Verify solutions
    assert len(problem.solutions) >= 1
    assert problem.solutions[0].language == "python"
    assert "def " in problem.solutions[0].code
    
    # Verify topics
    assert len(problem.topics) > 0
    
    print("✓ All tests passed!")
    print(f"\nExtracted problem: {problem.title}")
    print(f"Topics: {', '.join(problem.topics)}")
    print(f"Solutions: {len(problem.solutions)}")
    print(f"Examples: {len(problem.examples)}")


def test_json_serialization():
    """Test that problems can be serialized to JSON."""
    filepath = "00. Basic Python /01. Frequency sort of array.py"
    
    if not Path(filepath).exists():
        print(f"Skipping test - file not found: {filepath}")
        return
    
    problem = parse_dsa_file(filepath)
    
    # Convert to JSON
    json_data = problem.model_dump()
    json_str = json.dumps(json_data, indent=2)
    
    # Verify it's valid JSON
    parsed = json.loads(json_str)
    assert parsed["id"] == problem.id
    assert parsed["title"] == problem.title
    
    print("✓ JSON serialization test passed!")


if __name__ == "__main__":
    print("Running DSA Parser Tests...\n")
    test_parse_frequency_sort()
    print()
    test_json_serialization()
    print("\n✅ All tests completed successfully!")
