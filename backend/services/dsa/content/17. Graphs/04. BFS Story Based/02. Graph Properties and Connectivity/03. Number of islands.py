"""
200. Number of Islands
Solved
Medium
Topics
Companies
Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

 

Example 1:

Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
Example 2:

Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
 

Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 300
grid[i][j] is '0' or '1'.
"""


class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0

        from collections import deque

        row_count = len(grid)
        col_count = len(grid[0])
        DIRECTIONS = [[0,1], [0,-1], [-1, 0], [1, 0]]
        q = deque([])

        def bfs(q, grid: List[List[int]]):
            while q:
                x,y = q.popleft()
                for dx, dy in DIRECTIONS:
                    nx = x+dx  
                    ny = y+dy
                    if nx < 0 or nx >=row_count or ny<0 or ny>= col_count or grid[nx][ny] == "0" :
                        continue
                    grid[nx][ny] = "0"
                    q.append((nx,ny))
            return
           
        island_count = 0
        for x in range(row_count):
            for y in range(col_count):
                if grid[x][y] == "0":
                    continue
                grid[x][y] = "0"
                q.append((x,y))
                bfs(q, grid)
                island_count += 1
        return island_count