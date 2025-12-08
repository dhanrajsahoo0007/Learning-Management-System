class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def __init__(self):
        self.max_sum = float('-inf')

    def maxPathSum(self, root: TreeNode) -> int:
        self.max_gain(root)
        return self.max_sum
    
    def max_gain(self, node: TreeNode) -> int:
        if not node:
            return 0
        
        # Recursively find the maximum path sum for left and right subtrees
        left_gain = max(self.max_gain(node.left), 0)
        right_gain = max(self.max_gain(node.right), 0)
        
        # Price of the new path: node value + left gain + right gain
        price_new_path = node.val + left_gain + right_gain
        
        # Update max_sum if the new path price is higher
        self.max_sum = max(self.max_sum, price_new_path)
        
        # Return the maximum gain the node and one of its subtrees could add to the parent
        return node.val + max(left_gain, right_gain)

# Example usage
root = TreeNode(10)
root.left = TreeNode(2)
root.right = TreeNode(10)
root.left.left = TreeNode(20)
root.left.right = TreeNode(1)
root.right.right = TreeNode(-25)
root.right.right.left = TreeNode(3)
root.right.right.right = TreeNode(4)

solution = Solution()
print("Maximum Path Sum:", solution.maxPathSum(root))