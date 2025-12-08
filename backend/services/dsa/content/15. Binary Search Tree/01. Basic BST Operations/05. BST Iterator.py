"""
Problem Statement:
    Implement an iterator over a binary search tree (BST). Your iterator will be initialized with the root node of a BST.
        - next() returns the next smallest number in the BST.
        - hasNext() returns whether we have a next smallest number.

Time Complexity:
    - Constructor: O(h), where h is the height of the tree
    - next(): Amortized O(1)
    - hasNext(): O(1)

Space Complexity:
    - O(h), where h is the height of the tree

Explanation:
    1. The iterator maintains a stack of nodes. When initialized, it pushes all leftmost nodes onto the stack.
    2. The next() method pops the top node (which is the next smallest), processes its right subtree, and returns its value.
    3. The hasNext() method simply checks if the stack is empty.

Example:
Input:
    7
   / \
  3  15
    /  \
   9   20

BSTIterator iterator = new BSTIterator(root);
iterator.next();    // return 3
iterator.next();    // return 7
iterator.hasNext(); // return true
iterator.next();    // return 9
iterator.hasNext(); // return true
iterator.next();    // return 15
iterator.next();    // return 20
iterator.hasNext(); // return false
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTIterator:
    def __init__(self, root: TreeNode):
        # Initialize the stack to store nodes
        self.stack = []
        # Populate the stack with the leftmost path
        self._leftmost_inorder(root)

    def _leftmost_inorder(self, root):
        # Helper method to push all leftmost nodes onto the stack
        while root:
            self.stack.append(root)
            root = root.left

    def next(self) -> int:
        # Pop the next smallest element from the stack
        topmost_node = self.stack.pop()
        
        # If this node has a right child, add the leftmost path of the right subtree
        if topmost_node.right:
            self._leftmost_inorder(topmost_node.right)
        
        # Return the value of the popped node
        return topmost_node.val

    def hasNext(self) -> bool:
        # Check if there are more elements in the stack
        return len(self.stack) > 0

# Example usage
def create_sample_bst():
    root = TreeNode(7)
    root.left = TreeNode(3)
    root.right = TreeNode(15)
    root.right.left = TreeNode(9)
    root.right.right = TreeNode(20)
    return root

# Test the iterator
bst_root = create_sample_bst()
iterator = BSTIterator(bst_root)
print(iterator.next())    # Expected: 3
print(iterator.next())    # Expected: 7
print(iterator.hasNext()) # Expected: True
print(iterator.next())    # Expected: 9
print(iterator.hasNext()) # Expected: True
print(iterator.next())    # Expected: 15
print(iterator.next())    # Expected: 20
print(iterator.hasNext()) # Expected: False