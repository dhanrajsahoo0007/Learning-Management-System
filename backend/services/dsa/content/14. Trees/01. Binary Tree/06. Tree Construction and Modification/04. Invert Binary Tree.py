"""
Invert Binary Tree
Problem Statement
    Given the root of a binary tree, invert the tree, and return its root.
Examples
    Example 1:
    Input: root = [4,2,7,1,3,6,9]
    Output: [4,7,2,9,6,3,1]
Example 2:
    Input: root = [2,1,3]
    Output: [2,3,1]
Example 3:
    Input: root = []
    Output: []
Detailed Explanation
    Inverting a binary tree means swapping every left and right child node at each level of the tree. This process starts from the root and continues recursively for all nodes in the tree.
    The steps to invert a binary tree are:

    If the current node is null, return (base case).
    Swap the left and right children of the current node.
    Recursively invert the left subtree.
    Recursively invert the right subtree.

Diagrams
Original Tree:
           4
         /   \
         2     7
        / \     / \
       1  3     6  9
Inverted Tree:
             4
           /    \
          7       2
         / \     / \
        9  6     3  1
Implementation
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        
        # Swap the children
        root.left, root.right = root.right, root.left
        
        # Recursively invert the left and right subtrees
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        return root

"""
Time Complexity: O(n), where n is the number of nodes in the binary tree.
    We visit each node exactly once.
    At each node, we perform a constant amount of work (swapping children).

Space Complexity: O(h), where h is the height of the tree.
    In the worst case (skewed tree), h can be equal to n, so O(n).
    In the best case (perfectly balanced tree), h would be log(n).
    This space is used by the call stack due to the recursive nature of the solution.

The space complexity can be improved to O(1) if we implement an iterative solution using a stack or queue instead of recursion.
"""