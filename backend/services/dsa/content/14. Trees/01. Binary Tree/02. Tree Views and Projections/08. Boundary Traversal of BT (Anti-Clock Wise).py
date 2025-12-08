"""
Perform a boundary order traversal of a binary tree.
    Boundary order traversal visits nodes in the following order:
        1. Root node
        2. Left boundary nodes (top to bottom)
        3. Leaf nodes (left to right)
        4. Right boundary nodes (Reverse)(bottom to top, excluding leaves)

                #           1
                #        /      \
                #       2        3
                #      / \      / \
                #     4   5     6   7
                #    / \   \        /
                #   8   9   10     11
    
    Boundary Traversal: [1, 2, 4, 8, 9, 10, 6, 11, 7, 3]
"""


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def boundaryTraversal(self, root: TreeNode) -> list[int]:
        # If the tree is empty, return an empty list
        if not root:
            return []
        
        # Initialize the result with the root value
        result = [root.val]
        
        # Helper function to check if a node is a leaf
        def isLeaf(node):
            return not node.left and not node.right
        
        # Function to add left boundary nodes (top to bottom)
        def addLeftBoundary(node):
            current = node.left
            while current:
                if not isLeaf(current):
                    result.append(current.val)
                # Move to the next left boundary node
                # If Left does not exist then only move to the right 
                if current.left:
                    current = current.left
                else:
                    current = current.right
        
        # Function to add right boundary nodes (bottom to top)
        def addRightBoundary(node):
            current = node.right
            temp = []
            while current:
                if not isLeaf(current):
                    temp.append(current.val)
                # Move to the next right boundary node
                # If Right does not exist then only move to the left 
                if current.right:
                    current = current.right
                else:
                    current = current.left
            # Add right boundary nodes in reverse order
            result.extend(temp[::-1])
        
        # Function to add leaf nodes (left to right)
        def addLeaves(node):
            if isLeaf(node):
                result.append(node.val)
                return
            # Recursively traverse left and right subtrees
            if node.left:
                addLeaves(node.left)
            if node.right:
                addLeaves(node.right)
        
        # Add left boundary nodes if root is not a leaf
        if not isLeaf(root):
            addLeftBoundary(root)

        # Add all leaf nodes
        addLeaves(root)
        
        # Add right boundary nodes if root is not a leaf
        if not isLeaf(root):
            addRightBoundary(root)
        
        return result

# Function to create the example tree
def create_tree():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.left = TreeNode(6)
    root.right.right = TreeNode(7)
    root.left.left.left = TreeNode(8)
    root.left.left.right = TreeNode(9)
    root.left.right.right = TreeNode(10)
    root.right.right.left = TreeNode(11)
    return root

# Create the tree and perform boundary traversal
solution = Solution()
tree = create_tree()
boundary = solution.boundaryTraversal(tree)
print("Boundary Traversal:", boundary)