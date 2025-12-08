"""
Problem: Flatten Binary Tree to Linked List

    Given the root of a binary tree, flatten the tree into a "linked list":
        - The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null.
        - The "linked list" should be in the same order as a pre-order traversal of the binary tree.

Example:
Input:
    1                         
   / \                           
  2   5
 / \   \
3   4   6

Output:

    1 -> 2 -> 3 -> 4 -> 5 -> 6

Approaches:
    1. Iterative
    2. Recursive
    3. Morris Traversal
    4. Using Stack

Time Complexity: O(n) for all approaches, where n is the number of nodes in the tree.
Space Complexity: 
    - O(1) for iterative and Morris traversal
    - O(n) for recursive (due to call stack) and stack-based approaches
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

"""
Iterative Approach:
    This method iterates through the tree, rearranging pointers as it goes.
    For each node with a left child, it finds the rightmost node in the left subtree,
    makes it point to the current node's right child, then moves the left subtree to the right.

Time Complexity: O(n)
Space Complexity: O(1)
"""
def flatten_tree_iterative(root):
    current = root
    while current:
        if current.left:
            # Find the rightmost node in the left subtree
            rightmost = current.left
            while rightmost.right:
                rightmost = rightmost.right
            
            # Save the current right child
            next_right = current.right
            
            # Move the left subtree to the right
            current.right = current.left
            current.left = None  # Set left to None
            
            # Connect the old right subtree to the rightmost node of the new right subtree
            rightmost.right = next_right
        
        # Move to the next node
        current = current.right

"""
Recursive Approach:
This method uses recursion to flatten the left and right subtrees,
then connects them in the correct order.

Time Complexity: O(n)
Space Complexity: O(n) due to the call stack
"""
def flatten_tree_recursive(root):
    def flatten_helper(node):
        # Base case: if node is None or a leaf node
        if not node or (not node.left and not node.right):
            return node
        
        # Recursively flatten left and right subtrees
        left_tail = flatten_helper(node.left)
        right_tail = flatten_helper(node.right)
        
        # If there was a left subtree
        if left_tail:
            # Move the left subtree to the right
            left_tail.right = node.right
            node.right = node.left
            node.left = None
        
        # Return the rightmost node of the flattened subtree
        return right_tail if right_tail else left_tail
    
    flatten_helper(root)
"""
Stack-based Approach:
    This method uses a stack to perform a pre-order traversal while flattening the tree.
    It pushes nodes onto the stack in reverse order of desired traversal.

Time Complexity: O(n)
Space Complexity: O(n) due to the stack
"""
def flatten_tree_stack(root):
    if not root:
        return
    
    stack = [root]
    prev = None
    
    while stack:
        current = stack.pop()
        
        # Connect the previous node to the current one
        if prev:
            prev.right = current
            prev.left = None
        
        # Push right child first so it's processed after the left
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)
        
        # Update the previous node
        prev = current


"""
Morris Traversal Approach:
    This method uses a modification of Morris traversal to flatten the tree in-place.
    It creates temporary links to enable traversal without recursion or a stack.

Time Complexity: O(n)
Space Complexity: O(1)
"""
def flatten_tree_morris(root):
    current = root
    while current:
        if current.left:
            # Find the rightmost node in the left subtree
            predecessor = current.left
            # Go the at most right element in the left side 
            while predecessor.right:
                predecessor = predecessor.right
            
            # Create a temporary link and rearrange pointers
            # predecessor.right = current.right
            # current.right = current.left
            # current.left = None

            # 1. Create a temporary link from the predecessor to the current node's right child.
            #    This allows us to "remember" where to connect the flattened left subtree later.
            predecessor.right = current.right
            
            # 2. Move the entire left subtree to be the right child of the current node.
            #    This is a key step in flattening the tree, as we're essentially rotating
            #    the left subtree to the right.
            current.right = current.left
            
            # 3. Set the left child to None, as in a flattened tree, all left pointers are null.
            #    This completes the flattening process for the current node.
            current.left = None
            
        else:
            # If no left child, move to the right
            current = current.right


# Helper function to create a linked list representation of the flattened tree
def tree_to_list(root):
    result = []
    while root:
        result.append(root.val)
        root = root.right
    return result

# Test the functions
if __name__ == "__main__":
    def create_test_tree():
        root = TreeNode(1)
        root.left = TreeNode(2)
        root.right = TreeNode(5)
        root.left.left = TreeNode(3)
        root.left.right = TreeNode(4)
        root.right.right = TreeNode(6)
        return root

    # Test iterative approach
    root = create_test_tree()
    flatten_tree_iterative(root)
    print("Iterative result:", tree_to_list(root))

    # Test recursive approach
    root = create_test_tree()
    flatten_tree_recursive(root)
    print("Recursive result:", tree_to_list(root))

    # Test Morris traversal approach
    root = create_test_tree()
    flatten_tree_morris(root)
    print("Morris traversal result:", tree_to_list(root))

    # Test stack-based approach
    root = create_test_tree()
    flatten_tree_stack(root)
    print("Stack-based result:", tree_to_list(root))