
"""
130. Surrounded Regions
Solved
Medium
Topics
Companies
You are given an m x n matrix board containing letters 'X' and 'O', capture regions that are surrounded:

Connect: A cell is connected to adjacent cells horizontally or vertically.
Region: To form a region connect every 'O' cell.
Surround: The region is surrounded with 'X' cells if you can connect the region with 'X' cells and none of the region cells are on the edge of the board.
A surrounded region is captured by replacing all 'O's with 'X's in the input matrix board.

 

Example 1:

Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]

Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]

Explanation:


In the above diagram, the bottom region is not captured because it is on the edge of the board and cannot be surrounded.

Example 2:

Input: board = [["X"]]

Output: [["X"]]

 

Constraints:

m == board.length
n == board[i].length
1 <= m, n <= 200
board[i][j] is 'X' or 'O'.
"""


class Solution:
    def solve(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        if not board:
            return board
        row_len = len(board)
        col_len = len(board[0])
        DIRECTIONS = [ (1,0),(-1,0), (0,1), (0,-1) ]
        visited = [[0 for _ in range(col_len)] for _ in range(row_len)]

        # first traverse the boundary zeros and go dfs and mark its visited matrix
        def dfs(row, col):
            for x, y in DIRECTIONS:
                nrow = row + x
                ncol = col + y
                if nrow<0 or ncol<0 or nrow>=row_len or ncol>=col_len:
                    continue
                if board[nrow][ncol] == "X" or visited[nrow][ncol]:
                    continue
                visited[nrow][ncol] = 1
                dfs(nrow, ncol)
            return
        for row in range(row_len):
            for col in range(col_len):
                # print(row, col, visited[row][col], board[row][col])
                if ((col == 0 or col==col_len-1) or (row==0 or row==row_len-1)) and not visited[row][col] and board[row][col] =='O':
                   visited[row][col] = 1
                   dfs(row, col)

        for row in range(row_len):
            for col in range(col_len):
                if board[row][col] == "O" and not visited[row][col]:
                    board[row][col] = "X"
        return     