"""
Problem Statement:
    Given an m x n grid of characters board and a string word, return true if word exists in the grid.

    The word can be constructed from letters of sequentially adjacent cells, where adjacent cells 
    are horizontally or vertically neighboring. The same letter cell may not be used more than once.

    Space Complexity: O(L), where L is the length of the word
    Time Complexity: O(M * N * 3^L), where M and N are the dimensions of the board

Explanation:
    - Space Complexity is O(L) due to the recursion stack. In the worst case, we might 
      have to go L levels deep in the recursion.
    - Time Complexity: 
        * From every cell, we explore in 3 directions (avoiding the direction we came from).
        * This exploration can go for a maximum of L steps (word length).
        * So each exploration thread can go 3^L ways in the worst case.
        * We start this exploration from each cell of the M x N board.
        * Therefore, the total time complexity is O(M * N * 3^L).

Examples:

1. Input: board = [["A","B","C","E"],
                    ["S","F","C","S"],
                    ["A","D","E","E"]], word = "ABCCED"
   Output: true

2. Input: board = [["A","B","C","E"],
                    ["S","F","C","S"],
                    ["A","D","E","E"]], word = "SEE"
   Output: true

3. Input: board = [["A","B","C","E"],
                    ["S","F","C","S"],
                    ["A","D","E","E"]], word = "ABCB"
   Output: false


Example:
        Input: board = [["A","B","C","E"],
                        ["S","F","C","S"],
                        ["A","D","E","E"]], word = "ABCCED"
        Output: true

        Explanation: The word "ABCCED" can be found on the board:
        A B C E
        S F C S
        A D E E
"""

class Solution:
    def __init__(self):
        self.l = 0  # Length of the word
        self.m = 0  # Number of rows in the board
        self.n = 0  # Number of columns in the board
        self.directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]  # Right, Left, Down, Up

    def find(self, board, i, j, word, idx):
        # Base case: if we've matched all characters in the word
        if idx >= self.l:
            return True
        
        # Check if current position is out of bounds or doesn't match the current character
        if i < 0 or i >= self.m or j < 0 or j >= self.n or board[i][j] != word[idx]:
            return False
        
        # Mark the current cell as visited
        temp = board[i][j]
        board[i][j] = '$'
        
        # Recursively check all four directions
        for dir in self.directions:
            i_ = i + dir[0]
            j_ = j + dir[1]
            
            if self.find(board, i_, j_, word, idx+1):
                return True
        
        # Backtrack: restore the $ with the original character
        board[i][j] = temp
        return False

    def exist(self, board: list[list[str]], word: str) -> bool:
        self.m = len(board)
        self.n = len(board[0])
        self.l = len(word)
        
        # Quick check: if the board is smaller than the word, return False
        if self.m * self.n < self.l:
            return False
        
        # Check each cell in the board as a potential starting point
        # If we found the starting string then search for left , right, top and bottom to check for the subsequent characters
        for i in range(self.m):
            for j in range(self.n):
                if board[i][j] == word[0] and self.find(board, i, j, word, 0):
                    return True
        
        # Word not found
        return False

# Usage:
solution = Solution()
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
word = "ABCCED"
result = solution.exist(board, word)
print(result)  # Output: True