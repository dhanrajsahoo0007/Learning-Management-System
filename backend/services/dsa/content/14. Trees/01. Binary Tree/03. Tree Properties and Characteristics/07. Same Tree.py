"""
    Check if Both the Trees are same or not 
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def areIdentical(self, root1: TreeNode, root2: TreeNode) -> bool:
        # If both trees are empty, they are identical
        if root1 is None and root2 is None:
            return True
        
        # If one tree is empty and the other is not, they are not identical
        if root1 is None or root2 is None:
            return False
        
        # Check if current nodes have the same value
        # and recursively check left and right subtrees
        return (root1.val == root2.val and
                self.areIdentical(root1.left, root2.left) and
                self.areIdentical(root1.right, root2.right))

# Example usage
def create_tree1():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    return root

def create_tree2():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    return root

def create_tree3():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(6)  # Different value here
    return root

solution = Solution()
tree1 = create_tree1()
tree2 = create_tree2()
tree3 = create_tree3()

print("Are tree1 and tree2 identical?", solution.areIdentical(tree1, tree2))
print("Are tree1 and tree3 identical?", solution.areIdentical(tree1, tree3))