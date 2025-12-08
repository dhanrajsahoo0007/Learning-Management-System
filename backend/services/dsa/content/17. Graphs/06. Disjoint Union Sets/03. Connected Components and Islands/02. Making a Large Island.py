"""
Problem: Making A Large Island

    You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1.
    Return the size of the largest island in grid after applying this operation.
    An island is a 4-directionally connected group of 1s.

Example 1:
    Input: grid = [[1,0],[0,1]]
    Output: 3
    Explanation: Change one 0 to 1 and connect two 1s, then we get an island with area = 3.

Example 2:
    Input: grid = [[1,1],[1,0]]
    Output: 4
    Explanation: Change the 0 to 1 and make the island bigger, only one island with area = 4.

Example 3:
    Input: grid = [[1,1],[1,1]]
    Output: 4
    Explanation: Can't change any 0 to 1, only one island with area = 4.

Constraints:
    * n == grid.length
    * n == grid[i].length
    * 1 <= n <= 500
    * grid[i][j] is either 0 or 1.

Time Complexity: O(n^2), where n is the side length of the grid
Space Complexity: O(n^2) for the DSU structure

This solution uses a Disjoint Set Union (DSU) data structure to efficiently connect and measure islands.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.number_of_components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_parent, y_parent = self.find(x), self.find(y)
        if x_parent == y_parent:
            return

        if self.size[x_parent] > self.size[y_parent]:
            self.parent[y_parent] = x_parent
            self.size[x_parent] += self.size[y_parent]
        else:
            self.parent[x_parent] = y_parent
            self.size[y_parent] += self.size[x_parent]

        self.number_of_components -= 1

class Solution:
    def largestIsland(self, grid: list[list[int]]) -> int:
        n = len(grid)
        dsu = DSU(n * n)
        
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        def is_valid(x, y):
            return 0 <= x < n and 0 <= y < n
        
        # Step 1: Connect all existing islands
        for i in range(n):
            for j in range(n):
                if grid[i][j] == 1:
                    for dx, dy in directions:
                        ni, nj = i + dx, j + dy
                        if is_valid(ni, nj) and grid[ni][nj] == 1:
                            dsu.union(i * n + j, ni * n + nj)
        
        # Step 2: Try changing each 0 to 1 and check the size of the resulting island
        max_size = max(dsu.size)  # Initialize with the largest existing island
        
        for i in range(n):
            for j in range(n):
                if grid[i][j] == 0:
                    neighbor_parents = set()
                    for dx, dy in directions:
                        ni, nj = i + dx, j + dy
                        if is_valid(ni, nj) and grid[ni][nj] == 1:
                            neighbor_parents.add(dsu.find(ni * n + nj))
                    
                    size = 1  # Start with the cell we're changing
                    for parent in neighbor_parents:
                        size += dsu.size[parent]
                    
                    max_size = max(max_size, size)
        
        return max_size

# Example usage
solution = Solution()

grid1 = [[1,0],[0,1]]
print(f"Example 1 Output: {solution.largestIsland(grid1)}")

grid2 = [[1,1],[1,0]]
print(f"Example 2 Output: {solution.largestIsland(grid2)}")

grid3 = [[1,1],[1,1]]
print(f"Example 3 Output: {solution.largestIsland(grid3)}")