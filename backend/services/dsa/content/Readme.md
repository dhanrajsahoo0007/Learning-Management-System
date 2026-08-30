# DSA content

This folder is the source of truth for the DSA curriculum. Each `.py` file under a
numbered topic folder is one problem, and the folder numbering defines the order
problems are taught in.

The pipeline that gets these files onto the website is:

```
890 .py files  ->  extract.py  ->  extracted/*.json  ->  cmd/import  ->  dsa_problems table  ->  API  ->  UI
```

## Running the pipeline

Extract the tree into JSON (standard library only, no virtualenv needed):

```bash
cd backend/services/dsa/content
python3 extract.py
```

Load the JSON into the database. This also applies any pending migrations from
`../migrations` and is safe to re-run:

```bash
cd backend/services/dsa
go run ./cmd/import
```

The importer reads `DATABASE_URL` and `DATABASE_AUTH_TOKEN`, the same variables
the service uses. For a local SQLite file, point `DATABASE_URL` at a path and
leave the auth token empty.

Re-run both steps after adding, renaming or filling in a problem file. Rows whose
files have disappeared are pruned automatically.

## Output

`extract.py` writes three files into `extracted/`:

- `dsa_problems.json` - every problem, including the empty ones
- `dsa_topics.json` - the 26 topics with problem and solved counts
- `coverage.md` - which files are still empty, per topic

These are committed so a deploy does not need Python.

## Authoring conventions

The parser is tolerant of the formats already in the tree, but new files extract
best when they follow this shape:

```python
"""
Problem Statement: Title of the problem
    A description of what needs to be solved.

Example 1:
    Input: nums = [3,4,5,6], target = 7
    Output: [0,1]
    Explanation: nums[0] + nums[1] == 7

Constraints:
    1 <= nums.length <= 10^5
"""
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        ...

"""
Time Complexity: O(n)
Space Complexity: O(n)
"""
```

What the parser picks up:

- **Statement** from the leading module docstring. `Problem Statement:`,
  `Problem:` and the `Problem Staement` typo are all recognised as headers.
- **Examples** from `Example N:` blocks with `Input:` / `Output:` / `Explanation:`.
- **Constraints** from a `Constraints:` block.
- **Solutions** from a `class Solution`, from bare top-level functions, or from a
  plain class such as `LRUCache`. When a file holds several independent
  approaches, each becomes a named variant on the problem page.
- **Complexity** from `Time Complexity` / `Space Complexity` text following a
  function, shown as badges next to each variant.
- **Notes** from any trailing module-level docstring, shown as author's notes.

Test harnesses (`test_*`, `main`, `if __name__` blocks) and bottom-of-file driver
statements are excluded from the solution code.

An empty file is not an error. It is imported with status `pending` and shows on
the site as "Coming soon", which keeps the curriculum order visible and makes the
gaps easy to find in `coverage.md`.

## Identity and ordering

Problem ids are slugs of the full path, for example
`graphs/dfs-story-based/introduction-to-graph-traversal/number-of-provinces`.
The filename alone is not unique: 127 files share a name with another problem,
and some problems intentionally appear under several topics.

Ordering uses a `sort_key` built from the numeric prefix of every path segment,
so a plain `ORDER BY sort_key` reproduces the on-disk teaching order.

## Files

- `extract.py` - CLI entry point, walks the tree and writes the JSON
- `dsa_parser.py` - parses one file into a problem
- `dsa_schema.py` - dataclasses describing the JSON
- `topics_meta.py` - the 26 topic definitions; ids must match
  `frontend/src/data/dsaData.ts`
