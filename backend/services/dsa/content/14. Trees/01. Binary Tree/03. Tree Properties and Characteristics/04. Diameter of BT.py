from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def diameter_bfs(self, root):
        if not root:
            return 0
        
        max_diameter = 0
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            
            left_height = self.get_height(node.left)
            right_height = self.get_height(node.right)
            
            max_diameter = max(max_diameter, left_height + right_height)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        return max_diameter

    def get_height(self, node):
        if not node:
            return 0
        return 1 + max(self.get_height(node.left), self.get_height(node.right))

    def diameter_dfs(self, root):
        # In Python, integers are immutable objects. When you pass an integer to a function and try to modify it, you're actually creating a new integer object.
        # Which doesn't affect the original value outside the function.
        # Lists, on the other hand, are mutable objects. 
        # When you pass a list to a function and modify its contents, the changes are reflected in the original list.
        diameter = [0]
        self.height(root, diameter)
        return diameter[0]

    # Function to calculate the height of the tree and update the diameter
    def height(self, node, diameter):
        if not node:
            return 0

        # Recursively calculate the height of left and right subtrees
        lh = self.height(node.left, diameter)
        rh = self.height(node.right, diameter)

        diameter[0] = max(diameter[0], lh + rh)

        # Return the height of the current node's subtree
        return 1 + max(lh, rh)

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

solution = Solution()
print("Diameter (BFS):", solution.diameter_bfs(root))
print("Diameter (DFS):", solution.diameter_dfs(root))