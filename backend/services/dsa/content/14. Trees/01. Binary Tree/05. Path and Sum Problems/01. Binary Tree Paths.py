"""
Problem Statement:
    Given the root of a binary tree, collect the tree's nodes as if you were doing this:
        1. Collect all the leaf nodes.
        2. Remove all the leaf nodes.
        3. Repeat until the tree is empty.

The goal is to return a list of lists, where each inner list represents the leaves collected in one round.

Example 1:
Input: root = [1,2,3,4,5]
Output: [[4,5,3],[2],[1]]
Explanation: 
  1
 / \
2   3
/ \
4 5
First round: [4,5,3]
Second round: [2]
Third round: [1]

Example 2:
Input: root = [1]
Output: [[1]]

Constraints:
* The number of nodes in the tree is in the range [1, 100].
* -100 <= Node.val <= 100

Time Complexity: O(n), where n is the number of nodes in the tree.
We visit each node once during the DFS traversal.

Space Complexity: O(n)
- O(n) for the result dictionary to store all nodes.
- O(h) for the recursion stack, where h is the height of the tree (worst case O(n) for a skewed tree).
- Overall, the space complexity is O(n).
"""

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

from typing import List, Optional
from collections import defaultdict

class Solution:
    def findLeaves(self, root: Optional[TreeNode]) -> List[List[int]]:
        def dfs(node: Optional[TreeNode]) -> int:
            # Base case: if node is None, return -1
            # This ensures that leaf nodes get a height of 0
            if not node:
                return -1
            
            # Recursively get the height of left and right subtrees
            left_height = dfs(node.left)
            right_height = dfs(node.right)
            
            # The current node's height is the max of its children's heights plus 1
            # This assigns height 0 to leaves, 1 to their parents, and so on
            current_height = max(left_height, right_height) + 1
            
            # Add the current node's value to the corresponding height in our result
            # This groups nodes that will be removed in the same round
            result[current_height].append(node.val)
            
            # Return the current height for use by the parent node
            return current_height
        
        # Use defaultdict to automatically create empty lists for new heights
        # This simplifies the grouping process
        result = defaultdict(list)
        
        # Start the DFS traversal from the root
        dfs(root)
        
        # Convert the defaultdict to a list of lists, sorted by height
        # This ensures that leaves are grouped correctly in the output
        return [result[i] for i in range(len(result))]

# Helper function to create a binary tree from a list representation
def create_tree(values: List[Optional[int]]) -> Optional[TreeNode]:
    if not values:
        return None
    
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    
    while queue and i < len(values):
        node = queue.pop(0)
        
        # Create left child if exists
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        
        # Create right child if exists
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    
    return root

# Test the solution
if __name__ == "__main__":
    # Test case 1
    root1 = create_tree([1,2,3,4,5])
    solution = Solution()
    print("Test case 1:")
    print("Input: [1,2,3,4,5]")
    print("Output:", solution.findLeaves(root1))

    # Test case 2
    root2 = create_tree([1])
    print("\nTest case 2:")
    print("Input: [1]")
    print("Output:", solution.findLeaves(root2))

"""
Explanation of the approach:

1. We use a depth-first search (DFS) to traverse the tree bottom-up.
2. For each node, we calculate its height from the bottom of the tree:
   - Leaf nodes have a height of 0.
   - A node's height is 1 + max(left_child_height, right_child_height).
3. We use a defaultdict to group nodes by their height.
4. Finally, we convert the defaultdict to a list of lists, sorted by height.

This approach ensures that:
- Nodes are grouped correctly based on when they would become leaves.
- The order of removal is preserved (leaves first, then their parents, and so on).
- The solution works for trees of various shapes and sizes within the given constraints.

The use of defaultdict and list comprehension makes the code more Pythonic and efficient.
"""