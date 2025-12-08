"""
Problem Statement:
    Implement Morris Traversal algorithms in-order traversal of a binary tree. 
    These algorithms should traverse the tree without using extra space for recursion or an explicit stack.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def morris_preorder_traversal(root):
    result = []  # List to store the traversal result
    current = root  # Start with the root node
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # In pre-order, we process the current node before creating the link
                result.append(current.val)
                predecessor.right = current
                current = current.left
            else:
                predecessor.right = None
                current = current.right
    
    return result


root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Pre-order traversal:", morris_preorder_traversal(root))
