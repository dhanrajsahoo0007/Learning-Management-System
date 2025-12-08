"""
Problem Statement:
Given the root of a binary search tree and a positive integer k, find the k-th smallest element in the BST.

Time Complexity:
    - BFS: O(k + log(n)), where n is the number of nodes in the tree
    - DFS (Inorder): O(h + k), where h is the height of the tree
    - Morris Traversal: O(n)

Space Complexity:
    - BFS: O(log(n)), where n is the number of nodes in the tree (for the queue)
    - DFS (Inorder): O(h), where h is the height of the tree (for the recursion stack)
    - Morris Traversal: O(1)

Explanation:
1. BFS (Level Order Traversal):
   - Uses a priority queue to keep track of the smallest elements
   - Utilizes BST properties to prune unnecessary branches
   - Efficient for both small and large k values

2. DFS (Inorder Traversal):
   - Utilizes BST property: inorder traversal gives nodes in ascending order
   - Can stop early once the k-th element is found
   - Efficient for small k values

3. Morris Traversal:
   - Allows for inorder traversal without using extra space
   - Temporarily modifies the tree structure, but restores it before completion
   - Constant space complexity, but may not be as efficient for small k values
"""

from collections import deque
import heapq

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest_BFS(self, root: TreeNode, k: int) -> int:
        # Edge case: empty tree
        if not root:
            return None
        
        # Initialize priority queue for BFS
        pq = [(root.val, root)]
        
        while pq:
            val, node = heapq.heappop(pq)
            k -= 1
            
            if k == 0:
                return val
            
            if node.left:
                heapq.heappush(pq, (node.left.val, node.left))
            if node.right:
                heapq.heappush(pq, (node.right.val, node.right))
        
        return None  # k is larger than the number of nodes

    def kthSmallest_DFS(self, root: TreeNode, k: int) -> int:
        class KthSmallestFinder:
            def __init__(self):
                self.k = k
                self.result = None

            def inorder(self, node):
                if not node or self.result is not None:
                    return

                # Traverse left subtree
                self.inorder(node.left)

                # Process current node
                self.k -= 1
                if self.k == 0:
                    self.result = node.val
                    return

                # Traverse right subtree
                self.inorder(node.right)

        finder = KthSmallestFinder()
        finder.inorder(root)
        return finder.result

    def kthSmallest_Morris(self, root: TreeNode, k: int) -> int:
        current = root
        while current:
            if not current.left:
                # Process current node
                k -= 1
                if k == 0:
                    return current.val
                current = current.right
            else:
                # Find the inorder predecessor
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right
                
                if not predecessor.right:
                    # Create temporary link
                    predecessor.right = current
                    current = current.left
                else:
                    # Remove temporary link
                    predecessor.right = None
                    # Process current node
                    k -= 1
                    if k == 0:
                        return current.val
                    current = current.right
        
        return None  # k is larger than the number of nodes
    

root = TreeNode(5)
root.left = TreeNode(3)
root.right = TreeNode(6)
root.left.left = TreeNode(2)
root.left.right = TreeNode(4)
root.left.left.left = TreeNode(1)

print("BST:")
solution = Solution()
for k in range(1, 7):
    print(f"\n{k}-th smallest element:")
    print("BFS:  ", solution.kthSmallest_BFS(root, k))
    print("DFS:  ", solution.kthSmallest_DFS(root, k))
    print("Morris:", solution.kthSmallest_Morris(root, k))