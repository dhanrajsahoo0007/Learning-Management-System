"""
    Problem statement : Check if the Binary Tree is Height balanced or not 
"""

from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:

    def isBalanced_bfs(self, root: TreeNode) -> bool:
        if not root:
            return True
        
        queue = deque([root])
        while queue:
            node = queue.popleft()
            if abs(self.height(node.left) - self.height(node.right)) > 1:
                return False
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        return True
    
    def height(self, node: TreeNode) -> int:
        if not node:
            return 0
        return 1 + max(self.height(node.left), self.height(node.right))
    

    def isBalanced_dfs(self, root: TreeNode) -> bool:
        return self.dfs_helper(root) != -1
    
    def dfs_helper(self, node: TreeNode) -> tuple[int, bool]:
        if not node:
            return 0
        
        left_height = self.dfs_helper(node.left)
        right_height = self.dfs_helper(node.right)

        if left_height < 0 or right_height < 0:
            return -1 
        
        if abs(left_height - right_height) > 1:  
            return -1
        
        return max(left_height, right_height) + 1
    

    # Function to check if a binary tree is balanced
    def isBalanced(self, root):
        # Check if the tree's height difference between subtrees is less than 2
        # If not, return False; otherwise, return True
        return self.dfsHeight(root) != -1


    def dfsHeight(self, root):

        if not root:
            return 0

        left_height = self.dfsHeight(root.left)

        right_height = self.dfsHeight(root.right)

        # If the left or subtree is unbalanced 
        if left_height == -1 or right_height == -1 :
            return -1

        # check the abs difference 
        if abs(left_height - right_height) > 1:
            return -1

        # Return the maximum height of left and right subtrees, adding 1 for the current node
        return max(left_height, right_height) + 1
    

    