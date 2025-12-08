"""
Problem: Swim in Rising Water

    You are given an n x n integer matrix grid where each value grid[i][j] represents the elevation at that point (i, j).
    The rain starts to fall. At time t, the depth of the water everywhere is t. You can swim from a square to another 
    4-directionally adjacent square if and only if the elevation of both squares individually are at most t. You can swim 
    infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.

    Return the least time until you can reach the bottom right square (n - 1, n - 1) if you start at the top left square (0, 0).

Example 1:
    Input: grid = [[0,2],[1,3]]
    Output: 3
    Explanation:
        At time 0, you are in grid location (0, 0).
        You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.
        You cannot reach point (1, 1) until time 3.
        When the depth of water is 3, we can swim anywhere inside the grid.

Example 2:
    Input: grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
    Output: 16
    Explanation: The final route is shown.
                 We need to wait until time 16 so that (0, 0) and (4, 4) are connected.

Constraints:
    * n == grid.length
    * n == grid[i].length
    * 1 <= n <= 50
    * 0 <= grid[i][j] < n^2
    * Each value grid[i][j] is unique.

Time Complexity: O(n^2 * log(n^2)), where n is the side length of the grid
Space Complexity: O(n^2) for the DSU structure

This solution uses a Disjoint Set Union (DSU) data structure and binary search to efficiently find the minimum time.
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
    def swimInWater(self, grid: list[list[int]]) -> int:
        n = len(grid)
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        def can_reach_bottom_right(t):
            dsu = DSU(n * n)
            for i in range(n):
                for j in range(n):
                    if grid[i][j] <= t:
                        for di, dj in directions:
                            ni, nj = i + di, j + dj
                            if 0 <= ni < n and 0 <= nj < n and grid[ni][nj] <= t:
                                dsu.union(i * n + j, ni * n + nj)
            return dsu.find(0) == dsu.find(n * n - 1)

        left, right = max(grid[0][0], grid[-1][-1]), n * n - 1
        while left < right:
            mid = (left + right) // 2
            if can_reach_bottom_right(mid):
                right = mid
            else:
                left = mid + 1
        return left

# Example usage
solution = Solution()

grid1 = [[0,2],[1,3]]
print(f"Example 1 Output: {solution.swimInWater(grid1)}")

grid2 = [
    [0,1,2,3,4],
    [24,23,22,21,5],
    [12,13,14,15,16],
    [11,17,18,19,20],
    [10,9,8,7,6]
]
print(f"Example 2 Output: {solution.swimInWater(grid2)}")