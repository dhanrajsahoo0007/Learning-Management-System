from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def leftSideView(root):
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])
    
    while queue:
        node, level = queue.popleft()
        
        if level == len(result):
            result.append(node.val)
        
        if node.left:
            queue.append((node.left, level + 1))
        if node.right:
            queue.append((node.right, level + 1))
    
    return result

def rightSideView(root):
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])
    
    while queue:
        node, level = queue.popleft()
        
        # If it's a new level, add the node's value
        # If we've seen this level before, OverWrite/ Update the value
        # This ensures we always keep the rightmost node's value for each level
        if level == len(result):
            result.append(node.val)
        else:
            result[level] = node.val
        
        # Add children to the queue
        # The order (left then right) doesn't matter for the right view
        # because we'll always overwrite with the last (rightmost) node at each level
        if node.left:
            queue.append((node.left, level + 1))
        if node.right:
            queue.append((node.right, level + 1))
    
    return result

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.right = TreeNode(5)
root.right.right = TreeNode(4)

"""
        1
        / \
        2   3
        \    \
        5    4
"""

print("Left Side View:", leftSideView(root))   # Output: [1, 2, 5]
print("Right Side View:", rightSideView(root)) # Output: [1, 3, 4]