"""
Problem Statement:
Given the root of a binary search tree and a positive integer k, find the k-th largest element in the BST.

Time Complexity:
- BFS: O(k + log(n)), where n is the number of nodes in the tree
- DFS (Reverse Inorder): O(h + k), where h is the height of the tree
- Morris Traversal: O(n)

Space Complexity:
- BFS: O(log(n)), where n is the number of nodes in the tree (for the priority queue)
- DFS (Reverse Inorder): O(h), where h is the height of the tree (for the recursion stack)
- Morris Traversal: O(1)

Explanation:
1. BFS (Level Order Traversal):
   - Uses a priority queue (max-heap) to keep track of the largest elements
   - Utilizes BST properties to prune unnecessary branches
   - Efficient for both small and large k values

2. DFS (Reverse Inorder Traversal):
   - Utilizes BST property: reverse inorder traversal (right, root, left) gives nodes in descending order
   - Can stop early once the k-th element is found
   - Efficient for small k values

3. Morris Traversal:
   - Allows for reverse inorder traversal without using extra space
   - Temporarily modifies the tree structure, but restores it before completion
   - Constant space complexity, but may not be as efficient for small k values
"""

import heapq

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthLargest_BFS(self, root: TreeNode, k: int) -> int:
        if not root:
            return None
        
        # Use negative values to create a max-heap
        pq = [(-root.val, root)]
        
        while pq:
            val, node = heapq.heappop(pq)
            k -= 1
            
            if k == 0:
                return -val  # Convert back to positive
            
            if node.right:
                heapq.heappush(pq, (-node.right.val, node.right))
            if node.left:
                heapq.heappush(pq, (-node.left.val, node.left))
        
        return None  # k is larger than the number of nodes

    def kthLargest(self, root: TreeNode, k: int) -> int:
        class KthLargestFinder:
            def __init__(self):
                self.k = k
                self.result = None

            def reverse_inorder(self, node):
                if not node or self.result is not None:
                    return

                # Traverse right subtree
                self.reverse_inorder(node.right)

                # Process current node
                self.k -= 1
                if self.k == 0:
                    self.result = node.val
                    return

                # Traverse left subtree
                self.reverse_inorder(node.left)

        finder = KthLargestFinder()
        finder.reverse_inorder(root)
        return finder.result

    def kthLargest_Morris(self, root: TreeNode, k: int) -> int:
        current = root
        while current:
            if not current.right:
                k -= 1
                if k == 0:
                    return current.val
                current = current.left
            else:
                predecessor = current.right
                while predecessor.left and predecessor.left != current:
                    predecessor = predecessor.left
                
                if not predecessor.left:
                    predecessor.left = current
                    current = current.right
                else:
                    predecessor.left = None
                    k -= 1
                    if k == 0:
                        return current.val
                    current = current.left
        
        return None  # k is larger than the number of nodes

root = TreeNode(5)
root.left = TreeNode(3)
root.right = TreeNode(6)
root.left.left = TreeNode(2)
root.left.right = TreeNode(4)
root.right.right = TreeNode(7)

print("BST:")

solution = Solution()
for k in range(1, 8):
    print(f"\n{k}-th largest element:")
    print("BFS:  ", solution.kthLargest_BFS(root, k))
    print("DFS:  ", solution.kthLargest_DFS(root, k))
    print("Morris:", solution.kthLargest_Morris(root, k))