class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self, root):
        self.root = TreeNode(root)
    # Preorder (Root, Left, Right):
    # We start at the root (1), then traverse the left subtree (2, 4, 8, 9, 5), and finally the right subtree (3, 6, 10, 7).
    def preorder_traversal(self, node, result=[]):
        if node:
            result.append(node.value)
            self.preorder_traversal(node.left, result)
            self.preorder_traversal(node.right, result)
        return result
    # Inorder (Left, Root, Right):
    # We start with the leftmost node (8), then its parent (4), its right child (9), then up to 2, then 5, then the root (1), and then the right subtree (6, 10, 3, 7).
    def inorder_traversal(self, node, result=[]):
        if node:
            self.inorder_traversal(node.left, result)
            result.append(node.value)
            self.inorder_traversal(node.right, result)
        return result
    # Postorder (Left, Right, Root):
    # We start with the leftmost nodes (8, 9), then their parent (4), then 5, then 2, then the right subtree (10, 6, 7, 3), and finally the root (1).
    def postorder_traversal(self, node, result=[]):
        if node:
            self.postorder_traversal(node.left, result)
            self.postorder_traversal(node.right, result)
            result.append(node.value)
        return result
    
# Create a larger tree
#           1
#         /   \
#        2     3
#       / \   / \
#      4   5 6   7
#     / \     \
#    8   9    10

tree = BinaryTree(1)
tree.root.left = TreeNode(2)
tree.root.right = TreeNode(3)
tree.root.left.left = TreeNode(4)
tree.root.left.right = TreeNode(5)
tree.root.right.left = TreeNode(6)
tree.root.right.right = TreeNode(7)
tree.root.left.left.left = TreeNode(8)
tree.root.left.left.right = TreeNode(9)
tree.root.right.left.right = TreeNode(10)

# Perform traversals
print("Preorder traversal:", tree.preorder_traversal(tree.root, []))
print("Inorder traversal:", tree.inorder_traversal(tree.root, []))
print("Postorder traversal:", tree.postorder_traversal(tree.root, []))