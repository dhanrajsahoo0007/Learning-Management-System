"""
Problem Statement:
    Given the root of a binary search tree and a target value, return the value in the BST 
    that is closest to the target. If there are multiple answers, return the smallest.

Time Complexity: O(h), where h is the height of the tree
Space Complexity: O(1) for iterative solution, O(h) for recursive solution due to call stack

Approach:
    1. Traverse the BST.
    2. At each node, compare its value with the target.
    3. Update the closest value if the current node's value is closer to the target.
    4. Move left if target is smaller, right if target is larger.

Example:
Input: root = [4,2,5,1,3], target = 3.714286
Output: 4

Explanation: 
The closest value to 3.714286 is 4.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def closestValue(self, root: TreeNode, target: float) -> int:
        closest = root.val
        while root:
            # Update closest if current value is closer to target
            if abs(root.val - target) < abs(closest - target):
                closest = root.val
            elif abs(root.val - target) == abs(closest - target):
                closest = min(closest, root.val)  # Choose smaller value if distances are equal
            
            # Move to left or right subtree
            if target < root.val:
                root = root.left
            else:
                root = root.right
        
        return closest

# Helper function to create a BST from a list
def create_bst(values):
    if not values:
        return None
    root = TreeNode(values[0])
    for val in values[1:]:
        node = root
        while True:
            if val < node.val:
                if node.left:
                    node = node.left
                else:
                    node.left = TreeNode(val)
                    break
            else:
                if node.right:
                    node = node.right
                else:
                    node.right = TreeNode(val)
                    break
    return root

# Test the solution
solution = Solution()

# Test case 1
root1 = create_bst([4,2,5,1,3])
target1 = 3.714286
print(f"Closest value to {target1}: {solution.closestValue(root1, target1)}")  # Expected: 4

# Test case 2
root2 = create_bst([1])
target2 = 4.428571
print(f"Closest value to {target2}: {solution.closestValue(root2, target2)}")  # Expected: 1

# Test case 3: Multiple equidistant values
root3 = create_bst([3,2,4,1])
target3 = 2.5
print(f"Closest value to {target3}: {solution.closestValue(root3, target3)}")  # Expected: 2

# Test case 4: Target exactly matches a node value
root4 = create_bst([4,2,5,1,3])
target4 = 3.0
print(f"Closest value to {target4}: {solution.closestValue(root4, target4)}")  # Expected: 3