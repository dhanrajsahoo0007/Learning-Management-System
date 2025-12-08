"""
Problem Statement:
    Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
    - The left subtree of a node contains only nodes with keys less than the node's key.
    - The right subtree of a node contains only nodes with keys greater than the node's key.
    - Both the left and right subtrees must also be binary search trees.

Time Complexity: O(n), where n is the number of nodes in the tree.
    We visit each node exactly once.

Space Complexity: O(h), where h is the height of the tree.
    In the worst case (skewed tree), h can be n, but for a balanced tree, h would be log(n).
    The space is used by the recursion stack.

Explanation:
    We use a recursive approach with a helper function that keeps track of the valid range
    for each node. As we traverse down the tree, we update these ranges. For the left child,
    the upper bound becomes the parent's value. For the right child, the lower bound becomes
    the parent's value.

Examples:
1. Valid BST:

    2
   / \
  1   3
Output: True

2. Invalid BST:
    5
   / \
  1   4
     / \
    3   6
Output: False (4 is not greater than 5)

3. Edge case - single node:
    1
Output: True

4. Edge case - empty tree:
    None
Output: True
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        def validate(node, low=float('-inf'), high=float('inf')):
            # Base case: empty trees are valid BSTs
            if not node:
                return True
            
            # Check if the current node's value is within the allowed range
            if node.val <= low or node.val >= high:
                return False
            
            # Recursively validate left and right subtrees
            # For left subtree, update the high bound to the current node's value
            # For right subtree, update the low bound to the current node's value
            return (validate(node.left, low, node.val) and
                    validate(node.right, node.val, high))
        
        # Start the validation from the root
        return validate(root)

# Example usage:
root = TreeNode(2)
root.left = TreeNode(1)
root.right = TreeNode(3)
solution = Solution()
print(solution.isValidBST(root))  # Output: True