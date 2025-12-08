"""
Problem Statement:
    Given the root of a Binary Search Tree and a target number k, return true if there exist
    two elements in the BST such that their sum is equal to the given target.

Time Complexity: O(n), where n is the number of nodes in the BST
Space Complexity: O(h), where h is the height of the tree (for the stack in the iterator)

Approach:
    We use a bidirectional BST iterator to traverse the tree from both ends simultaneously.
    This allows us to perform a two-pointer technique similar to the one used in a sorted array.

Example:
Input: root = [5,3,6,2,4,null,7], k = 9
Output: true
Explanation: 
         5
        / \
       3   6
      / \   \
     2   4   7
There exist two elements 3 and 6 such that 3 + 6 = 9
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTIterator:
    def __init__(self, root: TreeNode, reverse: bool):
        # Initialize the stack to store nodes
        self.stack = []
        # Flag to determine direction of traversal
        self.reverse = reverse
        # Start by pushing all nodes along one path
        self._push_all(root)
    
    def _push_all(self, node):
        # Push all nodes along leftmost branch (or rightmost if reverse)
        while node:
            self.stack.append(node)
            if self.reverse:
                node = node.right  # Move right if we're doing reverse inorder
            else:
                node = node.left   # Move left for normal inorder
    
    def next(self) -> int:
        # Get next smallest (or largest if reverse) element
        node = self.stack.pop()
        if not self.reverse:
            # For forward iterator, we need to push right child's left branch
            self._push_all(node.right)
        else:
            # For reverse iterator, we need to push left child's right branch
            self._push_all(node.left)
        return node.val
    
    def has_next(self) -> bool:
        # Check if there are more elements to iterate
        return len(self.stack) > 0

class Solution:
    def findTarget(self, root: TreeNode, k: int) -> bool:
        if not root:
            return False
        
        # Initialize forward and reverse iterators
        forward = BSTIterator(root, False)  # For smallest to largest
        reverse = BSTIterator(root, True)   # For largest to smallest
        
        # Get the smallest and largest values to start
        left = forward.next()
        right = reverse.next()
        
        # Two-pointer approach
        while left < right:  # Ensure we don't count the same node twice
            current_sum = left + right
            if current_sum == k:
                return True  # Found a pair that sums to k
            elif current_sum < k:
                left = forward.next()  # Need a larger number, move left pointer
            else:
                right = reverse.next() # Need a smaller number, move right pointer
        
        # If we've exhausted all possibilities without finding a match
        return False

# Helper function to create a BST from a list
def create_bst(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    while queue and i < len(values):
        node = queue.pop(0)
        # Add left child
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        # Add right child
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

# Test the solution
solution = Solution()

# Test case 1: Should return True (3 + 6 = 9)
root1 = create_bst([5,3,6,2,4,None,7])
k1 = 9
print(solution.findTarget(root1, k1))  # Expected: True

# Test case 2: Should return False (no pair sums to 28)
root2 = create_bst([5,3,6,2,4,None,7])
k2 = 28
print(solution.findTarget(root2, k2))  # Expected: False

# Test case 3: Should return True (1 + 3 = 4)
root3 = create_bst([2,1,3])
k3 = 4
print(solution.findTarget(root3, k3))  # Expected: True