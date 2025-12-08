"""
Problem: Closest Binary Search Tree Value II

    Given the root of a binary search tree, a target value, and an integer k, return the k values 
    in the BST that are closest to the target.

Time Complexity: O(n), where n is the number of nodes in the BST
Space Complexity: O(k) for the queue, O(h) for the recursion stack where h is the height of the tree

Approach:
    Use DFS (in-order traversal) to visit nodes in ascending order.
    Maintain a queue of size k to keep track of the closest values.
"""
import collections
from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def closestKValues(self, root: Optional[TreeNode], target: float, k: int) -> List[int]:
        # Initialize a deque to store the k closest values
        queue = collections.deque([])
        
        def dfs(node):
            if not node:
                return
            
            # In-order traversal: left, root, right
            dfs(node.left)
            
            if len(queue) < k:
                # If queue is not full, simply append the current node's value
                queue.append(node.val)
            else:
                # If queue is full, compare the current node with the oldest element in the queue
                if abs(queue[0] - target) > abs(node.val - target):
                    # If current node is closer to target, remove the oldest and add the current
                    queue.popleft()
                    queue.append(node.val)
                else:
                    # If the oldest element is closer, we can stop the traversal
                    # because all following elements will be farther (BST property)
                    return
            
            # In-order traversal: traverse to the right
            dfs(node.right)
        
        # Start the DFS traversal from the root
        dfs(root)
        
        # Convert the deque to a list and return
        return list(queue)

# Helper function to create a BST from a list (for testing purposes)
def create_bst(values):
    if not values:
        return None
    root = TreeNode(values[0])
    for val in values[1:]:
        node = root
        while True:
            if val < node.val:
                if node.left:
                    node = node.left
                else:
                    node.left = TreeNode(val)
                    break
            else:
                if node.right:
                    node = node.right
                else:
                    node.right = TreeNode(val)
                    break
    return root

# Test the solution
solution = Solution()

# Test case
root = create_bst([4,2,5,1,3])
target = 3.714286
k = 2
print(f"K closest values to {target}: {solution.closestKValues(root, target, k)}")  # Expected: [3,4]