"""
Binary Search Tree (BST) Floor Implementation

Problem Statement:
    Given a BST and a value X, find the floor of X in the BST.
    The floor of X is the largest value in the BST that is smaller than or equal to X.

Time Complexity: O(h), where h is the height of the tree.
    - In a balanced BST, h = log(n), where n is the number of nodes.
    - In the worst case (skewed tree), h = n.

Space Complexity: 
    - O(h) for the recursive approach due to the call stack.
    - O(1) for the iterative approach.

Explanation:
    The algorithm works by traversing the BST while keeping track of the potential floor value.
    - If the current node's value is equal to X, we've found the exact floor.
    - If X is less than the current node's value, we move to the left subtree.
    - If X is greater than the current node's value, we update our potential floor and move to the right subtree.

         8
       /   \
      4    12
     / \   / \
    2   6 10 14
"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def find_floor_recursive(root, x):
    def floor_helper(node, x, floor):
        if node is None:
            return floor
        
        if node.value == x:
            return node.value
        
        if node.value > x:
            return floor_helper(node.left, x, floor)
        
        return floor_helper(node.right, x, node.value)
    
    return floor_helper(root, x, None)

def find_floor_iterative(root, x):
    floor = None
    current = root
    
    while current:
        if current.value == x:
            return current.value
        
        if current.value > x:
            current = current.left
        else:
            floor = current.value
            current = current.right
    
    return floor

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
        floor = find_floor_recursive(root, value)
        print(f"Floor of {value}: {floor}")
    
    print("\nIterative approach:")
    for value in test_values:
        floor = find_floor_iterative(root, value)
        print(f"Floor of {value}: {floor}")