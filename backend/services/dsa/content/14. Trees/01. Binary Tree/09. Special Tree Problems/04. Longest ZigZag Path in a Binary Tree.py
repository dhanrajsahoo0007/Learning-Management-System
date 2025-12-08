"""
Problem Statement:
Given a binary tree root, a ZigZag path for a binary tree is defined as follows:
- Choose any node in the binary tree and a direction (right or left).
- If the current direction is right, move to the right child of the current node; otherwise, move to the left child.
- Change the direction from right to left or from left to right.
- Repeat steps 2 and 3 until you can't move in the tree.
Zigzag length is defined as the number of nodes visited - 1. (A single node has a length of 0).
Return the longest ZigZag path contained in that tree.

Time Complexity for both approaches: O(N), where N is the number of nodes in the tree.
    - Each node is visited exactly once in the traversal.

Space Complexity for both approaches: O(H), where H is the height of the tree.
    - In the worst case (skewed tree), H can be N.
    - This space is used by the recursion stack.
    - For a balanced tree, the space complexity would be O(log N).
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def longestZigZag_DFS(self, root):
        self.max_length = 0  # Store the maximum zigzag path length
        
        def dfs(node, go_left, steps):
            if node is None:
                return
            
            # Update the maximum length if current path is longer
            self.max_length = max(self.max_length, steps)
            
            if go_left:
                # Continue zigzag to the left
                dfs(node.left, False, steps + 1)
                # Start a new zigzag path to the right
                dfs(node.right, True, 1)
            else:
                # Start a new zigzag path to the left
                dfs(node.left, False, 1)
                # Continue zigzag to the right
                dfs(node.right, True, steps + 1)
        
        # Start DFS from the root, considering both left and right initial directions
        dfs(root, False, 0)  # Start assuming we came from a right child
        dfs(root, True, 0)   # Start assuming we came from a left child
        return self.max_length

    def longestZigZag_Alternative(self, root):
        self.max_path = 0  # Store the maximum zigzag path length
        
        def solve(node, left, right):
            if not node:
                return
            
            # Update the maximum path length
            self.max_path = max(self.max_path, left, right)
            
            # Recursive calls:
            # For left child, the 'right' count becomes 'left+1', and 'left' count resets to 0
            # For right child, the 'left' count becomes 'right+1', and 'right' count resets to 0
            solve(node.left, right + 1, 0)
            solve(node.right, 0, left + 1)
        
        # Start the recursion with both left and right counts as 0
        solve(root, 0, 0)
        return self.max_path

def create_complex_tree():
    """
    Creates a complex binary tree to test various zigzag scenarios.
    
    Tree structure:
                1
              /   \
             2     3
            / \   / \
           4   5 6   7
          /   /   \   \
         8   9    10   11
          \   \    \    /
          12   13   14 15
           \         \
           16         17
    """
    # Tree creation code...
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.left = TreeNode(6)
    root.right.right = TreeNode(7)
    root.left.left.left = TreeNode(8)
    root.left.right.left = TreeNode(9)
    root.right.left.right = TreeNode(10)
    root.right.right.right = TreeNode(11)
    root.left.left.left.right = TreeNode(12)
    root.left.right.left.right = TreeNode(13)
    root.right.left.right.right = TreeNode(14)
    root.right.right.right.left = TreeNode(15)
    root.left.left.left.right.right = TreeNode(16)
    root.right.left.right.right.right = TreeNode(17)
    return root

# Create a complex binary tree
complex_tree = create_complex_tree()

# Create a Solution object
solution = Solution()

# Test both approaches
longest_zigzag_dfs = solution.longestZigZag_DFS(complex_tree)
longest_zigzag_alt = solution.longestZigZag_Alternative(complex_tree)

# Print the results
print("Length of the longest ZigZag path (DFS approach):", longest_zigzag_dfs)
print("Length of the longest ZigZag path (Alternative approach):", longest_zigzag_alt)

"""
Explanation of the longest ZigZag path in the complex tree:
1 -> 2 -> 5 -> 9 -> 13 (left, right, left, right)
This path has a length of 4, which is the longest zigzag path in the tree.

Both approaches should yield the same result of 4.

Key Differences between the two approaches:
1. DFS Approach:
   - Explicitly tracks the direction (left or right) and the number of steps.
   - Makes two initial calls to cover both starting directions.
   - More intuitive representation of the "zigzag" concept.

2. Alternative Approach:
   - Keeps separate counts for left and right zigzag paths.
   - Makes a single initial call with both counts set to 0.
   - More concise and handles direction changes implicitly.

Both methods have the same time and space complexity and should produce
identical results for any given tree structure.
"""