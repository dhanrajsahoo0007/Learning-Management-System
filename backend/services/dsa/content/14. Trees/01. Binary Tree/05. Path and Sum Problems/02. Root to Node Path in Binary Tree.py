"""
Problem Statement:
    Given a Binary Tree and a reference to a node belonging to it, return the path from the root node to the given node.

Constraints:
    1. No two nodes in the tree have the same data value.
    2. It is assured that the given node is present and a path always exists.

Time Complexity: O(n), where n is the number of nodes in the tree.
In the worst case, we might need to visit all nodes to find the target node.

Space Complexity: O(h), where h is the height of the tree.
This is due to the recursion stack. In the worst case of a skewed tree, this could be O(n).


Explanation of the approach:

    1. We use a depth-first search (DFS) to traverse the tree.
    2. As we traverse, we keep track of the current path by adding nodes to a list.
    3. If we find the target node, we return True, which propagates up the recursion stack.
    4. If we don't find the target node in a subtree, we remove the current node from the path (backtracking).
    5. The main function initializes an empty path and calls the DFS function.
    6. If the target is found, the path will contain the route from root to the target node.


"""
from typing import List, Optional

# Definition for a binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def findPath(self, root: TreeNode, target: int) -> List[int]:
        def dfs(node: Optional[TreeNode], target: int, path: List[int]) -> bool:
            # Base case: if node is None, return False
            if not node:
                return False
            
            # Add current node to the path
            path.append(node.val)
            
            # If we've found the target node, return True
            if node.val == target:
                return True
            
            # Recursively search in left and right subtrees
            if dfs(node.left, target, path) or dfs(node.right, target, path):
                return True
            
            # If target not found in this subtree, remove current node from path
            path.pop()
            return False
        
        path = []
        dfs(root, target, path)
        return path

# Helper function to create a binary tree from a list representation
def create_tree(values: List[Optional[int]]) -> Optional[TreeNode]:
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
    root1 = create_tree([1,2,3,4,5,6,7])
    solution = Solution()
    print("Test case 1:")
    print("Tree: [1,2,3,4,5,6,7]")
    print("Path to node 5:", solution.findPath(root1, 5))

    # Test case 2
    root2 = create_tree([1,2,3,None,4,5,6])
    print("\nTest case 2:")
    print("Tree: [1,2,3,None,4,5,6]")
    print("Path to node 6:", solution.findPath(root2, 6))
