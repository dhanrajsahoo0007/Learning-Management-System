"""
Problem: Balance a Binary Search Tree
    Same problem is : Convert Sorted Array to Balanced Binary Search Tree (inorder traversal is not required)

    Given the root of a binary search tree, return a balanced binary search tree with the same node values. 
    If there is more than one answer, return any of them.

A binary search tree is balanced if the depth of the two subtrees of every node never differs by more than 1.

Approach:
    1. Perform an in-order traversal of the BST to get a sorted list of node values.
    2. Use the sorted list to construct a new balanced BST.

Time Complexity: O(n), where n is the number of nodes in the tree.
Space Complexity: O(n) for the list and the recursion stack.

Visual representation of the binary tree before balancing:

      4
    /   \
   2     6
  / \     \
 1   3     7
             \
              9

Visual representation of the binary tree after balancing:

       4
    /     \
   2       7
  / \     / \
 1   3   6   9
"""

class TreeNode:
    def __init__(self, value=0, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

class BSTBalancer:
    def balance_bst(self, root: TreeNode) -> TreeNode:
        """
        Main method to balance the given Binary Search Tree.
        """
        sorted_values = []
        # Step 1: Perform in-order traversal to get sorted list of values
        self.inorder_traversal(root, sorted_values)
        # Step 2: Construct a balanced BST from the sorted list
        return self.construct_balanced_bst(sorted_values, 0, len(sorted_values) - 1)

    def inorder_traversal(self, node: TreeNode, values: list) -> None:
        """
        Perform an in-order traversal of the tree, storing values in the given list.
        """
        if not node:
            return
        
        self.inorder_traversal(node.left, values)
        values.append(node.value)
        self.inorder_traversal(node.right, values)
    
    def construct_balanced_bst(self, sorted_values: list, start: int, end: int) -> TreeNode:
        """
        Construct a balanced BST from the sorted list of values.
        """
        # Base case: if start > end, return None (empty subtree)
        if start > end:
            return None
         # Find the middle element to use as the root
        mid = (start + end) // 2
        root = TreeNode(sorted_values[mid])

        # Recursively construct left and right subtrees
        # Left subtree uses values before mid
        root.left = self.construct_balanced_bst(sorted_values, start, mid - 1)
        # Right subtree uses values after mid
        root.right = self.construct_balanced_bst(sorted_values, mid + 1, end)
        
        return root

def print_inorder(node: TreeNode) -> None:
    """Helper function to print the tree in-order."""
    if not node:
        return
    print_inorder(node.left)
    print(node.value, end=' ')
    print_inorder(node.right)

# Example usage
if __name__ == "__main__":
    # Construct an unbalanced BST
    root = TreeNode(4)
    root.left = TreeNode(2)
    root.right = TreeNode(6)
    root.left.left = TreeNode(1)
    root.left.right = TreeNode(3)
    root.right.right = TreeNode(7)
    root.right.right.right = TreeNode(9)

    print("Original BST:")
    print_inorder(root)
    print()

    balancer = BSTBalancer()
    balanced_root = balancer.balance_bst(root)

    print("\nBalanced BST:")
    print_inorder(balanced_root)
    print()