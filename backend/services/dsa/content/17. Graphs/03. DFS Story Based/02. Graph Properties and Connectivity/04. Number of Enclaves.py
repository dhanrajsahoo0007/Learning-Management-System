"""
1020. Number of Enclaves

    You are given an m x n binary matrix grid, where 0 represents a sea cell and 1 represents a land cell.

    A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid.

    Return the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.

 

Example 1:
    Input: grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]
    Output: 3
    Explanation: There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because its on the boundary.

Example 2:

    Input: grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]
    Output: 0
    Explanation: All 1s are either on the boundary or can reach the boundary.
    

Constraints:

    m == grid.length
    n == grid[i].length
    1 <= m, n <= 500
    grid[i][j] is either 0 or 1.
"""
class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        """
        DFS from the boundary 1's
        mark their paths as visited
        recheck the ones which are not visited and mark as not possible
        TC:
        """
        if not grid or not grid[0]:
            return grid
        row_len = len(grid)
        col_len = len(grid[0])
        DIRECTIONS = [ (1,0), (-1,0), (0,1),(0,-1) ]
        visited = [[0 for _ in range(col_len)] for _ in range(row_len)]
        def dfs(row, col):
            for x,y in DIRECTIONS:
                nrow = x + row
                ncol = y + col
                if nrow<0 or ncol<0 or nrow>=row_len or ncol>=col_len:
                    continue
                if grid[nrow][ncol] == 0 or visited[nrow][ncol] == 1:
                    continue
                visited[nrow][ncol] = 1
                dfs(nrow, ncol)
            return
        # Boundary 1's
        for row in range(row_len):
            for col in range(col_len):
                if ((row==0 or row==row_len-1) or ( col ==0 or col==col_len-1)) and grid[row][col] == 1 and visited[row][col] == 0:
                    visited[row][col] = 1
                    dfs(row, col)
        # Check the number of unvisited 1's 
        lands_surrounded = 0
        for row in range(row_len):
            for col in range(col_len):
                if grid[row][col] == 1 and visited[row][col]==0:
                    lands_surrounded += 1
        return lands_surrounded

