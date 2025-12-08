"""
Problem Statement:
    Implement Morris Traversal algorithms for both pre-order and in-order traversal of a binary tree. 
    These algorithms should traverse the tree without using extra space for recursion or an explicit stack.

Explanation:
    Morris Traversal is a tree traversal algorithm that allows us to traverse a binary tree without using 
    extra space for recursion or a stack. 
    It achieves this by temporarily modifying the tree structure
    to create links back to the parent nodes, and then restoring the original structure.

The key steps in Morris Traversal are:
    1. Start with the current node as the root.
    2. While the current node is not NULL:
        a. If the current node has no left child:
            - Process the current node (pre-order) or defer processing (in-order)
            - Move to the right child
        b. If the current node has a left child:
            - Find the rightmost node in the left subtree (predecessor)
            - If the predecessor's right child is NULL:
                    * Make it point to the current node
                    * Process the current node (pre-order) or defer processing (in-order)
                    * Move to the left child
            - If the predecessor's right child points to the current node:
                * Set the right child to NULL (restore the tree structure)
                * Process the current node (in-order) if not already processed
                * Move to the right child

Time Complexity: O(n), where n is the number of nodes in the binary tree.
Space Complexity: O(1), as it uses only a constant amount of extra space.

The time complexity is O(n) because each edge in the tree is traversed at most three times:
    1. When finding the predecessor
    2. When creating the temporary link
    3. When removing the temporary link

The space complexity is O(1) because we're not using any extra data structures that grow with 
the size of the input. We're only using a few variables to keep track of the current node, 
predecessor, and result list.
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def morris_inorder_traversal(root):
    result = []  # List to store the traversal result
    current = root  # Start with the root node
    
    while current:
        if not current.left:
            # Case 1: No left child
            # In in-order, we process the current node before moving to the right
            result.append(current.val)
            # Move to the right child
            current = current.right
        else:
            # Case 2: Left child exists
            # Find the rightmost node in the left subtree (inorder predecessor)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Case 2a: Predecessor's right is not pointing to current
                # This means we're visiting this node for the first time
                # Create a temporary link from predecessor to current
                predecessor.right = current
                # Move to the left child without processing the current node
                current = current.left
            else:
                # Case 2b: Predecessor's right is pointing to current
                # This means we're visiting this node for the second time
                # Remove the temporary link
                predecessor.right = None
                # In in-order, we process the current node after visiting its left subtree
                result.append(current.val)
                # Move to the right child
                current = current.right
    
    return result

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("In-order traversal:", morris_inorder_traversal(root))