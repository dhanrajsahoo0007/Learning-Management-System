"""
Problem Statement:
Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:
    1. Each of the digits 1-9 must occur exactly once in each row.
    2. Each of the digits 1-9 must occur exactly once in each column.
    3. Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.
    The '.' character indicates empty cells.

Time Complexity: O(9^(n*n)), where n is the size of the Sudoku grid (typically 9x9).
In the worst case, for each cell, we try all 9 digits, and we have n*n cells.

Space Complexity: O(n*n) for the recursive call stack.
The maximum depth of recursion can be n*n in the worst case when we need to fill all cells.

Explanation:
This solution uses a backtracking algorithm to solve the Sudoku puzzle:
    1. Find an empty cell (marked with '.').
    2. Try placing digits 1-9 in this cell.
    3. Check if the digit is valid in the current position.
    4. If valid, recursively try to fill the rest of the grid.
    5. If the recursive call is successful, we've solved the puzzle.
    6. If not, we undo the current cell and try the next digit.
    7. If no digit works, we return false to trigger backtracking.

The isValid function checks if a digit can be placed in a given cell by verifying the row, column, and 3x3 sub-box in a single pass.
"""

from typing import List

class SudokuSolver:
    """
    A class to solve Sudoku puzzles.

    This solver uses a backtracking algorithm to fill in the Sudoku grid.
    """

    def isValid(self, board: List[List[str]], row: int, col: int, c: str) -> bool:
        # Check if it's valid to place character c at board[row][col].

        for i in range(9):
            # Check row
            if board[i][col] == c:
                return False
            # Check column
            if board[row][i] == c:
                return False
            # Check 3x3 sub-box
            if board[3 * (row // 3) + i // 3][3 * (col // 3) + i % 3] == c:
                return False
        return True

    def solveSudoku(self, board: List[List[str]]) -> bool:
        # Solve the Sudoku puzzle using backtracking.
        
        for i in range(len(board)):
            for j in range(len(board[0])):
                if board[i][j] == ".":
                    for c in "123456789":
                        if self.isValid(board, i, j, c):
                            board[i][j] = c
                            if self.solveSudoku(board):
                                return True
                            else:
                                board[i][j] = "."  # Backtrack
                    return False  # Trigger backtracking
        return True  # All cells filled

if __name__ == "__main__":
    board = [
        ["9", "5", "7", ".", "1", "3", ".", "8", "4"],
        ["4", "8", "3", ".", "5", "7", "1", ".", "6"],
        [".", "1", "2", ".", "4", "9", "5", "3", "7"],
        ["1", "7", ".", "3", ".", "4", "9", ".", "2"],
        ["5", ".", "4", "9", "7", ".", "3", "6", "."],
        ["3", ".", "9", "5", ".", "8", "7", ".", "1"],
        ["8", "4", "5", "7", "9", ".", "6", "1", "3"],
        [".", "9", "1", ".", "3", "6", ".", "7", "5"],
        ["7", ".", "6", "1", "8", "5", "4", ".", "9"],
    ]
    
    SudokuSolver().solveSudoku(board)
    
    print("Solved Sudoku:")
    for i in range(9):
        for j in range(9):
            print(board[i][j], end=" ")
        print()