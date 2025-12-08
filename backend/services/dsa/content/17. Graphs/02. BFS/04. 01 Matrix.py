"""
542. 01 Matrix
Solved
Medium
Topics
Companies
Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell.

The distance between two adjacent cells is 1.

 

Example 1:


Input: mat = [[0,0,0],[0,1,0],[0,0,0]]
Output: [[0,0,0],[0,1,0],[0,0,0]]
Example 2:


Input: mat = [[0,0,0],[0,1,0],[1,1,1]]
Output: [[0,0,0],[0,1,0],[1,2,1]]
 

Constraints:

m == mat.length
n == mat[i].length
1 <= m, n <= 104
1 <= m * n <= 104
mat[i][j] is either 0 or 1.
There is at least one 0 in mat.
"""


class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        """
        start from the zeros and find their distance to one.
        TC: O(mn)
        """
        from collections import deque
        if not mat:
            return mat
        row_len = len(mat)
        col_len = len(mat[0])
        DIRECTIONS = [ (-1, 0), (1,0), (0,1), (0,-1) ]

        distance = [ [-1 for _ in range(col_len)] for _ in range(row_len) ]
        node_queue = deque([])

        def bfs():
            while node_queue:
                row, col, dist_from_0 = node_queue.pop()
                for x,y in DIRECTIONS:
                    nrow = row + x
                    ncol = col + y
                    if nrow < 0 or ncol < 0 or nrow >= row_len or ncol>=col_len:
                        continue
                    if distance[nrow][ncol] != -1:
                        continue
                    node_queue.appendleft( (nrow, ncol, dist_from_0 + 1))
                    distance[nrow][ncol] = dist_from_0 + 1

        for row in range(row_len):
            for col in range(col_len):
                if mat[row][col] == 0:
                    node_queue.appendleft((row, col, 0))
                    distance[row][col] = 0
        bfs()
        return distance

