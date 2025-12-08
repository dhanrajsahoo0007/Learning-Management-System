"""
Problem Statement:
    Given a binary tree, find the largest subtree which is a Binary Search Tree (BST), 
    where the largest means subtree with maximum number of nodes in it.

Time Complexity: O(n), where n is the number of nodes in the binary tree
Space Complexity: O(h), where h is the height of the tree (due to recursive call stack)

Approach:
    1. Perform a post-order traversal of the binary tree.
    2. For each node, check if the subtree rooted at that node is a BST.
    3. Keep track of the size of the BST, as well as the minimum and maximum values in the subtree.
    4. Update the largest BST found so far if the current subtree is a BST and larger than the previous largest.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class NodeInfo:
    def __init__(self, size, min_val, max_val, is_bst):
        self.size = size          # Size of the subtree
        self.min = min_val        # Minimum value in the subtree
        self.max = max_val        # Maximum value in the subtree
        self.is_bst = is_bst      # Whether the subtree is a valid BST
        # The is_bst flag is crucial for determining if the entire subtree
        # rooted at this node follows BST properties

class Solution:
    def largestBSTSubtree(self, root: TreeNode) -> int:
        def dfs(node):
            if not node:
                # Base case: empty subtree is considered a BST of size 0
                # min and max are set to infinity to always satisfy BST property with parent
                return NodeInfo(0, float('inf'), float('-inf'), True)
            
            # Recursively process left and right subtrees
            left = dfs(node.left)
            right = dfs(node.right)
            
            # Check if current subtree is BST
            # Current subtree is a BST if:
                # 1. Both left and right subtrees are BSTs
                # 2. Current node's value is greater than max of left subtree
                # 3. Current node's value is less than min of right subtree
            if (left.is_bst and right.is_bst and
                left.max < node.val < right.min):

                size = left.size + right.size + 1
                # Update min and max for this subtree
                min_val = min(left.min, node.val)
                max_val = max(right.max, node.val)
                return NodeInfo(size, min_val, max_val, True)
            
            # If current subtree is not a BST, we propagate the size of the larger BST
            # found in either left or right subtree
            # is_bst is set to False, and min/max are set to infinity to ensure
            # this subtree is not considered a valid BST by its parent
            return NodeInfo(max(left.size, right.size), float('-inf'), float('inf'), False)
        
        # The size of the largest BST is returned as the result
        return dfs(root).size

# Helper function to create a binary tree from a list
def create_tree(values):
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

# Test case 1: Tree with a BST subtree
root1 = create_tree([10,5,15,1,8,6,20])
print("Largest BST size:", solution.largestBSTSubtree(root1))  # Expected: 3

# Test case 2: Entire tree is a BST
root2 = create_tree([4,2,6,1,3,5,7])
print("Largest BST size:", solution.largestBSTSubtree(root2))  # Expected: 7

# Test case 3: No BST subtree larger than 1
root3 = create_tree([2,1,3,4,5,6,7])
print("Largest BST size:", solution.largestBSTSubtree(root3))  # Expected: 1

# Test case 4: Empty tree
root4 = None
print("Largest BST size:", solution.largestBSTSubtree(root4))  # Expected: 0