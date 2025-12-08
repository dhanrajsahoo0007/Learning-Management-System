"""
Binary Search Tree (BST) Ceiling Implementation

Problem Statement:
    Given a BST and a value X, find the ceiling of X in the BST.
    The ceiling of X is the smallest value in the BST that is greater than or equal to X.

Time Complexity: O(h), where h is the height of the tree.
    - In a balanced BST, h = log(n), where n is the number of nodes.
    - In the worst case (skewed tree), h = n.

Space Complexity: 
    - O(h) for the recursive approach due to the call stack.
    - O(1) for the iterative approach.

Explanation:
    The algorithm works by traversing the BST while keeping track of the potential ceiling value.
        - If the current node's value is equal to X, we've found the exact ceiling.
        - If X is greater than the current node's value, we move to the right subtree.
        - If X is less than the current node's value, we update our potential ceiling and move to the left subtree.
"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def find_ceiling_recursive(root, x):
    def ceiling_helper(node, x, ceiling):
        if node is None:
            return ceiling
        
        if node.value == x:
            return node.value
        
        if node.value < x:
            return ceiling_helper(node.right, x, ceiling)
        
        return ceiling_helper(node.left, x, node.value)
    
    return ceiling_helper(root, x, None)

def find_ceiling_iterative(root, x):
    ceiling = None
    current = root
    
    while current:
        if current.value == x:
            return current.value
        
        if current.value < x:
            current = current.right
        else:
            ceiling = current.value
            current = current.left
    
    return ceiling

# Example usage
if __name__ == "__main__":
    # Create a sample BST
    root = TreeNode(8)
    root.left = TreeNode(4)
    root.right = TreeNode(12)
    root.left.left = TreeNode(2)
    root.left.right = TreeNode(6)
    root.right.left = TreeNode(10)
    root.right.right = TreeNode(14)

    # Test cases
    test_values = [5, 11, 1, 15, 7]
    
    print("Recursive approach:")
    for value in test_values:
        ceiling = find_ceiling_recursive(root, value)
        print(f"Ceiling of {value}: {ceiling}")
    
    print("\nIterative approach:")
    for value in test_values:
        ceiling = find_ceiling_iterative(root, value)
        print(f"Ceiling of {value}: {ceiling}")