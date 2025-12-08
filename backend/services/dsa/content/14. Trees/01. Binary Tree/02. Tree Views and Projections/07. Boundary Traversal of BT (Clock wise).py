"""
Perform a clockwise boundary order traversal of a binary tree.
Clockwise boundary order traversal visits nodes in the following order:
    1. Root node
    2. Right boundary nodes (top to bottom)
    3. Leaf nodes (right to left)
    4. Left boundary nodes (Reverse)(bottom to top, excluding leaves)

                #           1
                #        /      \
                #       2        3
                #      / \      / \
                #     4   5     6   7
                #    / \   \        /
                #   8   9   10     11
    
    Clockwise Boundary Traversal: [1, 3, 7, 11, 6, 10, 9, 8, 4, 2]
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def clockwiseBoundaryTraversal(self, root: TreeNode) -> list[int]:
        if not root:
            return []
        
        result = [root.val]
        
        def isLeaf(node):
            return not node.left and not node.right
        
        def addRightBoundary(node):
            current = node.right
            while current:
                if not isLeaf(current):
                    result.append(current.val)
                if current.right:
                    current = current.right
                else:
                    current = current.left
        
        def addLeftBoundary(node):
            current = node.left
            temp = []
            while current:
                if not isLeaf(current):
                    temp.append(current.val)
                if current.left:
                    current = current.left
                else:
                    current = current.right
            # Add left boundary nodes in reverse order
            result.extend(temp[::-1])
        
        def addLeaves(node):
            if isLeaf(node):
                result.append(node.val)
                return
            # Recursively traverse right and left subtrees
            if node.right:
                addLeaves(node.right)
            if node.left:
                addLeaves(node.left)
        
        # Add right boundary nodes if root is not a leaf
        if not isLeaf(root):
            addRightBoundary(root)

        # Add all leaf nodes (right to left)
        addLeaves(root)
        
        # Add left boundary nodes if root is not a leaf
        if not isLeaf(root):
            addLeftBoundary(root)
        
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

# Create the tree and perform clockwise boundary traversal
solution = Solution()
tree = create_tree()
boundary = solution.clockwiseBoundaryTraversal(tree)
print("Clockwise Boundary Traversal:", boundary)