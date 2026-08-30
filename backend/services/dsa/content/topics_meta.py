"""
Canonical topic metadata for the DSA curriculum.

The ids here are the contract between the content tree, the `dsa_topics` table
and the frontend routes, so they must stay in sync with the ids in
`frontend/src/data/dsaData.ts`. Folder names are matched after trimming, since
four folders on disk carry a trailing space.

Order of the tuple: folder, id, title, category, difficulty, icon, color, description.
"""

from typing import Dict, List, Tuple

TOPIC_META: List[Tuple[str, str, str, str, str, str, str, str]] = [
    ("00. Basic Python", "basic-python", "Basic Python", "Fundamentals", "Easy", "Code", "bg-blue-500", "Python fundamentals and basic programming concepts"),
    ("01. Array", "array", "Array", "Arrays & Strings", "Easy", "Grid3X3", "bg-green-500", "Array manipulation, searching, counting, and transformation problems"),
    ("02. Prefix Sum", "prefix-sum", "Prefix Sum", "Arrays & Strings", "Medium", "Plus", "bg-yellow-500", "Efficient range query problems using prefix sum technique"),
    ("03. 2D Array - Matrix", "2d-array-matrix", "2D Array - Matrix", "Arrays & Strings", "Medium", "Grid2X2", "bg-purple-500", "Matrix operations, traversal, and transformation"),
    ("04. HashMap", "hashmap", "HashMap", "Arrays & Strings", "Easy", "Hash", "bg-red-500", "Hash table problems for fast lookups and counting"),
    ("05. String", "string", "String", "Arrays & Strings", "Medium", "Type", "bg-indigo-500", "String manipulation, pattern matching, and transformation"),
    ("06. Pointers", "pointers", "Pointers", "Linked Lists & Pointers", "Medium", "MousePointer", "bg-teal-500", "Two-pointer and multi-pointer techniques"),
    ("07. Sliding Window", "sliding-window", "Sliding Window", "Arrays & Strings", "Medium", "LayoutGrid", "bg-orange-500", "Sliding window technique for subarray problems"),
    ("08. Binary Search", "binary-search", "Binary Search", "Sorting & Searching", "Medium", "Search", "bg-pink-500", "Binary search and its variations"),
    ("09. Stack and Queue", "stack-queue", "Stack and Queue", "Stacks & Queues", "Medium", "Layers", "bg-cyan-500", "Stack and queue data structures and applications"),
    ("10. Heap", "heap", "Heap", "Trees & Graphs", "Hard", "Mountain", "bg-lime-500", "Priority queue and heap data structure"),
    ("11. Recursion", "recursion", "Recursion", "Fundamentals", "Medium", "Repeat", "bg-violet-500", "Recursive problem solving techniques"),
    ("12. Back Tracking", "backtracking", "Back Tracking", "Advanced Topics", "Hard", "Undo", "bg-fuchsia-500", "Backtracking algorithm for constraint satisfaction"),
    ("13. Linked List", "linked-list", "Linked List", "Linked Lists & Pointers", "Medium", "Link", "bg-rose-500", "Singly and doubly linked list operations"),
    ("14. Trees", "trees", "Trees", "Trees & Graphs", "Medium", "TreePine", "bg-emerald-500", "Binary trees, tree traversal, and tree problems"),
    ("15. Binary Search Tree", "bst", "Binary Search Tree", "Trees & Graphs", "Medium", "Binary", "bg-sky-500", "BST operations and properties"),
    ("16. Tries", "tries", "Tries", "Trees & Graphs", "Hard", "Network", "bg-amber-500", "Trie data structure for string operations"),
    ("17. Graphs", "graphs", "Graphs", "Trees & Graphs", "Hard", "GitBranch", "bg-blue-600", "Graph algorithms including DFS, BFS, and shortest path"),
    ("18. Greedy", "greedy", "Greedy", "Advanced Topics", "Hard", "TrendingUp", "bg-green-600", "Greedy algorithm approach for optimization"),
    ("19. Interval", "interval", "Interval", "Arrays & Strings", "Medium", "Calendar", "bg-purple-600", "Interval merging and scheduling problems"),
    ("20. Dynamic Programming", "dynamic-programming", "Dynamic Programming", "Dynamic Programming", "Hard", "Zap", "bg-yellow-600", "DP problems including memoization and tabulation"),
    ("21. Math & Geometry", "math-geometry", "Math & Geometry", "Advanced Topics", "Medium", "Calculator", "bg-red-600", "Mathematical and geometric problems"),
    ("22. Bit Manipulation", "bit-manipulation", "Bit Manipulation", "Advanced Topics", "Hard", "Binary", "bg-indigo-600", "Bitwise operations and tricks"),
    ("23. Sorting", "sorting", "Sorting", "Sorting & Searching", "Medium", "ArrowUpDown", "bg-teal-600", "Sorting algorithms and their applications"),
    ("24. Divide and Conquer", "divide-conquer", "Divide and Conquer", "Advanced Topics", "Hard", "Split", "bg-orange-600", "Divide and conquer algorithm paradigm"),
    ("25. Design Questions", "design-questions", "Design Questions", "Advanced Topics", "Hard", "Boxes", "bg-pink-600", "System design and data structure design problems"),
]

# Folder name (trimmed) -> topic id
FOLDER_TO_TOPIC: Dict[str, str] = {row[0].strip(): row[1] for row in TOPIC_META}
