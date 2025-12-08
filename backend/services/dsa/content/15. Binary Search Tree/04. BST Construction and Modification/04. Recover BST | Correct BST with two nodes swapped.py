"""
Problem Statement:
    Given the root of a binary search tree (BST) where exactly two nodes were swapped by mistake,
    recover the BST without changing its structure.

Approach:
    1. Perform an in-order traversal of the BST.
    2. During traversal, keep track of the previous node.
    3. If the current node's value is less than the previous node's value, we've found a violation.
    4. The first violation's previous node is the first swapped node.
    5. The second violation's current node is the last swapped node.
    6. If there's only one violation, the swapped nodes are adjacent (first and middle).

Time Complexity: O(n), where n is the number of nodes in the BST
Space Complexity: O(h) for the recursive call stack, where h is the height of the tree

Example:
    Input:  [3,1,4,null,null,2]
    Output: [2,1,4,null,null,3]
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def __init__(self):
        # Initialize pointers to keep track of swapped nodes
        self.first = None   # First node to be swapped
        self.prev = None    # Previously visited node in inorder traversal
        self.middle = None  # Potential second node if swapped nodes are adjacent
        self.last = None    # Second node to be swapped if not adjacent
    
    def inorder(self, root):
        if not root:
            return
        
        # Traverse left subtree
        self.inorder(root.left)
        
        # Check for BST violation
        if self.prev and root.val < self.prev.val:
            if not self.first:
                # First violation: mark these two nodes as 'first' and 'middle'
                self.first = self.prev
                self.middle = root
            else:
                # Second violation: mark this node as 'last'
                self.last = root
        
        # Update previous node to current node
        self.prev = root
        
        # Traverse right subtree
        self.inorder(root.right)
    
    def recoverTree(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        # Reset all pointers
        self.first = self.middle = self.last = None
        # Initialize prev with smallest possible value to handle edge cases
        self.prev = TreeNode(float('-inf'))
        
        # Perform inorder traversal to identify swapped nodes
        self.inorder(root)
        
        if self.first and self.last:
            # Non-adjacent nodes were swapped
            self.first.val, self.last.val = self.last.val, self.first.val
        elif self.first and self.middle:
            # Adjacent nodes were swapped
            self.first.val, self.middle.val = self.middle.val, self.first.val

# Helper function to create a BST from a list
def create_bst(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    while queue and i < len(values):
        node = queue.pop(0)
        # Add left child
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        # Add right child
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

# Helper function to perform inorder traversal and return values
def inorder_traversal(root):
    result = []
    def inorder(node):
        if node:
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
    inorder(root)
    return result

# Test the solution
solution = Solution()

# Test case 1: Swap non-adjacent nodes
root1 = create_bst([3,1,4,None,None,2])
print("Before recovery:", inorder_traversal(root1))
solution.recoverTree(root1)
print("After recovery:", inorder_traversal(root1))

# Test case 2: Swap adjacent nodes
root2 = create_bst([1,3,None,2])
print("\nBefore recovery:", inorder_traversal(root2))
solution.recoverTree(root2)
print("After recovery:", inorder_traversal(root2))

# Test case 3: Already correct BST
root3 = create_bst([2,1,3])
print("\nBefore recovery:", inorder_traversal(root3))
solution.recoverTree(root3)
print("After recovery:", inorder_traversal(root3))