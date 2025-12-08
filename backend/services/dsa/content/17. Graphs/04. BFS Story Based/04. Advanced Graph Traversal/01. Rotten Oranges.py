"""
994. Rotting Oranges
Solved
Medium
Topics
Companies
You are given an m x n grid where each cell can have one of three values:

0 representing an empty cell,
1 representing a fresh orange, or
2 representing a rotten orange.
Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.

 

Example 1:


Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4
Example 2:

Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.
Example 3:

Input: grid = [[0,2]]
Output: 0
Explanation: Since there are already no fresh oranges at minute 0, the answer is just 0.
 

Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 10
grid[i][j] is 0, 1, or 2.    
"""

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        from collections import deque
        if not grid:
            return
        row_len = len(grid)
        col_len = len(grid[0])
        DIRECTIONS = [(-1, 0), (1, 0), (0, 1), (0, -1)]

        visited = [ [0 for j in range(col_len)] for i in range(row_len)]
        def rot_oranges_bfs(orange_queue):
            clock_time = 0
            while orange_queue:
                rx, ry, time = orange_queue.pop()
                grid[rx][ry] = 2
                for x_,y_ in DIRECTIONS:
                    nx = rx +x_
                    ny = ry + y_ 
                    if nx < 0 or ny <0 or nx >= row_len or ny >= col_len or visited[nx][ny] == 1 or grid[nx][ny] != 1:
                        continue
                    orange_queue.appendleft( (nx, ny, time+1) )
                    clock_time = max(time+1, clock_time)
                    visited[nx][ny] = 1
            return clock_time

        orange_queue = deque([])
        for row in range(row_len):
            for col in range(col_len):
                if grid[row][col] == 2:
                    orange_queue.appendleft( (row, col, 0))
                    visited[row][col] = 1
        num_minutes = rot_oranges_bfs(orange_queue)
        print(f" after rotting for {num_minutes} --> {grid}")
        for row in range(row_len):
            for col in range(col_len):
                if grid[row][col] == 1:
                    return -1
        return num_minutes
