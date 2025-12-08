"""
Problem Statement:
Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.
"""

from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# BFS Solution 1: Using a separate depth variable
def minDepth_bfs1(root: TreeNode) -> int:
    if not root:
            return 0
        
    queue = deque([root])
    level = 1
    
    while queue:
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if not node.left and not node.right:
                return level
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        level += 1
    
    return level

"""
Explanation of minDepth_bfs1:
This BFS approach uses a queue to traverse the tree level by level.
    1. We start with the root node and depth 1.
    2. For each level:
    - We process all nodes at the current level.
    - If we find a leaf node, we return the current depth.
    - Otherwise, we add the node's children to the queue.
    3. After processing all nodes at a level, we increment the depth.
    4. We continue this process until we find a leaf node or exhaust all nodes.

Time Complexity: O(N), where N is the number of nodes in the tree.
Space Complexity: O(W), where W is the maximum width of the tree.

Key characteristics:
    1. Uses a separate 'depth' variable to keep track of the current level.
    2. Processes nodes level by level using a nested loop.
    3. Increments depth after processing all nodes at the current level.
"""

# BFS Solution 2: Storing depth with each node in the queue
def minDepth_bfs2(root: TreeNode) -> int:
    if not root:
        return 0
    
    queue = deque([(root, 1)])  # (node, depth)
    
    while queue:
        node, depth = queue.popleft()
        
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0  # This line should never be reached for a valid binary tree

"""
Explanation of minDepth_bfs2:
    This BFS approach also uses a queue but stores the depth with each node.
        1. We start by adding the root node and its depth (1) to the queue.
        2. For each node:
            - If it's a leaf node, we return its depth immediately.
            - Otherwise, we add its children to the queue with an incremented depth.
        3. We continue this process until we find a leaf node or exhaust all nodes.

Time Complexity: O(N), where N is the number of nodes in the tree.
Space Complexity: O(W), where W is the maximum width of the tree.

Key characteristics:
    1. Stores the depth along with each node in the queue.
    2. No need for a nested loop as depth is tracked for each node individually.
    3. Can return immediately upon finding the first leaf node.
"""

# DFS Iterative Solution
def minDepth_dfs_iterative(root: TreeNode) -> int:
    if not root:
        return 0
    
    stack = [(root, 1)]
    min_depth = float('inf')
    
    while stack:
        node, depth = stack.pop()
        
        if not node.left and not node.right:
            min_depth = min(min_depth, depth)
        
        if node.right:
            stack.append((node.right, depth + 1))
        if node.left:
            stack.append((node.left, depth + 1))
    
    return min_depth

"""
Explanation of minDepth_dfs_iterative:
    1. We start with the root node and depth 1 on the stack.
    2. For each node:
    - If it's a leaf, we update the minimum depth if necessary.
    - Otherwise, we push its children onto the stack with an incremented depth.
    3. We continue this process until we've explored all nodes.
    4. We return the minimum depth found.

Time Complexity: O(N), where N is the number of nodes in the tree.
Space Complexity: O(H), where H is the height of the tree.

Key characteristics:
    1. Uses a stack to simulate the recursive call stack.
    2. Explores one branch fully before backtracking.
    3. Keeps track of the minimum depth found so far.
"""

# DFS Recursive Solution
# def minDepth_dfs_recursive(root: TreeNode) -> int:
#     if not root:
#         return 0
    
#     if not root.left:
#         return 1 + minDepth_dfs_recursive(root.left)
#     if not root.right:
#         return 1 + minDepth_dfs_recursive(root.right)
    
#     return 1 + min(minDepth_dfs_recursive(root.left), minDepth_dfs_recursive(root.right))

def minDepth_dfs_recursive(root: TreeNode) -> int:
    if not root:
        return 0
    
    if not root.left and not root.right:
        return 1
    
    left_depth = float('inf')
    if root.left:
        left_depth = minDepth_dfs_recursive(root.left)
    
    right_depth = float('inf')
    if root.right:
        right_depth = minDepth_dfs_recursive(root.right)
    
    # left_depth = float('inf') if not root.left else minDepth_dfs(root.left)
    # right_depth = float('inf') if not root.right else minDepth_dfs(root.right)

    
    return min(left_depth, right_depth) + 1


"""
Explanation of minDepth_dfs_recursive:
        1. If the root is null, we return 0.
        2. If the root is a leaf node, we return 1.
        3. If the root has only one child, we recursively calculate the depth of that child.
        4. If the root has both children, we recursively calculate the minimum depth of both subtrees.
        5. We return the minimum depth of the subtrees plus 1 (for the current node).

Time Complexity: O(N), where N is the number of nodes in the tree.
Space Complexity: O(H), where H is the height of the tree (due to the recursive call stack).

Key characteristics:
1. Simplest implementation.
2. Uses the call stack to keep track of the recursion.
3. Efficiently handles cases where a node has only one child.
"""

# Helper function to create a binary tree from a list
def createTree(elements):
    if not elements:
        return None
    root = TreeNode(elements[0])
    queue = deque([root])
    i = 1
    while queue and i < len(elements):
        node = queue.popleft()
        if i < len(elements) and elements[i] is not None:
            node.left = TreeNode(elements[i])
            queue.append(node.left)
        i += 1
        if i < len(elements) and elements[i] is not None:
            node.right = TreeNode(elements[i])
            queue.append(node.right)
        i += 1
    return root

# Test cases
test_cases = [
    [3,9,20,None,None,15,7],
    [2,None,3,None,4,None,5,None,6],
    [1,2],
    []
]

# Execution and output
for i, case in enumerate(test_cases):
    root = createTree(case)
    print(f"\nTest case {i+1}: {case}")
    print(f"Minimum depth (BFS1): {minDepth_bfs1(root)}")
    print(f"Minimum depth (BFS2): {minDepth_bfs2(root)}")
    print(f"Minimum depth (DFS Iterative): {minDepth_dfs_iterative(root)}")
    print(f"Minimum depth (DFS Recursive): {minDepth_dfs_recursive(root)}")

"""
Comparison of Approaches:

1. BFS Approaches (both bfs1 and bfs2):
   - Guaranteed to find the minimum depth first.
   - Better for wide, shallow trees.
   - May use more memory for very wide trees.

2. DFS Iterative:
   - May explore unnecessary paths before finding the minimum depth.
   - Better for deep, narrow trees.
   - Uses less memory than BFS for wide trees.

3. DFS Recursive:
   - Simplest implementation.
   - May cause stack overflow for very deep trees.
   - Similar performance characteristics to DFS Iterative.

Choice of Method:
- For general cases, BFS is often preferred as it's guaranteed to find the minimum depth first.
- For memory-constrained environments and deep trees, DFS might be more suitable.
- The recursive DFS is the most concise but should be used cautiously for very deep trees.
"""