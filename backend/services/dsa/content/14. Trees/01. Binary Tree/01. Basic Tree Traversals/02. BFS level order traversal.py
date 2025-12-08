from collections import deque


# bfs (Breadth-First Search , Level order traversal):

#     This method uses a queue to visit nodes level by level, from left to right.
#     We start with the root node in the queue.
#     For each node, we add it to the result and then enqueue its children (if any).
#     This process continues until the queue is empty.
#     BFS explores the tree in a level-by-level manner.


# dfs_preorder (Depth-First Search, Pre-order traversal):

#     This method uses recursion to explore as far as possible along each branch before backtracking.
#     We define a nested function dfs that recursively traverses the tree.
#     For each node, we:

#     Add the node's value to the result.
#     Recursively process the left subtree.
#     Recursively process the right subtree.

#     This pre-order DFS explores the root, then the entire left subtree, and finally the entire right subtree.



class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self, root):
        self.root = TreeNode(root)

    # BFS uses a queue (First-In-First-Out)
    def bfs(self):
        if not self.root:
            return []
        
        result = []
        queue = deque([self.root])
        
        while queue:
            node = queue.popleft()
            result.append(node.value)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        return result
    
    # while DFS typically uses a stack (Last-In-First-Out) or recursion.
    def dfs_preorder(self):
        result = []
        
        def dfs(node):
            if not node:
                return
            
            result.append(node.value)
            dfs(node.left)
            dfs(node.right)
        
        dfs(self.root)
        return result

# Create a sample tree
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
print("BFS traversal:", tree.bfs())
print("DFS (pre-order) traversal:", tree.dfs_preorder())