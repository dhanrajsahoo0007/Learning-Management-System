"""
Perform a zigzag level order traversal of a binary tree.

    Zigzag traversal is a level-by-level traversal of the tree where:
        1. The first level is traversed from left to right.
        2. The second level is traversed from right to left.
        3. The third level is traversed from left to right.
        4. This pattern continues for subsequent levels, alternating direction.

This traversal results in a "zigzag" pattern when visualized.

                        #        1
                        #       / \
                        #      2   3
                        #    /  \   \
                        #   4   5    6

Zig-Zag Level Order Traversal: [[1], [3, 2], [4, 5, 6]] 

"""


from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> list[list[int]]:
        if not root:
            return []
        
        result = []
        queue = deque([root])
        left_to_right = True
        
        while queue:
            level_size = len(queue)
            level = []
            #level = deque()
            
            for _ in range(level_size):
                node = queue.popleft()
                
                if left_to_right:
                    # Add to the end if left to right
                    level.append(node.val)  
                    #level.append(node.val)
                else:
                    # Add to the beginning if right to left
                    level.insert(0, node.val)  
                    # level.appendleft(node.val)         
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(level)
            #result.append(list(level))

            left_to_right = not left_to_right
        
        return result

# Example usage
def create_tree():
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.right = TreeNode(6)
    return root

#        1
#       / \
#      2   3
#    /  \   \
#   4   5    6

solution = Solution()
tree = create_tree()
zigzag_order = solution.zigzagLevelOrder(tree)
print("Zig-Zag Level Order Traversal:", zigzag_order)