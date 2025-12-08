"""
Problem: Construct Binary Tree from Inorder and Postorder Traversal

    Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree 
    and postorder is the postorder traversal of the same tree, construct and return the binary tree.

Time Complexity: O(n^2) in the worst case, where n is the number of nodes.
Space Complexity: O(n) due to the recursion stack.

Note: This can be optimized to O(n) time complexity by using a hash map to store inorder indices.

Leetcode Link: https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildBT(self, inorder, postorder, in_start, in_end, post_start, post_end):
        # Base case: if the start index is greater than the end index, return None
        if in_start > in_end:
            return None
        
        # The last element in postorder is the root of the current subtree
        root = TreeNode(postorder[post_end])
        root_candidate = root.val
        
        # Find the index of the root in the inorder traversal
        # This can be optimized using a hash map for O(1) lookup
        i = in_start
        for i in range(in_start, in_end + 1):
            if inorder[i] == root_candidate:
                break
        
        # Calculate the sizes of left and right subtrees
        left_size = i - in_start
        right_size = in_end - i
        
        # Recursively build the left subtree
        # Left subtree is from in_start to i-1 in inorder
        # and from post_start to post_start + left_size - 1 in postorder
        root.left = self.buildBT(inorder, postorder, in_start, i - 1, post_start, post_start + left_size - 1)
        
        # Recursively build the right subtree
        # Right subtree is from i+1 to in_end in inorder
        # and from post_end - right_size to post_end - 1 in postorder
        root.right = self.buildBT(inorder, postorder, i + 1, in_end, post_end - right_size, post_end - 1)
        
        return root

    def buildTree(self, inorder: list[int], postorder: list[int]) -> TreeNode:
        n = len(postorder)
        # Initial call to buildBT with full ranges of both traversals
        return self.buildBT(inorder, postorder, 0, n - 1, 0, n - 1)

    # Helper function to print the tree (inorder traversal)
    def inorderTraversal(self, root: TreeNode) -> list[int]:
        if not root:
            return []
        return (self.inorderTraversal(root.left) + 
                [root.val] + 
                self.inorderTraversal(root.right))

# Example usage:
inorder = [9,3,15,20,7]
postorder = [9,15,7,20,3]
solution = Solution()
root = solution.buildTree(inorder, postorder)
print(solution.inorderTraversal(root))  # Should print [9, 3, 15, 20, 7]