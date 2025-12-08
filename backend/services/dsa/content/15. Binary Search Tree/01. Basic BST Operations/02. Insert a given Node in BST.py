"""
Binary Search Tree (BST) Insertion Implementation

Problem Statement:
    Implement a function to insert a given element into a Binary Search Tree.

Time Complexity: O(h), where h is the height of the tree.
    - In a balanced BST, h = log(n), where n is the number of nodes.
    - In the worst case (skewed tree), h = n.

Space Complexity: 
    - O(h) for the recursive approach due to the call stack.
    - O(1) for the iterative approach.

Explanation:
    The insertion algorithm works by traversing the BST to find the appropriate
        position for the new element, maintaining the BST property:
            - For each node, all elements in its left subtree are smaller.
            - For each node, all elements in its right subtree are larger.
"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert_recursive(self, value):
        self.root = self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        # If the tree is empty, return a new node
        if node is None:
            return TreeNode(value)
        
        # Otherwise, recur down the tree
        if value < node.value:
            node.left = self._insert_recursive(node.left, value)
        elif value > node.value:
            node.right = self._insert_recursive(node.right, value)
        
        # Return the (unchanged) node pointer
        return node

    def insert_iterative(self, value):
        new_node = TreeNode(value)
        
        # If the tree is empty, just set the root
        if self.root is None:
            self.root = new_node
            return

        current = self.root
        while True:
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    return
                current = current.left
            elif value > current.value:
                if current.right is None:
                    current.right = new_node
                    return
                current = current.right
            else:
                # Value already exists in the tree
                return

    def inorder_traversal(self):
        result = []
        self._inorder_traversal(self.root, result)
        return result

    def _inorder_traversal(self, node, result):
        if node:
            self._inorder_traversal(node.left, result)
            result.append(node.value)
            self._inorder_traversal(node.right, result)

# Example usage
if __name__ == "__main__":
    """
1. Insert 5:      5

2. Insert 3:      5
                 /
                3

3. Insert 7:      5
                 / \
                3   7

4. Insert 1:      5
                 / \
                3   7
               /
              1

5. Insert 4:      5
                 / \
                3   7
               / \
              1   4

6. Insert 6:      5
                 / \
                3   7
               / \ /
              1  4 6

7. Insert 8:      5
                 / \
                3   7
               / \ / \
              1  4 6  8
    
    """
    bst = BinarySearchTree()

    # Insert elements using recursive method
    elements = [5, 3, 7, 1, 4, 6, 8]
    for element in elements:
        bst.insert_recursive(element)

    print("BST after recursive insertion:", bst.inorder_traversal())

    # Create a new BST for iterative insertion
    bst_iterative = BinarySearchTree()

    # Insert elements using iterative method
    for element in elements:
        bst_iterative.insert_iterative(element)

    print("BST after iterative insertion:", bst_iterative.inorder_traversal())

    # Insert a new element
    new_element = 2
    bst.insert_recursive(new_element)
    bst_iterative.insert_iterative(new_element)

    print("BST after inserting", new_element, "(recursive):", bst.inorder_traversal())
    print("BST after inserting", new_element, "(iterative):", bst_iterative.inorder_traversal())