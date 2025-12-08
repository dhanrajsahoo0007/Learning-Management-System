"""
Find the maximum amount of gold you can collect from the grid.

Problem Statement:
    In a gold mine grid of size m x n, each cell in this mine has an integer representing
    the amount of gold in that cell, 0 if it is empty. 
    Return the maximum amount of gold you can collect ,
    under the following conditions:
        - Every time you are located in a cell you will collect all the gold in that cell.
        - From your position, you can walk one step to the left, right, up, or down.
        - You can't visit the same cell more than once.
        - Never visit a cell with 0 gold.
        - You can start and stop collecting gold from any position in the grid that has some gold.

Returns:
    int: The maximum amount of gold that can be collected.

Time Complexity: O(4^k), where k is the number of cells with gold.
    - In the worst case, we explore 4 directions for each cell with gold.

Space Complexity: O(k), where k is the number of cells with gold.
    - This is due to the recursion stack in the worst case.

Example:
    Input: grid = [ [0,6,0],
                    [5,8,7],
                    [0,9,0]]
    Output: 24
    Explanation: Path to get the maximum gold, 9 -> 8 -> 7.
"""


class Solution:
    def __init__(self):
        self.m = 0  # Number of rows in the grid
        self.n = 0  # Number of columns in the grid
        self.directions = [(-1, 0), (1, 0), (0, 1), (0, -1)]  # Up, Down, Right, Left

    def dfs(self, grid: list[list[int]], i: int, j: int) -> int:
        # Check if out of bounds or no gold
        if i >= self.m or i < 0 or j >= self.n or j < 0 or grid[i][j] == 0:
            return 0  # Zero gold
        
        # Store original gold value and mark as visited
        original_gold_value = grid[i][j]
        grid[i][j] = 0
        
        max_gold = 0
        # Explore all four directions
        for di, dj in self.directions:
            new_i, new_j = i + di, j + dj
            max_gold = max(max_gold, self.dfs(grid, new_i, new_j))
        
        # Backtrack: restore original gold value
        grid[i][j] = original_gold_value
        
        return original_gold_value + max_gold

    def getMaximumGold(self, grid: list[list[int]]) -> int:
        
        self.m, self.n = len(grid), len(grid[0])
        max_gold = 0
        
        # Try starting from each cell with gold
        for i in range(self.m):
            for j in range(self.n):
                if grid[i][j] != 0:
                    max_gold = max(max_gold, self.dfs(grid, i, j))
        
        return max_gold

# Example usage:
solution = Solution()
grid = [[0,6,0],[5,8,7],[0,9,0]]
result = solution.getMaximumGold(grid)
print(result)  # Output: 24