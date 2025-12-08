"""
1254. Number of Closed Islands

    Given a 2D grid consists of 0s (land) and 1s (water).  An island is a maximal 4-directionally connected group of 0s and a closed island is an island totally (all left, top, right, bottom) surrounded by 1s.

    Return the number of closed islands.


Example 1:
    Input: grid = [[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]
    Output: 2
    Explanation: 
    Islands in gray are closed because they are completely surrounded by water (group of 1s).

Example 2:
    Input: grid = [[0,0,1,0,0],[0,1,0,1,0],[0,1,1,1,0]]
    Output: 1

Example 3:
    Input: grid = [[1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1],
                [1,0,1,1,1,0,1],
                [1,0,1,0,1,0,1],
                [1,0,1,1,1,0,1],
                [1,0,0,0,0,0,1],
                [1,1,1,1,1,1,1]]
    Output: 2
 

Constraints:

1 <= grid.length, grid[0].length <= 100
0 <= grid[i][j] <=1

"""

class Solution:
    def closedIsland(self, grid: List[List[int]]) -> int:
        """
        Find all the lands and check if they are 
        1. check if they surrounded by water in all sides
        2. if they connected to boundary they are not valid
        """
        if not grid or not grid[0]:
            return grid
        
        row_len = len(grid)
        col_len = len(grid[0])
        DIRECTIONS = [(1,0), (-1,0), (0, -1), (0, 1)]

        visited = [[0 for _ in range(col_len)] for _ in  range(row_len) ]

        def dfs(row, col) -> bool:
            if row < 0 or col < 0  or row >= row_len or col >= col_len:
                return False
            # Did not understand
            if grid[row][col] == 1 or visited[row][col] == 1:
                return True
            visited[row][col] = 1
            is_closed = True
            for x,y in DIRECTIONS:
                nrow = row+x
                ncol = col+y
                is_closed &= dfs(nrow, ncol)
            return is_closed
        closed_islands = 0
        for row in range(row_len):
            for col in range(col_len):
                if grid[row][col] == 0 and not visited[row][col]:
                    if dfs(row, col):
                        closed_islands += 1
        return closed_islands
