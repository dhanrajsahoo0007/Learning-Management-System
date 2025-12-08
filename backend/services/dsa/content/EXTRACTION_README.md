# DSA Problem Extraction System

This directory contains tools for extracting DSA problems from Python files into a code-agnostic JSON format.

## Files

- **dsa_schema.py** - Pydantic models for problem structure
- **dsa_parser.py** - Core parser for extracting problems from Python files
- **batch_extract.py** - Batch processing tool with CLI interface

## Installation

Install required dependencies:

```bash
pip install pydantic tqdm
```

## Usage

### Extract a Single File

```bash
python dsa_parser.py "00. Basic Python/01. Frequency sort of array.py"
```

### Batch Extract a Directory

```bash
# Extract all problems from a specific topic
python batch_extract.py "00. Basic Python" -o extracted

# Extract all problems from all topics
python batch_extract.py . -o extracted --all

# Extract with specific output formats
python batch_extract.py "01. Array" --individual --collection --by-topic
```

### CLI Options

- `path` - Path to file or directory to process
- `-o, --output` - Output directory (default: `extracted`)
- `-r, --recursive` - Process directories recursively (default: True)
- `--individual` - Save individual JSON files for each problem
- `--collection` - Save all problems as a single collection file
- `--by-topic` - Save problems grouped by topic
- `--all` - Save in all formats (default if none specified)

## Output Structure

### Individual Files

```
extracted/
├── frequency-sort-of-array.json
├── two-sum.json
└── ...
```

### Collection File

```
extracted/
└── all_problems.json
```

### By Topic

```
extracted/by_topic/
├── array.json
├── sorting.json
├── hashmap.json
└── ...
```

## JSON Schema

Each problem is exported with the following structure:

```json
{
  "id": "frequency-sort-of-array",
  "title": "Sort Array by Decreasing Frequency",
  "statement": "Given an array of integers, sort the array...",
  "examples": [
    {
      "input": "arr = [2, 5, 2, 8, 5, 6, 8, 8]",
      "output": "[8, 8, 8, 2, 2, 5, 5, 6]",
      "explanation": null
    }
  ],
  "test_cases": [],
  "constraints": "1 <= arr.length <= 10^5\n-10^9 <= arr[i] <= 10^9",
  "solutions": [
    {
      "language": "python",
      "code": "def frequency_sort_using_map(arr: List[int]) -> List[int]:\n    ...",
      "name": "frequency_sort_using_map",
      "complexity": {
        "time": "O(n log k)",
        "space": "O(n)",
        "explanation": "..."
      }
    }
  ],
  "difficulty": null,
  "topics": ["Basic Python", "Array", "Sorting", "HashMap"],
  "source_file": "/path/to/file.py"
}
```

## Integration

### With Go Backend

The extracted JSON files can be:

1. Served via API endpoints
2. Imported into Turso database
3. Used for multi-language problem display

### With Frontend

Import the JSON collections in your TypeScript/React app:

```typescript
import problems from "./extracted/all_problems.json";
```

## Next Steps

1. Run extraction on all DSA files
2. Review and validate output
3. Integrate with backend API
4. Update frontend to display problems
