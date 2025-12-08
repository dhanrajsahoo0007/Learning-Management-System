"""
Problem Statement:
    Implement a function to search for a value in a Binary Search Tree (BST).
    A BST is a binary tree where for each node, all values in its left subtree
    are less than the node's value, and all values in its right subtree are greater.

Time Complexity: O(h), where h is the height of the tree.
- In the worst case (skewed tree), h = n, where n is the number of nodes.
- In the best case (balanced tree), h = log(n).

Space Complexity: O(h) for the recursive approach due to the call stack.
- O(1) for the iterative approach.

"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def search_bst_recursive(root, value):
    # Base cases: root is None or value is found
    if root is None or root.value == value:
        return root
    
    # If value is less than root's value, search in the left subtree
    if value < root.value:
        return search_bst_recursive(root.left, value)
    
    # If value is greater than root's value, search in the right subtree
    return search_bst_recursive(root.right, value)

def search_bst_iterative(root, value):
    current = root
    while current:
        if current.value == value:
            return current
        elif value < current.value:
            current = current.left
        else:
            current = current.right
    return None

# Example usage
if __name__ == "__main__":
    # Create a sample BST
    root = TreeNode(4)
    root.left = TreeNode(2)
    root.right = TreeNode(7)
    root.left.left = TreeNode(1)
    root.left.right = TreeNode(3)

    # Test recursive search
    result = search_bst_recursive(root, 3)
    print("Recursive search result:", result.value if result else "Not found")

    # Test iterative search
    result = search_bst_iterative(root, 7)
    print("Iterative search result:", result.value if result else "Not found")