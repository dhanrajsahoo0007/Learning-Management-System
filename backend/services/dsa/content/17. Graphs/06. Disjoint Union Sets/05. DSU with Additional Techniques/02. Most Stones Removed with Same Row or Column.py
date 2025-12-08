"""
Problem: Most Stones Removed with Same Row or Column

    On a 2D plane, we place n stones at some integer coordinate points. Each coordinate point may have at most one stone.
    A stone can be removed if it shares either the same row or the same column as another stone that has not been removed.
    Given an array stones of length n where stones[i] = [xi, yi] represents the location of the ith stone, return the largest possible number of stones that can be removed.

Time Complexity: O(n^2 * α(n)), where α(n) is the inverse Ackermann function
    - The nested loops for union operations contribute O(n^2)
    - Each union operation takes O(α(n)) amortized time

Space Complexity: O(n)
    - We use two lists (parent and rank) of size n

Note: The time complexity could be optimized to O(n * α(n)) by using a different approach to group stones,
but this implementation follows the original C++ code's approach.
"""

class Solution:
    def __init__(self):
        self.parent = []
        self.rank = []
        self.n = 0

    def find(self, i):
        # Find operation with path compression
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        # Union operation
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i != root_j:
            if self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            elif self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1

    def removeStones(self, stones: list[list[int]]) -> int:
        self.n = len(stones)
        self.parent = list(range(self.n))
        self.rank = [1] * self.n

        # Group stones that share the same row or column
        for i in range(self.n):
            for j in range(i + 1, self.n):
                if stones[i][0] == stones[j][0] or stones[i][1] == stones[j][1]:
                    self.union(i, j)

        # Count the number of distinct groups
        groups = sum(1 for i in range(self.n) if self.parent[i] == i)

        # The maximum number of stones that can be removed is the total number of stones
        # minus the number of groups (as we need to leave one stone per group)
        return self.n - groups

# Example usage
solution = Solution()
stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]
result = solution.removeStones(stones)
print(f"Maximum number of stones that can be removed: {result}")