"""
Problem Statement:
    Implement a function to delete a node with a given key from a Binary Search Tree (BST).

Explanation:
    This implementation uses a two-step approach to delete a node from a BST:

1. Finding the node:
   - The deleteNode method iteratively traverses the tree to find the node to be deleted.
   - It keeps track of the parent node to adjust its left or right pointer after deletion.

2. Deleting the node:
   - The actual deletion is handled by the helper method.
   - There are three cases to consider:
     a) Node has no left child: Replace the node with its right child.
     b) Node has no right child: Replace the node with its left child.
     c) Node has both children:
        - Find the rightmost node in the left subtree (lastRight).
        - Attach the right subtree to this lastRight node.
        - Replace the node to be deleted with its left child.

This approach differs from the traditional BST deletion method:
    - Instead of finding the in-order successor (leftmost node in the right subtree),
        it finds the rightmost node in the left subtree.
    - This method potentially reduces the number of pointer adjustments in some cases.

The findLastRight method recursively finds the rightmost node in a given subtree.

This implementation maintains the BST property by ensuring that all nodes in the
left subtree remain less than the nodes in the right subtree after deletion.

Time Complexity: O(h), where h is the height of the tree.
    - In a balanced BST, h = log(n), where n is the number of nodes.
    - In the worst case (skewed tree), h = n.

Space Complexity: 
    - O(1) for the iterative part in deleteNode.
    - O(h) for the recursive findLastRight method due to the call stack.

Note: While this method works correctly, it may lead to an unbalanced tree over multiple deletions. 
In practice, self-balancing BSTs like AVL or Red-Black trees are often preferred for maintaining balance after insertions and deletions.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def deleteNode(self, root: TreeNode, key: int) -> TreeNode:
        # If the tree is empty, nothing to delete
        if root is None:
            return None
        
        # If the root is the node to be deleted, use the helper method
        if root.val == key:
            return self.helper(root)
        
        # Use a dummy node to handle potential root deletion
        dummy = root
        while root:
            if root.val > key:
                # The node to delete is in the left subtree
                if root.left and root.left.val == key:
                    # Found the parent of the node to delete
                    root.left = self.helper(root.left)
                    break
                else:
                    # Continue searching in the left subtree
                    root = root.left
            else:
                # The node to delete is in the right subtree
                if root.right and root.right.val == key:
                    # Found the parent of the node to delete
                    root.right = self.helper(root.right)
                    break
                else:
                    # Continue searching in the right subtree
                    root = root.right
        
        # Return the original root (or the new root if the original was deleted)
        return dummy

    def helper(self, root: TreeNode) -> TreeNode:
        # Case 1: Node has no left child
        if root.left is None:
            return root.right
        # Case 2: Node has no right child
        elif root.right is None:
            return root.left
        
        # Case 3: Node has both left and right children
        rightChild = root.right
        # Find the rightmost node in the left subtree
        lastRight = self.findLastRight(root.left)
        # Attach the right subtree to the rightmost node of the left subtree
        lastRight.right = rightChild
        # Return the left child, which is now the root of this subtree
        return root.left

    def findLastRight(self, root: TreeNode) -> TreeNode:
        # Base case: this node has no right child, so it's the rightmost
        if root.right is None:
            return root
        # Recursive case: continue to the right child
        return self.findLastRight(root.right)
