"""
Problem Statement:
Given a binary tree root, return the maximum sum of all keys of any sub-tree which is also a Binary Search Tree (BST).

Time Complexity: O(n), where n is the number of nodes in the tree.
Space Complexity: O(h), where h is the height of the tree (due to the recursive call stack).

Detailed Explanation:
We use a bottom-up approach to solve this problem efficiently:
    1. We perform a depth-first search (DFS) on the tree, starting from the leaf nodes and moving up to the root.
    2. For each node, we determine if its subtree is a valid BST and calculate its sum.
    3. We propagate information upwards: for each subtree, we return the minimum value, maximum value, and sum.
    4. At each node, we check if it forms a valid BST with its left and right subtrees.
    5. If a subtree is a valid BST, we update the global maximum sum if necessary.
    6. This approach allows us to check BST validity and calculate sums in a single pass through the tree.

Key Idea: By returning min and max values from subtrees, we can efficiently check BST validity at each node.


Examples:
1. Input: root = [1,4,3,2,4,2,5,null,null,null,null,null,null,4,6]
   Output: 20
   Explanation: Maximum sum in a valid BST is obtained in root node with key equal to 3.
   Tree structure:
         1
       /   \
      4     3
     / \   / \
    2   4 2   5
           \   \
            4   6

2. Input: root = [4,3,null,1,2]
   Output: 2
   Explanation: Maximum sum in a valid BST is obtained in a single root node with key equal to 2.
   Tree structure:
      4
     /
    3
   / \
  1   2

3. Input: root = [-4,-2,-5]
   Output: 0
   Explanation: All values are negative. Return an empty BST.
   Tree structure:
     -4
    /  \
  -2   -5
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxSumBST(self, root: TreeNode) -> int:
        # Initialize the maximum sum of any valid BST found
        self.max_sum = 0
        
        def dfs(node):
            if not node:
                # Base case: empty subtree is a valid BST
                # Return (min_value, max_value, sum)
                # Using inf and -inf allows for easy comparisons with actual node values
                return float('inf'), float('-inf'), 0
            
            # Recursively process left and right subtrees
            left_min, left_max, left_sum = dfs(node.left)
            right_min, right_max, right_sum = dfs(node.right)
            
            # Check if current subtree is a valid BST
            # It's valid if the current node's value is greater than the max of left subtree
            # and less than the min of right subtree
            if left_max < node.val < right_min:
                # Current subtree is a valid BST
                # Calculate the sum of the current BST
                current_sum = left_sum + right_sum + node.val
                # Update the maximum sum if the current sum is greater
                self.max_sum = max(self.max_sum, current_sum)
                # Return the min and max values of the current BST, and its sum
                # min value is either the current node's value or the min from left subtree
                # max value is either the current node's value or the max from right subtree
                return min(left_min, node.val), max(right_max, node.val), current_sum
            
            # If not a valid BST, return values that will invalidate parent BSTs
            # -inf as min and inf as max ensure that parent nodes will not form valid BSTs
            return float('-inf'), float('inf'), 0
        
        # Start the DFS from the root
        dfs(root)
        # Return the maximum sum found
        return self.max_sum
    

# Example usage:

# Example 1
root1 = TreeNode(1)
root1.left = TreeNode(4)
root1.right = TreeNode(3)
root1.left.left = TreeNode(2)
root1.left.right = TreeNode(4)
root1.right.left = TreeNode(2)
root1.right.right = TreeNode(5)
root1.right.left.right = TreeNode(4)
root1.right.right.right = TreeNode(6)

solution = Solution()
print("Example 1 Output:", solution.maxSumBST(root1))  # Expected output: 20

# Example 2
root2 = TreeNode(4)
root2.left = TreeNode(3)
root2.left.left = TreeNode(1)
root2.left.right = TreeNode(2)

print("Example 2 Output:", solution.maxSumBST(root2))  # Expected output: 2

# Example 3
root3 = TreeNode(-4)
root3.left = TreeNode(-2)
root3.right = TreeNode(-5)

print("Example 3 Output:", solution.maxSumBST(root3))  # Expected output: 0