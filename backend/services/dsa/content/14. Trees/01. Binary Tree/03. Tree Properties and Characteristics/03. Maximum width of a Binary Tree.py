"""
Problem Statement:
    Given the root of a binary tree, return the maximum width of the given tree.

    The maximum width of a tree is the maximum width among all levels.
    The width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), 
    where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.

    It is guaranteed that the answer will in the range of a 32-bit signed integer.

Time Complexity: 
    - Both BFS and DFS approaches: O(N), where N is the number of nodes in the tree.
    We visit each node exactly once in both approaches.

Space Complexity:
    - BFS approach: O(W), where W is the maximum width of the tree.
    In the worst case, the queue might contain all nodes at the widest level.
    - DFS approach: O(H), where H is the height of the tree.
    This is due to the recursion stack. In a balanced tree, H = log(N), but in the worst case (skewed tree), H can be N.

Explanation:
1. BFS Approach:
   - Use level-order traversal with a queue.
   - For each node, keep track of its position in the level.
   - The position of a left child is 2*parent_position, and for a right child is 2*parent_position + 1.
   - At each level, calculate the width as (last_node_position - first_node_position + 1).
   - Keep track of the maximum width seen so far.

2. DFS Approach:
   - Use preorder traversal (root, left, right).
   - Keep track of the depth and position of each node.
   - Maintain a list of leftmost positions for each level.
   - At each node, calculate the current width and compare with the maximum width of its subtrees.

Examples:

Example 1:
Input: root = [1,3,2,5,3,null,9]
    1
   / \
  3   2
 / \   \
5   3   9

Output: 4
Explanation: The maximum width is at the third level with length 4 (5,3,null,9).

Example 2:
Input: root = [1,3,2,5,null,null,9,6,null,7]
    1
   / \
  3   2
 /     \
5       9
/       /
6       7
Output: 7
Explanation: The maximum width is at the fourth level with length 7 (6,null,null,null,null,null,7).

Example 3:
Input: root = [1,3,2,5]
    1
   / \
  3   2
 /
5
Output: 2
Explanation: The maximum width is at the second level with length 2 (3,2).
"""

from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    # Approach 1: BFS (Level Order Traversal)
    def widthOfBinaryTree_BFS(self, root: TreeNode) -> int:
        # If the tree is empty, return 0
        if not root:
            return 0
        
        # Initialize a deque to serve as our queue for BFS
        # Each element is a tuple (node, position)
        que = deque([(root, 0)])
        
        # Variable to store the maximum width seen so far
        max_width = 0
        
        # Perform level-order traversal
        while que:
            # Get the number of nodes at the current level
            size = len(que)
            
            # Get the position of the first and last node in the current level
            first = que[0][1]  # First node's position
            last = que[-1][1]  # Last node's position
            
            # Update max_width if the current level is wider
            max_width = max(max_width, last - first + 1)
            
            # Process all nodes at the current level
            for _ in range(size):
                # Remove the front node from the queue
                curr, d = que.popleft()
                
                # If left child exists, add it to the queue
                # Its position is 2*d + 1
                if curr.left:
                    que.append((curr.left, 2*d + 1))
                
                # If right child exists, add it to the queue
                # Its position is 2*d + 2
                if curr.right:
                    que.append((curr.right, 2*d + 2))
        
        # Return the maximum width found
        return max_width

    # Approach 2: DFS (Preorder Traversal)
    def widthOfBinaryTree_DFS(self, root: TreeNode) -> int:
        def dfs(node: TreeNode, depth: int, position: int, leftmost: list) -> int:
            if not node:
                return 0
            
            # Extend leftmost list if we've reached a new level
            if depth == len(leftmost):
                leftmost.append(position)
            
            # Calculate current width
            current_width = position - leftmost[depth] + 1
            
            # Recursively calculate width for left and right subtrees
            left_width = dfs(node.left, depth + 1, 2 * position, leftmost)
            right_width = dfs(node.right, depth + 1, 2 * position + 1, leftmost)
            
            # Return the maximum width among current, left, and right
            return max(current_width, left_width, right_width)

        if not root:
            return 0
        
        return dfs(root, 0, 0, [])

# Example usage
def create_tree():
    root = TreeNode(1)
    root.left = TreeNode(3)
    root.right = TreeNode(2)
    root.left.left = TreeNode(5)
    root.left.right = TreeNode(3)
    root.right.right = TreeNode(9)
    return root

solution = Solution()
tree = create_tree()
print("Maximum Width (BFS):", solution.widthOfBinaryTree_BFS(tree))  # Expected output: 4
print("Maximum Width (DFS):", solution.widthOfBinaryTree_DFS(tree))  # Expected output: 4