"""
Computes the right side view of a binary tree.

Time Complexity: O(n), where n is the number of nodes in the tree.
                    - We visit each node exactly once during the level-order traversal.

Space Complexity: O(d), where d is the maximum width of the tree.
                - In the worst case (a complete binary tree), the queue will hold 
                    all nodes at the deepest level, which is at most n/2 for a complete tree.
                - For a skewed tree, d would be 1, resulting in O(1) space.
"""


from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root):
        # If the tree is empty, return an empty list
        if not root:
            return []
        
        # Initialize a queue for level-order traversal and a result list
        queue = deque([root])
        result = []
        
        # Perform level-order traversal
        while queue:
            # Get the number of nodes at the current level
            level_size = len(queue)
            right_node = None
            
            # Process all nodes at the current level
            for _ in range(level_size):
                # Pop the front node from the queue
                right_node = queue.popleft()
                
                # Add left child to the queue if it exists
                if right_node.left:
                    queue.append(right_node.left)
                # Add right child to the queue if it exists
                if right_node.right:
                    queue.append(right_node.right)
            
            # After processing all nodes at this level, right_node will be the rightmost node
            # Add its value to the result list
            result.append(right_node.val)
        
        # Return the list of rightmost node values
        return result

# Example usage
def create_sample_tree():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.right = TreeNode(5)
    root.right.right = TreeNode(4)
    return root


"""
Creates and returns the following tree:
         1
       /   \
      2     3
       \     \
        5     4
"""

# Create a sample binary tree
sample_tree = create_sample_tree()

# Create a Solution object and call the rightSideView method
solution = Solution()
right_view = solution.rightSideView(sample_tree)

# Print the result
print("Right side view of the binary tree:", right_view)  # Expected output: [1, 3, 4]