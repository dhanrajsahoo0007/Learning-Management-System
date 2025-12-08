"""
Problem: Lowest Common Ancestor of a Binary Tree III

    Given two nodes of a binary tree p and q, return their lowest common ancestor (LCA).
    Each node will have a reference to its parent node.

Example 1:
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4

Input: p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.

Example 2:
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4

Input: p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.

Example 3:
    1
   /
  2
Input: p = 1, q = 2
Output: 1

Constraints:
    * The number of nodes in the tree is in the range [2, 10^5].
    * -10^9 <= Node.val <= 10^9
    * All Node.val are unique.
    * p != q
    * p and q exist in the tree.

Time Complexity: O(h), where h is the height of the tree.
In the worst case, we might need to traverse from a leaf to the root.

Space Complexity: O(h), where h is the height of the tree.
We use a set to store seen, which in the worst case could contain all nodes from a leaf to the root.
"""


"""
Explanation of the approach1:

    1. We start by creating a set to store the seen of node p.
    2. We traverse from p up to the root, adding each node to the set.
        This is done by following the parent pointers until we reach a node with no parent (the root).
    3. Then, we start from q and traverse up towards the root.
        For each node we encounter, we check if it's in the set of p's seen.
    4. The first node we find that's in the set is the lowest common ancestor.
        This works because this node is the first common node in both paths from p and q to the root.
    5. If we reach the end of the loop without finding a common ancestor, we return None.
        However, this should never happen if p and q are guaranteed to be in the same tree.
"""

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.parent = None

class Solution:
    def lowestCommonAncestor1(self, p: 'Node', q: 'Node') -> 'Node':
        # Set to store seen of p
        seen = set()
        
        # Traverse from p to root, adding each node to the set
        while p:
            seen.add(p)
            p = p.parent
        
        # Traverse from q to root, checking if each node is in seen
        while q:
            if q in seen:
                return q
            q = q.parent
        
        # This line should never be reached if p and q are in the same tree
        return None
    """
    Explanation of the optimal approach:

    1. We start by creating copies of both input nodes (p_copy and q_copy).

    2. We then enter a loop that continues until p_copy and q_copy are the same node.

    3. In each iteration:
        - If p_copy is not null, we move it to its parent.
        - If p_copy is null (reached the root), we set it to q (the other input node).
        - We do the same for q_copy.

    4. This process continues until p_copy and q_copy meet at the same node, which is the LCA.
    """
    def lowestCommonAncestor2(self, p: 'Node', q: 'Node') -> 'Node':
        p_copy = p
        q_copy = q
        
        while p_copy != q_copy:
            # If p_copy reaches the root, move it to q
            # Otherwise, move it up to its parent
            p_copy = p_copy.parent if p_copy else q
            
            # If q_copy reaches the root, move it to p
            # Otherwise, move it up to its parent
            q_copy = q_copy.parent if q_copy else p
        
        return p_copy  # At this point, p_copy and q_copy are the same node (LCA)

# Helper function to create a tree for testing
def create_tree():
    nodes = [Node(i) for i in range(9)]  # Create nodes 0 to 8
    
    # Set up the tree structure
    nodes[3].left, nodes[3].right = nodes[5], nodes[1]
    nodes[5].left, nodes[5].right = nodes[6], nodes[2]
    nodes[2].left, nodes[2].right = nodes[7], nodes[4]
    nodes[1].left, nodes[1].right = nodes[0], nodes[8]
    
    # Set parent pointers
    nodes[5].parent = nodes[1].parent = nodes[3]
    nodes[6].parent = nodes[2].parent = nodes[5]
    nodes[7].parent = nodes[4].parent = nodes[2]
    nodes[0].parent = nodes[8].parent = nodes[1]
    
    return nodes

# Test the solution
if __name__ == "__main__":
    nodes = create_tree()
    solution = Solution()

    # Test case 1 (Example 1)
    lca = solution.lowestCommonAncestor1(nodes[5], nodes[1])
    print(f"LCA of 5 and 1: {lca.val}")  # Expected: 3

    # Test case 2 (Example 2)
    lca = solution.lowestCommonAncestor(nodes[5], nodes[4])
    print(f"LCA of 5 and 4: {lca.val}")  # Expected: 5

    # Test case 3 (Example 3-like)
    lca = solution.lowestCommonAncestor(nodes[3], nodes[6])
    print(f"LCA of 3 and 6: {lca.val}")  # Expected: 3
