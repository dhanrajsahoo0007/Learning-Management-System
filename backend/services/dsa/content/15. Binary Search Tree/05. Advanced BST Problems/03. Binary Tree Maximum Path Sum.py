"""
Problem: Binary Tree Maximum Path Sum

    Given the root of a binary tree, return the maximum path sum of any non-empty path.
    A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.
    A node can only appear in the sequence at most once. The path does not need to pass through the root.

Time Complexity: O(n), where n is the number of nodes in the tree.
Space Complexity: O(h), where h is the height of the tree (due to the recursive call stack).

Approach:
    1. We use a recursive depth-first search (DFS) to traverse the tree.
    2. For each node, we calculate:
        a) The maximum path sum that goes through the node and one of its subtrees.
        b) The maximum path sum that goes through the node and both of its subtrees.
    3. We update our global maximum path sum at each node.
    4. We return the maximum path sum that goes through the node and one of its subtrees,
       which allows the parent nodes to potentially use this path.

Examples:

1. Input: root = [1,2,3]
   Output: 6
   Tree structure:
     1
    / \
   2   3

2. Input: root = [-10,9,20,null,null,15,7]
   Output: 42
   Tree structure:
     -10
     / \
    9  20
      /  \
     15   7
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum(self, root: TreeNode) -> int:
        # Initialize the maximum path sum with the smallest possible integer
        self.max_sum = float('-inf')
        
        def dfs(node):
            if not node:
                return 0
            
            # Recursively calculate the maximum path sum for left and right subtrees
            left_max_sum = dfs(node.left)
            right_max_sum = dfs(node.right)
            
            # Calculate path sum through current node and both children
            path_sum_through_node = left_max_sum + right_max_sum + node.val
            
            # Calculate path sum through current node and better child
            path_sum_with_one_child = max(left_max_sum, right_max_sum) + node.val
            
            # Consider the path with only the current node
            path_sum_only_node = node.val
            
            # Update the global maximum sum
            self.max_sum = max(self.max_sum, path_sum_through_node, path_sum_with_one_child, path_sum_only_node)
            
            # Return the maximum sum of a path that can be extended to the parent (Basically can go up in the binary tree)
            # This is either the path with one child or just the current node
            # path_sum_through_node is not considered (because the path is completed already )
            return max(path_sum_with_one_child, path_sum_only_node)
        
        # Start the depth-first search from the root
        dfs(root)
        
        # Return the maximum path sum found
        return self.max_sum
# Example usage:

# Example 1
root1 = TreeNode(1)
root1.left = TreeNode(2)
root1.right = TreeNode(3)

solution = Solution()
print("Example 1 Output:", solution.maxPathSum(root1))  # Expected output: 6

# Example 2
root2 = TreeNode(-10)
root2.left = TreeNode(9)
root2.right = TreeNode(20)
root2.right.left = TreeNode(15)
root2.right.right = TreeNode(7)

print("Example 2 Output:", solution.maxPathSum(root2))  # Expected output: 42