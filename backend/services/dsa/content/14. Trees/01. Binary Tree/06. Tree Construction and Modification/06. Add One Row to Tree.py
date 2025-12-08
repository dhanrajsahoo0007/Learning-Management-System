"""
Problem: Add One Row to Tree
    Given the root of a binary tree and two integers val and depth, add a row of nodes with value val at the given depth.

Key Points:
    1. The root node is at depth 1.
    2. For each node at depth - 1, create two new nodes with value val as its left and right children.
    3. The original left and right subtrees become the left and right subtrees of the new nodes respectively.
    4. If depth is 1, create a new root with the given value and make the original tree its left subtree.

    
Example 1:
Input: root = [4,2,6,3,1,5], val = 1, depth = 2
       4                  4
     /   \              /   \
    2     6    =>     1      1
   / \   /           /      /
  3   1 5           2      6
                   / \    /
                  3   1  5

Example 2:
Input: root = [4,2,null,3,1], val = 1, depth = 3
      4                  4
    /                  /
   2                  2
  / \                / \
 3   1      =>      3   1
                   /     \
                  1       1

We'll implement two solutions:
    1. Depth-First Search (DFS) approach
    2. Breadth-First Search (BFS) approach

Time Complexity for both: O(n), where n is the number of nodes in the tree

Space Complexity: 
    - DFS: O(h) where h is the height of the tree (due to recursion stack)
    - BFS: O(w) where w is the maximum width of the tree (due to queue)
"""
from collections import deque
# Definition of TreeNode class to represent nodes in the binary tree
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val    # Value of the node
        self.left = left  # Left child
        self.right = right  # Right child


class Solution:
    def add(self, root: TreeNode, val: int, depth: int, curr: int) -> TreeNode:
        # Base case: if the node is None, return None
        if not root:
            return None
        
        # If we've reached the level just above where we need to add new nodes
        if curr == depth - 1:
            # Save the current left and right children
            l_temp = root.left
            r_temp = root.right
            
            # Create new nodes with the given value
            root.left = TreeNode(val)
            root.right = TreeNode(val)
            
            # Attach the original children to the new nodes
            root.left.left = l_temp
            root.right.right = r_temp
            
            return root
        
        # Recursively process left and right subtrees
        root.left = self.add(root.left, val, depth, curr + 1)
        root.right = self.add(root.right, val, depth, curr + 1)
        
        return root
    
    def addOneRow(self, root: TreeNode, val: int, depth: int) -> TreeNode:
        """
        Main method to add a row of nodes with the given value at the specified depth.
        
        Args:
        root (TreeNode): Root of the binary tree
        val (int): Value to be added in the new row
        depth (int): Depth at which the new row should be added
        
        Returns:
        TreeNode: Root of the modified tree
        """
        # Special case: if depth is 1, create a new root
        if depth == 1:
            new_root = TreeNode(val)
            new_root.left = root
            return new_root
        
        # For all other depths, call the add method
        return self.add(root, val, depth, 1)

    def addOneRow_BFS(self, root: TreeNode, val: int, depth: int) -> TreeNode:
        """
        BFS approach to add one row to the tree.
        
        Args:
        root (TreeNode): The root of the binary tree
        val (int): The value to be added in the new row
        depth (int): The depth at which the new row should be added
        
        Returns:
        TreeNode: The root of the modified tree
        """
        from collections import deque
        
        # Handle the special case where depth is 1 (new root needed)
        if depth == 1:
            new_root = TreeNode(val)
            new_root.left = root
            return new_root
        
        # Initialize queue with root node and its depth
        queue = deque([(root, 1)])
        
        while queue:
            level_size = len(queue)  # Number of nodes at current level
            for _ in range(level_size):
                node, current_depth = queue.popleft()
                
                if current_depth == depth - 1:
                    # We're at the level just above where we need to add new nodes
                    # Save current children
                    left_child = node.left
                    right_child = node.right
                    # Create new nodes with given value
                    node.left = TreeNode(val)
                    node.right = TreeNode(val)
                    # Attach original children to new nodes
                    node.left.left = left_child
                    node.right.right = right_child
                else:
                    # If we're not at the target depth, continue BFS
                    if node.left:
                        queue.append((node.left, current_depth + 1))
                    if node.right:
                        queue.append((node.right, current_depth + 1))
        
        return root

# Helper function to create a binary tree from a list representation
def create_tree(values):
    """
    Helper function to create a binary tree from a list representation.
    
    Args:
    values (List): List representation of the binary tree
    
    Returns:
    TreeNode: Root of the created binary tree
    """
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
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

def tree_to_list(root):
    """
    Helper function to convert a binary tree to a list representation.
    
    Args:
    root (TreeNode): Root of the binary tree
    
    Returns:
    List: List representation of the binary tree
    """
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    # Remove trailing None values
    while result[-1] is None:
        result.pop()
    return result

# Test the functions
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    root1 = create_tree([4, 2, 6, 3, 1, 5])
    result_dfs1 = solution.addOneRow(root1, 1, 2)
    result_bfs1 = solution.addOneRow_BFS(create_tree([4, 2, 6, 3, 1, 5]), 1, 2)
    print("DFS Result 1:", tree_to_list(result_dfs1))
    print("BFS Result 1:", tree_to_list(result_bfs1))

    # Test case 2
    root2 = create_tree([4, 2, None, 3, 1])
    result_dfs2 = solution.addOneRow(root2, 1, 3)
    result_bfs2 = solution.addOneRow_BFS(create_tree([4, 2, None, 3, 1]), 1, 3)
    print("DFS Result 2:", tree_to_list(result_dfs2))
    print("BFS Result 2:", tree_to_list(result_bfs2))