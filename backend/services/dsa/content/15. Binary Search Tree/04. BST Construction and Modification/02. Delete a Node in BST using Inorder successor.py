"""
Binary Search Tree (BST) Deletion Implementation

Problem Statement:
    Implement a function to delete a given element from a Binary Search Tree.

Time Complexity: O(h), where h is the height of the tree.
    - In a balanced BST, h = log(n), where n is the number of nodes.
    - In the worst case (skewed tree), h = n.

Space Complexity: O(h) due to the recursive call stack.

Explanation:
    The deletion algorithm needs to handle three main cases:
        1. Node to be deleted is a leaf (has no children).
        2. Node to be deleted has only one child.
        3. Node to be deleted has two children.

For case 3, we find the inorder successor (smallest value in the right subtree)
to replace the node we're deleting.
"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def delete(self, value):
        """
        Public method to delete a value from the BST.
        It calls the recursive helper method _delete_recursive.
        """
        self.root = self._delete_recursive(self.root, value)

    def _delete_recursive(self, root, value):
        """
        Recursive helper method to delete a value from the BST.
        """
        # Base case: if the tree is empty
        if root is None:
            return root

        # Recursive calls for ancestors of node to be deleted
        if value < root.value:
            root.left = self._delete_recursive(root.left, value)
        elif value > root.value:
            root.right = self._delete_recursive(root.right, value)
        else:
            # Node with the value to be deleted is found

            # Case 1 and 2: Node with only one child or no child
            if root.left is None:
                return root.right
            elif root.right is None:
                return root.left

            # Case 3: Node with two children
            # Get the inorder successor (smallest in the right subtree)
            root.value = self._min_value(root.right)

            # Delete the inorder successor
            root.right = self._delete_recursive(root.right, root.value)

        return root

    def _min_value(self, node):
        """
        Helper method to find the minimum value in a subtree.
        Used to find the inorder successor for deletion.
        """
        current = node
        # Loop down to find the leftmost leaf
        while current.left is not None:
            current = current.left
        return current.value

    def insert(self, value):
        """
        Public method to insert a value into the BST.
        It calls the recursive helper method _insert_recursive.
        """
        self.root = self._insert_recursive(self.root, value)

    def _insert_recursive(self, root, value):
        """
        Recursive helper method to insert a value into the BST.
        """
        # If the tree is empty, return a new node
        if root is None:
            return TreeNode(value)
        
        # Otherwise, recur down the tree
        if value < root.value:
            root.left = self._insert_recursive(root.left, value)
        elif value > root.value:
            root.right = self._insert_recursive(root.right, value)
        
        # Return the (unchanged) node pointer
        return root

    def inorder_traversal(self):
        """
        Public method to perform an inorder traversal of the BST.
        It calls the recursive helper method _inorder_traversal.
        """
        result = []
        self._inorder_traversal(self.root, result)
        return result

    def _inorder_traversal(self, node, result):
        """
        Recursive helper method to perform an inorder traversal of the BST.
        """
        if node:
            self._inorder_traversal(node.left, result)
            result.append(node.value)
            self._inorder_traversal(node.right, result)

# Example usage
if __name__ == "__main__":
    bst = BinarySearchTree()
    elements = [5, 3, 7, 1, 4, 6, 8]
    for element in elements:
        bst.insert(element)

    print("Original BST:", bst.inorder_traversal())

    # Delete a leaf node
    bst.delete(1)
    print("After deleting 1:", bst.inorder_traversal())

    # Delete a node with one child
    bst.delete(7)
    print("After deleting 7:", bst.inorder_traversal())

    # Delete a node with two children
    bst.delete(3)
    print("After deleting 3:", bst.inorder_traversal())

    # Delete the root
    bst.delete(5)
    print("After deleting root (5):", bst.inorder_traversal())