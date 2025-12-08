"""
Problem Statement:
    Given a binary tree and two nodes in it, find the lowest common ancestor (LCA) of the two given nodes.
    The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants 
    (where we allow a node to be a descendant of itself).

Constraints:
    1. All Node.val are unique.
    2. p and q are different and both values will exist in the binary tree.

Example 1:
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4

Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.

Example 2:
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4

Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.


Time Complexity: O(n), where n is the number of nodes in the tree.
In the worst case, we might need to visit all nodes to find the LCA.

Space Complexity: O(h), where h is the height of the tree.
This is due to the recursion stack. In the worst case of a skewed tree, this could be O(n).

Explanation of the approach:

1. We use a recursive depth-first search (DFS) to traverse the tree.
2. At each node, we check if it's one of the target nodes (p or q). If so, we return this node.
3. We recursively search in the left and right subtrees.
4. If we find both nodes in different subtrees (i.e., both left and right recursive calls return non-null), 
   the current node is the LCA, so we return it.
5. If we find one node, we return that node
"""

from typing import List, Optional

# Definition for a binary tree node
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Base case: if root is None or root is one of p or q, return root
        if not root or root == p or root == q:
            return root
        
        # Recursively search in left and right subtrees
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        
        # If both left and right are non-null, root is the LCA
        if left and right:
            return root
        
        # If one of left or right is non-null, return that
        return left if left else right

# Helper function to create a binary tree from a list representation
def create_tree(values: List[Optional[int]]) -> Optional[TreeNode]:
    if not values:
        return None
    
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    
    while queue and i < len(values):
        node = queue.pop(0)
        
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    
    return root

# Helper function to find a node with a given value in the tree
def find_node(root: TreeNode, value: int) -> Optional[TreeNode]:
    if not root:
        return None
    if root.val == value:
        return root
    left = find_node(root.left, value)
    if left:
        return left
    return find_node(root.right, value)

# Test the solution
if __name__ == "__main__":
    # Test case 1
    root1 = create_tree([3,5,1,6,2,0,8,None,None,7,4])
    solution = Solution()
    p = find_node(root1, 5)
    q = find_node(root1, 1)
    lca = solution.lowestCommonAncestor(root1, p, q)
    print("Test case 1:")
    print("Tree: [3,5,1,6,2,0,8,None,None,7,4]")
    print(f"LCA of 5 and 1: {lca.val}")

    # Test case 2
    p = find_node(root1, 5)
    q = find_node(root1, 4)
    lca = solution.lowestCommonAncestor(root1, p, q)
    print("\nTest case 2:")
    print("Tree: [3,5,1,6,2,0,8,None,None,7,4]")
    print(f"LCA of 5 and 4: {lca.val}")
