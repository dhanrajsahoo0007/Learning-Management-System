"""
Problem Statement: Unique Path III
    Find the number of unique paths that visit every empty cell exactly once.
    Given a m x n grid, where:
        - 0 represents empty cells that can be walked through
        - 1 represents the starting point
        - 2 represents the ending point
        - -1 represents obstacles
    Return the number of 4-directional walks from the starting point to the ending point, 
    that walk over every empty cell exactly once.

Args:
    grid (List[List[int]]): The m x n grid representing the maze.

Returns:
    int: The number of unique paths that visit every empty cell exactly once.

Time Complexity: O(3^(m*n)), where m and n are the dimensions of the grid.
    - In the worst case, we explore 3 new directions for each cell (excluding the direction we came from).
    - The depth of the recursion can go up to m*n in the worst case.

Space Complexity: O(m*n)
    - This is due to the recursion stack in the worst case scenario.

Example:
    Input: grid = [[1,0,0,0],
                  [0,0,0,0],
                  [0,0,2,-1]]
    Output: 2
    Explanation: We have the following two paths: 
        1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2)
        2. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2)
"""

class Solution:
    def __init__(self):
        self.m = 0  # Number of rows in the grid
        self.n = 0  # Number of columns in the grid
        self.empty_cells = 0  # Number of empty cells to visit
        self.result = 0  # Number of valid paths
        self.directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]  # Right, Left, Down, Up

    def dfs(self, grid: list[list[int]], curr_count: int, i: int, j: int) -> None:

        # Check if out of bounds or hit an obstacle
        if i < 0 or i >= self.m or j < 0 or j >= self.n or grid[i][j] == -1:
            return
        
        # Check if reached the end
        if grid[i][j] == 2:
            if curr_count == self.empty_cells:
                self.result += 1
            return
        
        # Mark current cell as visited
        grid[i][j] = -1
        
        # Explore all four directions
        for dx, dy in self.directions:
            self.dfs(grid, curr_count + 1, i + dx, j + dy)
        
        # Backtrack: restore the value to 0 
        grid[i][j] = 0

    def uniquePathsIII(self, grid: list[list[int]]) -> int:

        self.m, self.n = len(grid), len(grid[0])
        self.empty_cells = 0
        self.result = 0
        
        start_x, start_y = 0, 0
        
        # Count empty cells and find the starting point
        for i in range(self.m):
            for j in range(self.n):
                if grid[i][j] == 0:
                    self.empty_cells += 1
                elif grid[i][j] == 1:
                    start_x, start_y = i, j
        
        # Add 1 to include the starting cell
        self.empty_cells += 1
        
        self.dfs(grid, 0, start_x, start_y)
        
        return self.result

# Example usage:
solution = Solution()
grid = [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
result = solution.uniquePathsIII(grid)
print(result)  # Output: 2