"""
Problem Statement:
Given a Binary Search Tree (BST) and a node in it, find the inorder successor and preorder successor of that node in the BST.

1. Inorder Successor: The node that comes immediately after the given node in an inorder traversal.
2. Preorder Successor: The node that comes immediately after the given node in a preorder traversal.

Inorder traversal: Left, Root, Right
Preorder traversal: Root, Left, Right
Postorder traversal: Left, Right, Root

Time Complexity: 
- Inorder Successor: O(h), where h is the height of the tree.
- Preorder Successor: O(h), where h is the height of the tree.

Space Complexity: 
- Inorder Successor: O(1), as we're using an iterative solution.
- Preorder Successor: O(1), as we're using an iterative solution.

Explanation:
- Inorder Successor:
  - If the node has a right subtree, the successor is the leftmost node in the right subtree.
  - If it doesn't have a right subtree, we go up the tree until we find a node that is a left child of its parent.

- Preorder Successor:
  - If the node has a left child, that's the preorder successor.
  - If it doesn't have a left child but has a right child, that's the preorder successor.
  - If it has neither, we go up the tree until we find a parent that has a right child we haven't visited yet.

Examples:
    4
   / \
  2   6
 / \ / \
1  3 5  7

For node 2:
- Inorder Successor: 3
- Preorder Successor: 1

For node 4:
- Inorder Successor: 5
- Preorder Successor: 2

For node 7:
- Inorder Successor: None
- Preorder Successor: None
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None, parent=None):
        self.val = val
        self.left = left
        self.right = right
        self.parent = parent

class Solution:
    def inorderSuccessor(self, root: 'TreeNode', target: 'TreeNode') -> 'TreeNode':
        successor = None
        
        while root:
            if target.val >= root.val:
                # If p's value is greater than or equal to root's value,
                # the successor must be in the right subtree
                root = root.right
            else:
                # If p's value is less than root's value,
                # this root could be the successor, so we store it
                # and continue searching in the left subtree for a closer successor
                successor = root
                root = root.left
        
        return successor

    def preorderSuccessor(self, node: 'TreeNode') -> 'TreeNode':
        # If the node has a left child, that's the preorder successor
        if node.left:
            return node.left
        
        # If the node has a right child, that's the preorder successor
        if node.right:
            return node.right
        
        # If the node has no children, we need to go up the tree
        while node.parent:
            if node == node.parent.left and node.parent.right:
                # If node is a left child and its parent has a right child,
                # the right child is the successor
                return node.parent.right
            node = node.parent
        
        # If we've reached the root without finding a successor, return None
        return None

# Example usage:
def create_bst():
    root = TreeNode(4)
    root.left = TreeNode(2)
    root.right = TreeNode(6)
    root.left.parent = root
    root.right.parent = root
    root.left.left = TreeNode(1)
    root.left.right = TreeNode(3)
    root.left.left.parent = root.left
    root.left.right.parent = root.left
    root.right.left = TreeNode(5)
    root.right.right = TreeNode(7)
    root.right.left.parent = root.right
    root.right.right.parent = root.right
    return root

root = create_bst()
solution = Solution()

# Test for node 2
node = root.left
inorder_succ = solution.inorderSuccessor(root, node)
preorder_succ = solution.preorderSuccessor(node)
print(f"For node {node.val}:")
print(f"Inorder Successor: {inorder_succ.val if inorder_succ else None}")
print(f"Preorder Successor: {preorder_succ.val if preorder_succ else None}")

# Test for node 4 (root)
inorder_succ = solution.inorderSuccessor(root, root)
preorder_succ = solution.preorderSuccessor(root)
print(f"\nFor node {root.val}:")
print(f"Inorder Successor: {inorder_succ.val if inorder_succ else None}")
print(f"Preorder Successor: {preorder_succ.val if preorder_succ else None}")