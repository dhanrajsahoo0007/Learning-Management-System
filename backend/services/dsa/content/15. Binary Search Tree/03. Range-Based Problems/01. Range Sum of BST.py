"""
Problem Statement:
    Given the root node of a binary search tree and two integers low and high, 
    return the sum of values of all nodes with a value in the inclusive range [low, high].

Time Complexity: O(N), where N is the number of nodes in the tree
Space Complexity: O(H), where H is the height of the tree (due to recursive call stack)

Approach:
    1. Traverse the BST.
    2. If current node's value is less than low, only explore right subtree.
    3. If current node's value is greater than high, only explore left subtree.
    4. If current node's value is within range, add to sum and explore both subtrees.

Example:
Input: root = [10,5,15,3,7,null,18], low = 7, high = 15
Output: 32
Explanation: Nodes 7, 10, and 15 are in the range [7, 15]. 7 + 10 + 15 = 32.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rangeSumBST(self, root: TreeNode, low: int, high: int) -> int:
        if not root:
            return 0
        
        # If current node's value is less than low, only explore right subtree
        if root.val < low:
            return self.rangeSumBST(root.right, low, high)
        
        # If current node's value is greater than high, only explore left subtree
        if root.val > high:
            return self.rangeSumBST(root.left, low, high)
        
        # If current node's value is within range, add to sum and explore both subtrees
        return (root.val + 
                self.rangeSumBST(root.left, low, high) + 
                self.rangeSumBST(root.right, low, high))

# Helper function to create a BST from a list
def create_bst(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    while queue and i < len(values):
        node = queue.pop(0)
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

# Test the solution
solution = Solution()

# Test case 1
root1 = create_bst([10,5,15,3,7,None,18])
print("Range Sum of BST:", solution.rangeSumBST(root1, 7, 15))  # Expected: 32

# Test case 2
root2 = create_bst([10,5,15,3,7,13,18,1,None,6])
print("Range Sum of BST:", solution.rangeSumBST(root2, 6, 10))  # Expected: 23

# Test case 3: Empty tree
root3 = None
print("Range Sum of BST:", solution.rangeSumBST(root3, 1, 100))  # Expected: 0

# Test case 4: All nodes within range
root4 = create_bst([5,3,7,1,4,6,8])
print("Range Sum of BST:", solution.rangeSumBST(root4, 1, 8))  # Expected: 34