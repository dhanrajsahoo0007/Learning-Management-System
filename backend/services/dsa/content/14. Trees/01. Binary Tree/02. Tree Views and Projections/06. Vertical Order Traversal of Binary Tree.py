"""
Problem Statement: Vertical Order Traversal
    Given the root of a binary tree, calculate the vertical order traversal of the binary tree.
    For each node at position (row, col), its left and right children will be at positions (row + 1, col - 1) and (row + 1, col + 1) respectively. The root of the tree is at (0, 0).
    The vertical order traversal of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.

Time Complexity: O(N log N), where N is the number of nodes in the binary tree.
    - The DFS traversal takes O(N) time to visit all nodes.
    - Sorting the keys of verticalTable takes O(K log K) time, where K is the number of unique vertical positions (at most N).
    - Sorting each vertical line takes O(M log M) time, where M is the number of nodes in that line (at most N).
    - In the worst case, we might need to sort all N nodes, resulting in O(N log N) time.

Space Complexity: O(N)
    - In the worst case, all N nodes might be stored in the verticalTable.
    - The recursion stack for DFS can go up to O(H), where H is the height of the tree (which can be N in the worst case of a skewed tree).

Explanation:
    1. We use a depth-first search (DFS) to traverse the tree.
    2. For each node, we keep track of its vertical position and level.
    3. We use a defaultdict to store nodes at each vertical position.
    4. After the traversal, we sort the vertical positions and the nodes within each vertical line.
    5. Finally, we construct the result list based on the sorted vertical order.

The key idea is to use a tuple (level, value) for each node. This allows us to sort nodes first by their level (top-to-bottom) and then by their value when they are at the same position.

Examples:

Example 1:
Input: root = [3,9,20,null,null,15,7]
    3
   / \
  9  20
    /  \
   15   7
Output: [[9],[3,15],[20],[7]]
Explanation: 
    Column -1: Only node 9 is in this column.
    Column 0: Nodes 3 and 15 are in this column in that order from top to bottom.
    Column 1: Only node 20 is in this column.
    Column 2: Only node 7 is in this column.

Example 2:
Input: root = [1,2,3,4,5,6,7]
       1
     /   \
    2     3
   / \   / \
  4   5 6   7
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation: 
    Column -2: Only node 4 is in this column.
    Column -1: Only node 2 is in this column.
    Column 0: Nodes 1, 5, and 6 are in this column.
            1 is at the top, so it comes first.
            5 and 6 are at the same position (2, 0), so we order them by their value, 5 before 6.
    Column 1: Only node 3 is in this column.
    Column 2: Only node 7 is in this column.

Example 3:
Input: root = [1,2,3,4,6,5,7]
       1
     /   \
    2     3
   / \   / \
  4   6 5   7
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation: 
    This case is the same as example 2, but with nodes 5 and 6 swapped.
    Note that the solution remains the same since 5 and 6 are in the same location and should be ordered by their values.
"""


from collections import defaultdict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def verticalTraversal(self, root: TreeNode) -> list[list[int]]:
        if not root:
            return []
        
        # Use a dictionary to store nodes at each vertical line
        # Key: vertical, Value: list of (level, value) tuples
        verticalTable = defaultdict(list)
        
        def dfs(node, level, vertical):
            if not node:
                return
            
            # Add the node to the vertical table
            verticalTable[vertical].append((level, node.val))
            
            # Traverse left and right children
            dfs(node.left, level + 1, vertical - 1)
            dfs(node.right, level + 1, vertical + 1)
        
        # Start DFS from the root
        dfs(root, 0, 0)
        
        # Sort the vertical table and create the result
        result = []
        for vertical in sorted(verticalTable.keys()):
            # Sort nodes in this vertical line by level and then by value
            verticalLine = [val for level, val in sorted(verticalTable[vertical])]

            # above line or below 
            # nodes = verticalTable[vertical]
            # nodes.sort()  # Sort by level, then by value
            # verticalLine = []
            # for _, val in nodes:
            #     verticalLine.append(val)
            result.append(verticalLine)
        
        return result

# Example usage
def create_tree():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.left = TreeNode(6)
    root.right.right = TreeNode(7)
    return root

solution = Solution()
tree = create_tree()
vertical_order = solution.verticalTraversal(tree)
print("Vertical Order Traversal:", vertical_order)