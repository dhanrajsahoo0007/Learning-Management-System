"""
Problem Statement: N Queens
    The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard 
    so that no two queens threaten each other. Thus, a solution requires that no two 
    queens share the same row, column, or diagonal.

Time Complexity: O(N!), where N is the size of the board. 
    In the worst case, we explore all possible configurations of queens on the board.

Space Complexity: O(N) for the recursive call stack and the sets used to track 
    occupied positions. The board itself also takes O(N^2) space, but this is dominated 
    by O(N!) for large N when considering the space needed to store all solutions.

Explanation:
This solution uses a backtracking algorithm with some optimizations:
    1. We use sets to keep track of occupied columns and diagonals, allowing for O(1) lookup.
    2. We represent diagonals using r+c for positive diagonals and r-c for negative diagonals.
    3. We build the board row by row, which eliminates the need to check for row conflicts.
    4. When a valid configuration is found, we convert it to the required string format and add it to our results.

Example:
For a 4x4 board, one solution might be:
    .Q..  # Queen in the second column of the first row
    ...Q  # Queen in the fourth column of the second row
    Q...  # Queen in the first column of the third row
    ..Q.  # Queen in the third column of the fourth row


Additional Notes:
    1. The use of sets (col, posDiag, negDiag) allows for O(1) time complexity when 
        checking if a position is under attack, which is a significant optimization.

    2. The representation of diagonals is clever:
        - For positive diagonals (↘), r+c is constant for each diagonal.
        - For negative diagonals (↙), r-c is constant for each diagonal.

    3. By building the solution row by row, we eliminate the need to check for row conflicts,
        as we know we're only placing one queen per row.

    4. The backtracking approach allows us to efficiently explore the solution space
        without explicitly trying every possible configuration.

    5. This solution finds all possible configurations, which is why we store them in 
        the 'res' list and return all of them at the end.
"""

from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        # Sets to keep track of occupied columns and diagonals
        col = set()
        posDiag = set()  # (r + c)
        negDiag = set()  # (r - c)

        res = []
        board = [["."] * n for i in range(n)]

        def backtrack(r):
            if r == n:
                # If we've placed queens in all rows, we've found a valid configuration
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
        return res

# Example usage
if __name__ == "__main__":
    solver = Solution()
    n = 4  # Solve for 4-Queens problem
    solutions = solver.solveNQueens(n)
    
    print(f"Found {len(solutions)} solutions for {n}-Queens problem:")
    for i, sol in enumerate(solutions, 1):
        print(f"\nSolution {i}:")
        for row in sol:
            print(row)

