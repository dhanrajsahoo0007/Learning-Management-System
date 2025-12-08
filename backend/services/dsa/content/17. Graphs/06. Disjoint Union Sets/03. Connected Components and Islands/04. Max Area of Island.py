"""
Problem: Maximum Area of Island

    You are given an m x n binary matrix grid. An island is a group of 1's (representing land) connected 4-directionally (horizontal or vertical.) 
    You may assume all four edges of the grid are surrounded by water.

    The area of an island is the number of cells with a value 1 in the island.

    Return the maximum area of an island in grid. If there is no island, return 0.

Time Complexity: O(m * n * α(m*n)), where m and n are the dimensions of the grid,
                 and α is the inverse Ackermann function (nearly constant in practice)

Space Complexity: O(m * n) for the DSU data structure

Note: This solution uses a Disjoint Set Union (DSU) data structure with both
      path compression and union by size optimizations.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        # Find operation with path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union operation with union by size
        x_parent = self.find(x)
        y_parent = self.find(y)

        if x_parent == y_parent:
            return self.size[x_parent]

        if self.size[x_parent] > self.size[y_parent]:
            self.parent[y_parent] = x_parent
            self.size[x_parent] += self.size[y_parent]
            return self.size[x_parent]
        else:
            self.parent[x_parent] = y_parent
            self.size[y_parent] += self.size[x_parent]
            return self.size[y_parent]

class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dsu = DSU(m * n)
        result = 0
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        def is_safe(x, y):
            return 0 <= x < m and 0 <= y < n and grid[x][y] == 1

        def link(i, j):
            index = i * n + j
            size = dsu.size[dsu.find(index)]

            for di, dj in directions:
                x, y = i + di, j + dj
                if is_safe(x, y):
                    size = max(size, dsu.union(index, x * n + y))

            return size

        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    grid[i][j] = 0  # Mark as visited
                    result = max(result, link(i, j))

        return result

# Example usage
solution = Solution()
grid = [
    [0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,1,1,0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,1,0,0,1,0,1,0,0],
    [0,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0]
]
result = solution.maxAreaOfIsland(grid)
print(f"Maximum area of island: {result}")