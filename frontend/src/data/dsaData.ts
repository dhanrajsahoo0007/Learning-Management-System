export interface DSATopic {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  icon: string;
  color: string;
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
  'Arrays & Strings',
  'Linked Lists',
  'Stacks & Queues',
  'Trees & Graphs',
  'Dynamic Programming',
  'Sorting & Searching',
  'Hash Tables',
  'Recursion & Backtracking'
];

export const dsaTopics: DSATopic[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'Arrays & Strings',
    description: 'Find two numbers in an array that add up to a target sum',
    difficulty: 'Easy',
    progress: 90,
    icon: 'Plus',
    color: 'bg-green-500',
    content: {
      explanation: 'Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices.',
      examples: [
        {
          input: 'nums = [2, 7, 11, 15], target = 9',
          output: '[0, 1]',
          explanation: 'Because nums[0] + nums[1] = 2 + 7 = 9'
        }
      ],
      codeTemplates: {
        javascript: `function twoSum(nums, target) {
    // Your solution here
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }

    return [];
}`,
        python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    num_map = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i

    return []`,
        java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }

    throw new IllegalArgumentException("No two sum solution");
}`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }

    return {};
}`
      },
      testCases: [
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
        { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
        { input: '[3, 3], 6', expectedOutput: '[0, 1]' }
      ],
      hints: [
        'Use a hash map to store numbers you\'ve seen',
        'For each number, check if target - current exists in map',
        'Return indices when you find a match'
      ],
      solution: 'Use a hash map to store each number and its index. For each number, calculate complement = target - num. If complement exists in map, return [map[complement], current_index].'
    }
  },
  {
    id: 'binary-tree-traversal',
    title: 'Binary Tree Traversal',
    category: 'Trees & Graphs',
    description: 'Implement inorder, preorder, and postorder traversal of binary trees',
    difficulty: 'Medium',
    progress: 65,
    icon: 'TreePine',
    color: 'bg-blue-500',
    content: {
      explanation: 'Binary tree traversal involves visiting each node in the tree exactly once. There are three main types: inorder, preorder, and postorder.',
      examples: [
        {
          input: 'Tree:   1\n        / \\\n       2   3\n      / \\\n     4   5',
          output: 'Inorder: [4, 2, 5, 1, 3]',
          explanation: 'Left subtree, root, right subtree'
        }
      ],
      codeTemplates: {
        javascript: `// Inorder traversal
function inorderTraversal(root) {
    const result = [];

    function traverse(node) {
        if (node === null) return;

        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }

    traverse(root);
    return result;
}`,
        python: `def inorder_traversal(root):
    result = []

    def traverse(node):
        if node is None:
            return

        traverse(node.left)
        result.append(node.val)
        traverse(node.right)

    traverse(root)
    return result`,
        java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();

    traverse(root, result);
    return result;
}

private void traverse(TreeNode node, List<Integer> result) {
    if (node == null) return;

    traverse(node.left, result);
    result.add(node.val);
    traverse(node.right, result);
}`,
        cpp: `vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;

    TreeNode* curr = root;

    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        }

        curr = st.top();
        st.pop();
        result.push_back(curr->val);
        curr = curr->right;
    }

    return result;
}`
      },
      testCases: [
        { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
        { input: '[1,2,3,4,5,null,6]', expectedOutput: '[4,2,5,1,3,6]' }
      ],
      hints: [
        'Inorder: Left, Root, Right',
        'Preorder: Root, Left, Right',
        'Postorder: Left, Right, Root',
        'Use recursion or iteration with a stack'
      ],
      solution: 'For inorder traversal: visit left subtree, visit root, visit right subtree. Use a stack to simulate recursion iteratively.'
    }
  },
  {
    id: 'fibonacci-dp',
    title: 'Fibonacci with DP',
    category: 'Dynamic Programming',
    description: 'Compute nth Fibonacci number using dynamic programming',
    difficulty: 'Easy',
    progress: 85,
    icon: 'TrendingUp',
    color: 'bg-purple-500',
    content: {
      explanation: 'The Fibonacci sequence is defined as F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1. Use DP to avoid redundant calculations.',
      examples: [
        {
          input: 'n = 5',
          output: '5',
          explanation: 'F(5) = F(4) + F(3) = (F(3) + F(2)) + (F(2) + F(1)) = ... = 5'
        }
      ],
      codeTemplates: {
        javascript: `function fib(n) {
    if (n <= 1) return n;

    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`,
        python: `def fib(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]`,
        java: `public int fib(int n) {
    if (n <= 1) return n;

    int[] dp = new int[n + 1];
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`,
        cpp: `int fib(int n) {
    if (n <= 1) return n;

    vector<int> dp(n + 1, 0);
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`
      },
      testCases: [
        { input: '2', expectedOutput: '1' },
        { input: '3', expectedOutput: '2' },
        { input: '4', expectedOutput: '3' }
      ],
      hints: [
        'Base cases: F(0) = 0, F(1) = 1',
        'Use an array to store computed values',
        'Each F(n) = F(n-1) + F(n-2)'
      ],
      solution: 'Use bottom-up DP approach. Create array dp where dp[i] represents F(i). Fill array iteratively from 2 to n.'
    }
  }
];
