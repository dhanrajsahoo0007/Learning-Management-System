"""
Problem Statement:
    Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.
    The lowest common ancestor is defined between two nodes p and q as the lowest node in T
    that has both p and q as descendants (where we allow a node to be a descendant of itself).

Time Complexity: O(h), where h is the height of the tree.
    In the worst case (skewed tree), h can be n, but for a balanced BST, h would be log(n).

Space Complexity: O(1) for the iterative solution, O(h) for the recursive solution due to the call stack.

Explanation:
We can leverage the properties of a BST to solve this problem efficiently:
    1. If both nodes are smaller than the current node, the LCA must be in the left subtree.
    2. If both nodes are larger than the current node, the LCA must be in the right subtree.
    3. If one node is smaller and the other is larger (or equal), the current node is the LCA.

Examples:
1. Regular case:
        6
       / \
      2   8
     / \  /\
    0  4 7  9
   /\
  3  5
LCA(2, 8) = 6
LCA(2, 4) = 2

2. One node is the ancestor of the other:
        6
       / \
      2   8
     / \
    0   4
LCA(2, 4) = 2

3. Edge case - nodes are the same:
    2
LCA(2, 2) = 2
"""

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Ensure p.val <= q.val for simplicity
        if p.val > q.val:
            p, q = q, p
        
        # Iterative solution
        current = root
        while current:
            if p.val <= current.val <= q.val:
                # Current node is between p and q, so it's the LCA
                return current
            elif q.val < current.val:
                # Both nodes are in the left subtree
                current = current.left
            else:
                # Both nodes are in the right subtree
                current = current.right
        
        # This line should never be reached for valid inputs
        return None

    # Recursive solution (alternative)
    def lowestCommonAncestorRecursive(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        
        curr = root.val
        
        # If both of them is in right then go to the right
        if curr < p.val and curr < q.val:
            return self.lowestCommonAncestor(root.right, p, q)
        
        # If both of them is in left then go to the right
        if curr > p.val and curr > q.val:
            return self.lowestCommonAncestor(root.left, p, q)
        
        ## If both of them are not in the same side then that is the iter section point 
        ## that is the LCA 
        return root

# Example usage:
root = TreeNode(6)
root.left = TreeNode(2)
root.right = TreeNode(8)
root.left.left = TreeNode(0)
root.left.right = TreeNode(4)
root.right.left = TreeNode(7)
root.right.right = TreeNode(9)

solution = Solution()
lca = solution.lowestCommonAncestorRecursive(root, root.left, root.right)
print(lca.val)  # Output: 6