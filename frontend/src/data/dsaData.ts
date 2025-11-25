export interface DSATopic {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  icon: string;
  color: string;
  folderPath: string;
  problemCount: number;
  subcomponents: string[]; // NEW: List of subfolder names
  content: {
    explanation: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    codeTemplates: {
      javascript: string;
      python: string;
      java: string;
      cpp: string;
    };
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
    hints: string[];
    solution: string;
  };
}

export const dsaCategories = [
  'Fundamentals',
  'Arrays & Strings',
  'Linked Lists & Pointers',
  'Stacks & Queues',
  'Trees & Graphs',
  'Dynamic Programming',
  'Sorting & Searching',
  'Advanced Topics'
];

// Real DSA topics from backend/dsa folder
export const dsaTopics: DSATopic[] = [
  {
    id: 'basic-python',
    title: 'Basic Python',
    category: 'Fundamentals',
    description: 'Python fundamentals and basic programming concepts',
    difficulty: 'Easy',
    progress: 0,
    icon: 'Code',
    color: 'bg-blue-500',
    folderPath: '00. Basic Python',
    problemCount: 5,
    content: {
      explanation: 'Learn Python basics including syntax, data types, control structures, and functions.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Python basics\nprint("Hello, World!")',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Start with basic syntax', 'Practice with simple programs'],
      solution: 'Master Python fundamentals before moving to data structures.'
    }
  },
  {
    id: 'array',
    title: 'Array',
    category: 'Arrays & Strings',
    description: 'Array manipulation, searching, counting, and transformation problems',
    difficulty: 'Easy',
    progress: 0,
    icon: 'Grid3X3',
    color: 'bg-green-500',
    folderPath: '01. Array',
    problemCount: 10,
    subcomponents: [
      "01. Basic Array Manipulation",
      "02. Array Searching and Counting",
      "03. String Manipulation",
      "04. Mathematical Array Problems",
      "05. Subarray Problem",
      "06. Array Transformation",
      "07. Sequence and Permutation Problems",
      "08. Advanced Array Problems",
      "09. Mathematical Sequence Problems",
      "10. Geometry Problems",
      "11. String Binary Operation",
      "12. Advanced Problem Solving"
    ],
    content: {
      explanation: 'Arrays are fundamental data structures. Master array operations including searching, sorting, and manipulation.',
      examples: [
        {
          input: 'nums = [2, 7, 11, 15], target = 9',
          output: '[0, 1]',
          explanation: 'Find two numbers that add up to target'
        }
      ],
      codeTemplates: {
        javascript: `function arrayOperation(nums) {\n    // Your solution here\n    return nums;\n}`,
        python: `def array_operation(nums):\n    # Your solution here\n    return nums`,
        java: `public int[] arrayOperation(int[] nums) {\n    // Your solution here\n    return nums;\n}`,
        cpp: `vector<int> arrayOperation(vector<int>& nums) {\n    // Your solution here\n    return nums;\n}`
      },
      testCases: [],
      hints: ['Use hash maps for O(n) solutions', 'Consider two-pointer technique'],
      solution: 'Practice various array patterns and techniques.'
    }
  },
  {
    id: 'prefix-sum',
    title: 'Prefix Sum',
    category: 'Arrays & Strings',
    description: 'Efficient range query problems using prefix sum technique',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Plus',
    color: 'bg-yellow-500',
    folderPath: '02. Prefix Sum',
    problemCount: 8,
    content: {
      explanation: 'Prefix sum is a technique to efficiently answer range sum queries in O(1) time after O(n) preprocessing.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Prefix sum implementation',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Build prefix sum array first', 'Use formula: sum[i:j] = prefix[j] - prefix[i-1]'],
      solution: 'Master prefix sum for efficient range queries.'
    }
  },
  {
    id: '2d-array-matrix',
    title: '2D Array - Matrix',
    category: 'Arrays & Strings',
    description: 'Matrix operations, traversal, and transformation',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Grid2X2',
    color: 'bg-purple-500',
    folderPath: '03. 2D Array - Matrix',
    problemCount: 6,
    subcomponents: [
      "01. Matrix Manipulation",
      "02. BS on 2D array | Matrix",
      "03. Stack | Matrix",
      "04. Heap | Matrix"
    ],
    content: {
      explanation: 'Work with 2D arrays and matrices including rotation, spiral traversal, and search.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Matrix operations',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Understand row-major vs column-major', 'Practice matrix traversal patterns'],
      solution: 'Master 2D array manipulation techniques.'
    }
  },
  {
    id: 'hashmap',
    title: 'HashMap',
    category: 'Arrays & Strings',
    description: 'Hash table problems for fast lookups and counting',
    difficulty: 'Easy',
    progress: 0,
    icon: 'Hash',
    color: 'bg-red-500',
    folderPath: '04. HashMap',
    problemCount: 5,
    subcomponents: [],
    content: {
      explanation: 'Hash maps provide O(1) average time complexity for insertions, deletions, and lookups.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# HashMap usage',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use for frequency counting', 'Great for two-sum type problems'],
      solution: 'Master hash map patterns for efficient solutions.'
    }
  },
  {
    id: 'string',
    title: 'String',
    category: 'Arrays & Strings',
    description: 'String manipulation, pattern matching, and transformation',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Type',
    color: 'bg-indigo-500',
    folderPath: '05. String',
    problemCount: 10,
    subcomponents: [
      "01. Basic String Operations",
      "02. String Compression and Manipulation",
      "03. String Comparison and Validation",
      "04. Lexicography",
      "05. String Recursion and Pattern Matching",
      "06. KMP Algorithm",
      "07. Rabin-Karp | Rolling hash",
      "08. Aho-Corasick Algorithm"
    ],
    content: {
      explanation: 'String problems involve manipulation, searching, and pattern matching.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# String operations',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Strings are immutable in many languages', 'Use StringBuilder for concatenation'],
      solution: 'Practice string algorithms and patterns.'
    }
  },
  {
    id: 'pointers',
    title: 'Pointers',
    category: 'Linked Lists & Pointers',
    description: 'Two-pointer and multi-pointer techniques',
    difficulty: 'Medium',
    progress: 0,
    icon: 'MousePointer',
    color: 'bg-teal-500',
    folderPath: '06. Pointers',
    problemCount: 9,
    subcomponents: [
      "01. String Manipulation with Two Pointers",
      "02. Sorted Array Operations",
      "03. Two Sum Variations",
      "04. Water Container Problems",
      "05. 3 Pointers",
      "06. Miscellaneous",
      "07. Fast And Slow Poiner"
    ],
    content: {
      explanation: 'Two-pointer technique is used to solve array and string problems efficiently.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Two-pointer technique',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use for sorted arrays', 'Fast and slow pointer for cycles'],
      solution: 'Master two-pointer patterns.'
    }
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    category: 'Arrays & Strings',
    description: 'Sliding window technique for subarray problems',
    difficulty: 'Medium',
    progress: 0,
    icon: 'LayoutGrid',
    color: 'bg-orange-500',
    folderPath: '07. Sliding Window',
    problemCount: 11,
    subcomponents: [
      "01. Fixed Size",
      "02. String Manipulation with Sliding Window",
      "03. Variable size",
      "04. Advanced String Problems",
      "05. Heap",
      "06. Story Problem",
      "07. Sliding Window with Special Conditions.py",
      "08. Alphabet150",
      "09. Sweep Line Technique"
    ],
    content: {
      explanation: 'Sliding window is used to find subarrays that satisfy certain conditions.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Sliding window',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Expand window to include elements', 'Shrink window when condition met'],
      solution: 'Practice fixed and variable size windows.'
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Sorting & Searching',
    description: 'Binary search and its variations',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Search',
    color: 'bg-pink-500',
    folderPath: '08. Binary Search',
    problemCount: 14,
    subcomponents: [
      "01. Basic",
      "02. Roated Array",
      "03. Infinite Array",
      "04. Peak Element",
      "05. Basic Binary Search on Arrays",
      "06. Minimum | Maximum",
      "07. Maximum of Minimum | Minimum of Maximum",
      "07. Sliding Window",
      "08. Prefix Sum",
      "09. String",
      "10. Maths",
      "11. Advanced Array Problems"
    ],
    content: {
      explanation: 'Binary search is an efficient O(log n) search algorithm for sorted arrays.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Binary search',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Array must be sorted', 'Watch for integer overflow in mid calculation'],
      solution: 'Master binary search template and variations.'
    }
  },
  {
    id: 'stack-queue',
    title: 'Stack and Queue',
    category: 'Stacks & Queues',
    description: 'Stack and queue data structures and applications',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Layers',
    color: 'bg-cyan-500',
    folderPath: '09. Stack and Queue',
    problemCount: 11,
    subcomponents: [
      "01. Basics",
      "02. Parentheses",
      "03. String Manipultion with Stack",
      "04. Expression Evaluation",
      "05. Monotonic Stack Applications",
      "06. Stack Operations",
      "07. Queue Applications",
      "08. Stack in Array Problems",
      "09. Advanced Applications"
    ],
    content: {
      explanation: 'Stacks (LIFO) and Queues (FIFO) are fundamental data structures.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Stack and Queue',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Stack for DFS, Queue for BFS', 'Use for parentheses matching'],
      solution: 'Practice stack and queue applications.'
    }
  },
  {
    id: 'heap',
    title: 'Heap',
    category: 'Trees & Graphs',
    description: 'Priority queue and heap data structure',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Mountain',
    color: 'bg-lime-500',
    folderPath: '10. Heap',
    problemCount: 14,
    subcomponents: [
      "01. Basic Heap Operations",
      "02. K Way Processing",
      "03. Two Heaps",
      "04. Cost Optimization Problems",
      "04. Data Stream Processing",
      "05. Cost Optimization Problems",
      "05. Two Heaps",
      "06. Binary Search",
      "07. String",
      "08. Advanced Applications"
    ],
    content: {
      explanation: 'Heaps are complete binary trees used to implement priority queues.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Heap operations',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Min-heap for smallest elements', 'Max-heap for largest elements'],
      solution: 'Master heap operations and applications.'
    }
  },
  {
    id: 'recursion',
    title: 'Recursion',
    category: 'Fundamentals',
    description: 'Recursive problem solving techniques',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Repeat',
    color: 'bg-violet-500',
    folderPath: '11. Recursion',
    problemCount: 8,
    subcomponents: [
      "01. Basic Recursion Concepts",
      "02. Recursive Sorting",
      "03. Pattern Problems",
      "04. Subset Generation Problems",
      "05. Permutation Problems",
      "06. Game Theory and Circular Problem"
    ],
    content: {
      explanation: 'Recursion is a technique where a function calls itself to solve smaller subproblems.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Recursion',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Define base case', 'Ensure progress toward base case'],
      solution: 'Practice recursive thinking.'
    }
  },
  {
    id: 'backtracking',
    title: 'Back Tracking',
    category: 'Advanced Topics',
    description: 'Backtracking algorithm for constraint satisfaction',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Undo',
    color: 'bg-fuchsia-500',
    folderPath: '12. Back Tracking',
    problemCount: 8,
    subcomponents: [
      "01. Permutation Pattern",
      "02. Subset Pattern",
      "03. Combination Pattern",
      "04. Grid Traversal",
      "05. String Pattern",
      "06. Decision Making Problems"
    ],
    content: {
      explanation: 'Backtracking is used to find all solutions by exploring all possibilities.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Backtracking',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Try all possibilities', 'Backtrack when constraint violated'],
      solution: 'Master backtracking template.'
    }
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    category: 'Linked Lists & Pointers',
    description: 'Singly and doubly linked list operations',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Link',
    color: 'bg-rose-500',
    folderPath: '13. Linked List',
    problemCount: 15,
    subcomponents: [
      "01. Fundamental Operations",
      "02. List Modifications",
      "03. Two-Pointer Technique",
      "04. Grouping and Partitioning",
      "05. Senatio Based",
      "05. Sorting and Merging",
      "06. Advanced List Operations",
      "07. Double LinkedList",
      "08. Circular LinkedList",
      "09. Stack",
      "10. Heap",
      "11. System Design with Lists"
    ],
    content: {
      explanation: 'Linked lists are linear data structures with dynamic size.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Linked List',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use dummy node for edge cases', 'Fast and slow pointer for cycles'],
      solution: 'Practice linked list manipulation.'
    }
  },
  {
    id: 'trees',
    title: 'Trees',
    category: 'Trees & Graphs',
    description: 'Binary trees, tree traversal, and tree problems',
    difficulty: 'Medium',
    progress: 0,
    icon: 'TreePine',
    color: 'bg-emerald-500',
    folderPath: '14. Trees',
    problemCount: 6,
    subcomponents: [
      "01. Binary Tree",
      "02. Segment Tree",
      "03. N-Ary Tree",
      "04. Fenwick Tree"
    ],
    content: {
      explanation: 'Trees are hierarchical data structures with a root and children.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Tree operations',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use recursion for tree problems', 'DFS and BFS traversal'],
      solution: 'Master tree algorithms.'
    }
  },
  {
    id: 'bst',
    title: 'Binary Search Tree',
    category: 'Trees & Graphs',
    description: 'BST operations and properties',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Binary',
    color: 'bg-sky-500',
    folderPath: '15. Binary Search Tree',
    problemCount: 8,
    subcomponents: [
      "01. Basic BST Operations",
      "02. BST Properties and Traversal",
      "03. Range-Based Problems",
      "04. BST Construction and Modification",
      "05. Advanced BST Problems",
      "06. Tree Ancestor Problems"
    ],
    content: {
      explanation: 'BST is a binary tree where left < root < right for all nodes.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# BST operations',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Inorder traversal gives sorted order', 'Use BST property for search'],
      solution: 'Practice BST operations.'
    }
  },
  {
    id: 'tries',
    title: 'Tries',
    category: 'Trees & Graphs',
    description: 'Trie data structure for string operations',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Network',
    color: 'bg-amber-500',
    folderPath: '16. Tries',
    problemCount: 7,
    subcomponents: [
      "01. Basic Trie Operations",
      "02. String Prefix - Suffix Problem",
      "03. Pattern Matching with Tries",
      "04. Advanced Trie Applications",
      "05. Bit Manipulation"
    ],
    content: {
      explanation: 'Trie is a tree-like data structure for storing strings efficiently.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Trie implementation',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Each node represents a character', 'Useful for autocomplete'],
      solution: 'Master trie operations.'
    }
  },
  {
    id: 'graphs',
    title: 'Graphs',
    category: 'Trees & Graphs',
    description: 'Graph algorithms including DFS, BFS, and shortest path',
    difficulty: 'Hard',
    progress: 0,
    icon: 'GitBranch',
    color: 'bg-blue-600',
    folderPath: '17. Graphs',
    problemCount: 15,
    subcomponents: [
      "01. DFS",
      "02. BFS",
      "03. DFS Story Based",
      "04. BFS Story Based",
      "05. Topological Sort",
      "06. Disjoint Union Sets",
      "07. Sortest Path Algorithm",
      "08. Minimum Spanning Tree",
      "09. Strongly Connected Components",
      "10. Euler Path | Euler Circuit",
      "11. OTHERS",
      "12. Alphabet150",
      "13. Flood Field"
    ],
    content: {
      explanation: 'Graphs consist of vertices and edges, can be directed or undirected.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Graph algorithms',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use adjacency list representation', 'DFS for connectivity, BFS for shortest path'],
      solution: 'Master graph traversal algorithms.'
    }
  },
  {
    id: 'greedy',
    title: 'Greedy',
    category: 'Advanced Topics',
    description: 'Greedy algorithm approach for optimization',
    difficulty: 'Hard',
    progress: 0,
    icon: 'TrendingUp',
    color: 'bg-green-600',
    folderPath: '18. Greedy',
    problemCount: 11,
    subcomponents: [
      "01. Introduction to Greedy Algorithms",
      "02. Basic Optimization Problems",
      "03. Interval and Scheduling Problems",
      "03. Story Based",
      "04. String Manipulation",
      "05. Kadances Algorithm",
      "06. Advanced Greedy",
      "07. Greedy with DP Elements",
      "08. Complex Problem Solving with Greedy Approach"
    ],
    content: {
      explanation: 'Greedy algorithms make locally optimal choices at each step.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Greedy approach',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Make best choice at each step', 'Prove greedy choice property'],
      solution: 'Practice greedy algorithms.'
    }
  },
  {
    id: 'interval',
    title: 'Interval',
    category: 'Arrays & Strings',
    description: 'Interval merging and scheduling problems',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Calendar',
    color: 'bg-purple-600',
    folderPath: '19. Interval',
    problemCount: 6,
    subcomponents: [
      "01. Basic Interval Operations",
      "02. Interval Manipulation",
      "03. Interval Scheduling",
      "04. Advanced Interval Problems"
    ],
    content: {
      explanation: 'Interval problems involve merging, scheduling, and finding overlaps.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Interval problems',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Sort intervals first', 'Check for overlaps'],
      solution: 'Master interval manipulation.'
    }
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    category: 'Dynamic Programming',
    description: 'DP problems including memoization and tabulation',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Zap',
    color: 'bg-yellow-600',
    folderPath: '20. Dynamic Programming',
    problemCount: 13,
    subcomponents: [
      "04. Unbounded knapsack",
      "05. Longest Common Subsequence",
      "05. Longest Palindrum Subsequence",
      "06. Matrix Chain Multiplication",
      "08. DP on Trees",
      "09. DP on Stock",
      "1. 1D DP",
      "10. DP on Squares",
      "11. Game Strategy",
      "2. 2D-3D DP",
      "3. 0-1 knapsack"
    ],
    content: {
      explanation: 'DP solves problems by breaking them into overlapping subproblems.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Dynamic Programming',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Identify overlapping subproblems', 'Define state and transition'],
      solution: 'Master DP patterns and techniques.'
    }
  },
  {
    id: 'math-geometry',
    title: 'Math & Geometry',
    category: 'Advanced Topics',
    description: 'Mathematical and geometric problems',
    difficulty: 'Medium',
    progress: 0,
    icon: 'Calculator',
    color: 'bg-red-600',
    folderPath: '21. Math & Geometry',
    problemCount: 4,
    subcomponents: [
      "01. Basics",
      "02. Leecode and Alphabet 150"
    ],
    content: {
      explanation: 'Mathematical problems involving number theory, geometry, and algebra.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Math problems',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Look for mathematical patterns', 'Use formulas when applicable'],
      solution: 'Practice mathematical problem solving.'
    }
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    category: 'Advanced Topics',
    description: 'Bitwise operations and tricks',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Binary',
    color: 'bg-indigo-600',
    folderPath: '22. Bit Manipulation',
    problemCount: 5,
    subcomponents: [
      "01. Basics",
      "02. Leetcode and Alphabet 150",
      "03. Heap"
    ],
    content: {
      explanation: 'Bit manipulation uses bitwise operators for efficient solutions.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Bit manipulation',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Use AND, OR, XOR, NOT operators', 'Bit shifts for multiplication/division by 2'],
      solution: 'Master bitwise operations.'
    }
  },
  {
    id: 'sorting',
    title: 'Sorting',
    category: 'Sorting & Searching',
    description: 'Sorting algorithms and their applications',
    difficulty: 'Medium',
    progress: 0,
    icon: 'ArrowUpDown',
    color: 'bg-teal-600',
    folderPath: '23. Sorting',
    problemCount: 6,
    content: {
      explanation: 'Sorting algorithms arrange elements in a specific order.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Sorting algorithms',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['QuickSort and MergeSort are O(n log n)', 'Use built-in sort when possible'],
      solution: 'Understand sorting algorithm trade-offs.'
    }
  },
  {
    id: 'divide-conquer',
    title: 'Divide and Conquer',
    category: 'Advanced Topics',
    description: 'Divide and conquer algorithm paradigm',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Split',
    color: 'bg-orange-600',
    folderPath: '24. Divide and Conquer',
    problemCount: 2,
    subcomponents: [],
    content: {
      explanation: 'Divide and conquer breaks problems into smaller subproblems.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Divide and conquer',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Divide problem into subproblems', 'Combine solutions'],
      solution: 'Master divide and conquer technique.'
    }
  },
  {
    id: 'design-questions',
    title: 'Design Questions',
    category: 'Advanced Topics',
    description: 'System design and data structure design problems',
    difficulty: 'Hard',
    progress: 0,
    icon: 'Boxes',
    color: 'bg-pink-600',
    folderPath: '25. Design Questions',
    problemCount: 19,
    content: {
      explanation: 'Design problems require creating custom data structures and systems.',
      examples: [],
      codeTemplates: {
        javascript: '',
        python: '# Design implementation',
        java: '',
        cpp: ''
      },
      testCases: [],
      hints: ['Understand requirements first', 'Consider time and space complexity'],
      solution: 'Practice designing data structures.'
    }
  }
];
