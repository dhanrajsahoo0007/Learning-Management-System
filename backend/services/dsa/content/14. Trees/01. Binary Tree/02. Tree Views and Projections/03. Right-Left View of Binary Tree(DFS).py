# Node class for the binary tree
class Node:
    def __init__(self, val):
        self.data = val
        self.left = None
        self.right = None

# Solution class to get the left
# and right view of the binary tree
class Solution:
    def rightsideView(self, root):
        res = []
        level = 0 
        self.recursionRight(root, level, res)
        return res

    def leftsideView(self, root):
        res = []
        level = 0
        self.recursionLeft(root, level, res)
        return res

    def recursionLeft(self, root, level, res):
        if not root:
            return
        
        if len(res) == level:
            res.append(root.data)

        
        # Recursively traverse left subtree first, then right subtree
        # This ensures we encounter the leftmost node of each level first
        self.recursionLeft(root.left, level + 1, res)
        self.recursionLeft(root.right, level + 1, res)

    def recursionRight(self, root, level, res):
        if not root:
            return
        
        if len(res) == level:
            res.append(root.data)
        
        # Recursively traverse right subtree first, then left subtree
        # This ensures we encounter the rightmost node of each level first
        self.recursionRight(root.right, level + 1, res)
        self.recursionRight(root.left, level + 1, res)

# Creating a sample binary tree
"""
The tree structure:
        1
      /   \
     2     3
    / \   / \
   4  10 9  10
    \
     5
      \
       6

"""
root = Node(1)
root.left = Node(2)
root.left.left = Node(4)
root.left.right = Node(10)
root.left.left.right = Node(5)
root.left.left.right.right = Node(6)
root.right = Node(3)
root.right.right = Node(10)
root.right.left = Node(9)

solution = Solution()

# Get the Right View traversal
rightView = solution.rightsideView(root)

# Print the result for Right View
print("Right View Traversal:", end=" ")
for node in rightView:
    print(node, end=" ")
print()

# Get the Left View traversal
leftView = solution.leftsideView(root)

# Print the result for Left View
print("Left View Traversal:", end=" ")
for node in leftView:
    print(node, end=" ")
print()

"""
Explanation of the algorithm:

1. Both left and right view traversals use a similar recursive approach.
2. The main difference is the order of recursive calls for left and right children.
3. For each level, we add the first encountered node to the result list.
4. The level parameter keeps track of the current depth in the tree.
5. We compare the current level with the size of the result list to determine if we've seen a node at this level before.

Time Complexity: O(n), where n is the number of nodes in the tree.
Space Complexity: O(h), where h is the height of the tree (due to recursion stack).
                  In the worst case (skewed tree), this could be O(n).

The right view traversal will be: 1 3 10 6
The left view traversal will be: 1 2 4 5 6
"""