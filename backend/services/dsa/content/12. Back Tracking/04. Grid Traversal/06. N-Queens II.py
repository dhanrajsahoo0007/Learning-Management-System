"""
Problem Statement:
    The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard 
    so that no two queens threaten each other. 
    This implementation both generates all possible solutions and counts the total number of solutions.

Time Complexity: O(N!), where N is the size of the board. 
In the worst case, we explore all possible configurations of queens on the board.

Space Complexity: O(N^2) for storing all solutions, and O(N) for the recursive call 
stack and the sets used to track occupied positions.

Explanation:
This solution uses a backtracking algorithm with optimizations:
    1. We use sets to keep track of occupied columns and diagonals, allowing for O(1) lookup.
    2. We represent diagonals using r+c for positive diagonals and r-c for negative diagonals.
    3. We build the board row by row, which eliminates the need to check for row conflicts.
    4. We generate all solutions and store them, while also keeping a count of total solutions.

Example:
For a 4x4 board (n=4), there are two distinct solutions:

Solution 1:   Solution 2:
.Q..          ..Q.
...Q          Q...
Q...          ...Q
..Q.          .Q..

The function would return these two solutions and report a count of 2.

"""

from typing import List

class Solution:
    def solveNQueens(self, n: int) -> tuple[List[List[str]], int]:
        # Sets to keep track of occupied columns and diagonals
        col = set()
        posDiag = set()  # (r + c)
        negDiag = set()  # (r - c)

        res = []
        board = [["."] * n for i in range(n)]
        count = 0  # Counter for total number of solutions

        def backtrack(r):
            if r == n:
                # If we've placed queens in all rows, we've found a valid configuration
                nonlocal count
                count += 1
                copy = ["".join(row) for row in board]
                res.append(copy)
                return

            for c in range(n):
                # Check if the current position is under attack
                # check in current column 
                # check in the positive diagonal and negative diagonal
                if c in col or (r + c) in posDiag or (r - c) in negDiag:
                    continue

                # Place the queen and update our sets
                col.add(c)
                posDiag.add(r + c)
                negDiag.add(r - c)
                board[r][c] = "Q"

                # Move to the next row
                backtrack(r + 1)

                # Backtrack: remove the queen and remove from our sets
                col.remove(c)
                posDiag.remove(r + c)
                negDiag.remove(r - c)
                board[r][c] = "."

        # Start the backtracking from the first row
        backtrack(0)
        return res, count

# Example usage
if __name__ == "__main__":
    solver = Solution()
    n = 4  # Solve for 4-Queens problem
    solutions, count = solver.solveNQueens(n)
    
    print(f"Found {count} solutions for {n}-Queens problem:")
    for i, sol in enumerate(solutions, 1):
        print(f"\nSolution {i}:")
        for row in sol:
            print(row)
