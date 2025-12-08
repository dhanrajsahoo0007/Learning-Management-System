"""
Binary Search Tree (BST) Implementation

This implementation includes the following operations:
    1. Insert a value
    2. Search for a value
    3. Find the minimum value
    4. Find the maximum value

Time Complexity:
    - Insert: O(h) where h is the height of the tree
    - Search: O(h)
    - Find Min/Max: O(h)

Space Complexity:
    - For all operations: O(h) in the worst case due to recursion
    - O(1) for iterative versions of find min/max

In a balanced BST, h = log(n) where n is the number of nodes.
In the worst case (skewed tree), h = n.
"""

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
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
        
        # Return the unchanged node pointer
        return node
    
    def search(self, value):
        return self._search_recursive(self.root, value)
    
    def _search_recursive(self, node, value):
        # Base cases: root is None or value is present at root
        if node is None or node.value == value:
            return node
        
        # Value is greater than root's value
        if value > node.value:
            return self._search_recursive(node.right, value)
        
        # Value is smaller than root's value
        return self._search_recursive(node.left, value)
    
    def find_min(self):
        if self.root is None:
            return None
        return self._find_min_recursive(self.root).value
    
    def _find_min_recursive(self, node):
        current = node
        # Loop down to find the leftmost leaf
        while current.left is not None:
            current = current.left
        return current
    
    def find_max(self):
        if self.root is None:
            return None
        return self._find_max_recursive(self.root).value
    
    def _find_max_recursive(self, node):
        current = node
        # Loop down to find the rightmost leaf
        while current.right is not None:
            current = current.right
        return current

# Example usage
if __name__ == "__main__":
    bst = BinarySearchTree()
    
    # Insert values
    values = [5, 3, 7, 1, 4, 6, 8]
    for value in values:
        bst.insert(value)
    
    # Search for a value
    print("Search for 4:", bst.search(4).value if bst.search(4) else "Not found")
    print("Search for 9:", bst.search(9).value if bst.search(9) else "Not found")
    
    # Find min and max
    print("Minimum value:", bst.find_min())
    print("Maximum value:", bst.find_max())