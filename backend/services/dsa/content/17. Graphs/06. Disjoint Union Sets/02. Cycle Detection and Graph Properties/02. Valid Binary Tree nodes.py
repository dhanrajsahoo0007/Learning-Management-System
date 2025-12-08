"""
Problem: Validate Binary Tree Nodes

    You have n binary tree nodes numbered from 0 to n - 1 where node i has two children leftChild[i] and rightChild[i], 
    return true if and only if all the given nodes form exactly one valid binary tree.
    If node i has no left child then leftChild[i] will equal -1, similarly for the right child.

    Note that the nodes have no values and that we only use the node numbers in this problem.

Time Complexity: O(n * α(n)), where n is the number of nodes and α is the inverse Ackermann function
Space Complexity: O(n) for the parent array

This solution uses a Disjoint Set Union (DSU) data structure with path compression.
"""

class Solution:
    def __init__(self):
        self.parent = []
        self.components = 0

    def find(self, x):
        if self.parent[x] == x:
            return x
        self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
 
    def union(self, par, child):
        child_ka_parent = self.find(child)

        # Child already has a parent
        if child_ka_parent != child:
            return False

        parent_ka_parent = self.find(par)
        # Parallel edge (already connected by another edge)
        if parent_ka_parent == child_ka_parent:
            return False

        self.parent[child] = par
        self.components -= 1
        return True

    def validateBinaryTreeNodes(self, n: int, leftChild: list[int], rightChild: list[int]) -> bool:
        self.components = n
        self.parent = list(range(n))

        for i in range(n):
            if leftChild[i] >= 0 and not self.union(i, leftChild[i]):
                return False
            if rightChild[i] >= 0 and not self.union(i, rightChild[i]):
                return False

        return self.components == 1

# Example usage
solution = Solution()
n = 4
leftChild = [1, -1, 3, -1]
rightChild = [2, -1, -1, -1]
result = solution.validateBinaryTreeNodes(n, leftChild, rightChild)
print(f"Is the given structure a valid binary tree? {result}")