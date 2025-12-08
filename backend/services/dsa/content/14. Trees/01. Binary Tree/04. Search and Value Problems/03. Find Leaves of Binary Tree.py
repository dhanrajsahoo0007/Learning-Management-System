"""
Problem: Find Leaves of Binary Tree

Given the root of a binary tree, collect the tree's nodes as if you were doing this:
    1. Collect all the leaf nodes.
    2. Remove all the leaf nodes.
    3. Repeat until the tree is empty.

Examples:
1. Input: root = [1,2,3,4,5]
   Output: [[4,5,3],[2],[1]]
   Explanation:
   
       1
      / \
     2   3
    / \
   4   5
   
   - First round: [4,5,3] (leaves of the tree)
   - Second round: [2] (new leaves after removing previous ones)
   - Third round: [1] (root becomes a leaf)

2. Input: root = [1]
   Output: [[1]]
   Explanation: The tree only has one node, which is both the root and a leaf.

Constraints:
    * The number of nodes in the tree is in the range [1, 100].
    * -100 <= Node.val <= 100

Time Complexity: O(n), where n is the number of nodes in the tree.
Space Complexity: O(n) for the result list and the recursion stack.

Approach:
    We use a depth-first search (DFS) to traverse the tree and assign a "height" to each node.
    The height of a node is defined as its distance from the deepest leaf in its subtree.
    Leaf nodes have a height of 0, and the root will have the maximum height.
    We group nodes by their height, which corresponds to the order in which they would be removed.
"""

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findLeaves(self, root: TreeNode) -> list[list[int]]:
        def dfs(node):
            # Base case: if node is None, return -1 as its height
            if not node:
                return -1
            
            # Recursively calculate heights of left and right subtrees
            left_height = dfs(node.left)
            right_height = dfs(node.right)
            
            # Current node's height is max of its children's heights plus one
            current_height = max(left_height, right_height) + 1
            
            # If we haven't encountered this height before, add a new list
            if len(result) <= current_height:
                result.append([])
            
            # Add current node's value to the list corresponding to its height
            result[current_height].append(node.val)
            
            # Return current node's height
            return current_height
        
        result = []
        dfs(root)
        return result

# Helper function to create a binary tree from a list
def create_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    while queue and i < len(values):
        node = queue.pop(0)
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
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
