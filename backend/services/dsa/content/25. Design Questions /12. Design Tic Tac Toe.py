"""
12.Design Tic Tac Toe
Implement a Tic-Tac-Toe game on an n x n board where a player wins by placing K consecutive marks ('X' or 'O') in a row, column, or diagonal. The solution should effectively determine a winner under these conditions and handle the complexity of diagonal winning scenarios.
Input:
n: The size of the board (n x n), where n is a positive integer.
K: The number of consecutive marks needed to win. K can be less than or equal to n.
Moves: A list of moves in the format (player, row, column) indicating the player ('X' or 'O') and the zero-indexed position of the placed mark.
Output:
Winner: Return 'X' or 'O' if a player has won. If no player has won after a move, return None.
Constraints:
3 ≤ n ≤ 100
3 ≤ K ≤ n
Players take turns to place their marks; no position can be played twice.
The game stops as soon as a player wins.
Example Test Cases:
Test Case 1:
Input:
n = 5, K = 4
Moves: [(X, 0, 0), (O, 1, 0), (X, 0, 1), (O, 1, 1), (X, 0, 2), (O, 1, 2), (X, 0, 3)]
Output:
'X'
Explanation:
Player 'X' wins by placing four consecutive marks in the first row.
Test Case 2:
Input:
n = 5, K = 3
Moves: [(X, 0, 0), (O, 1, 0), (X, 2, 2), (O, 1, 1), (X, 3, 3), (O, 1, 2)]
Output:
'O'
Explanation:
Player 'O' wins by placing three consecutive marks in the second row.
Test Case 3:
Input:
n = 7, K = 5
Moves: [(X, 0, 1), (O, 1, 1), (X, 1, 0), (O, 2, 2), (X, 2, 1), (O, 3, 3), (X, 3, 2), (O, 4, 4), (X, 4, 3), (O, 5, 5), (X, 5, 4)]
Output:
None
Explanation:
No player has won yet with five consecutive marks.
Complex Test Cases for Diagonal Win Conditions:
Test Case 4:
Input:
n = 10, K = 5
Moves: [(X, 0, 0), (O, 1, 1), (X, 1, 1), (O, 2, 2), (X, 2, 2), (O, 3, 3), (X, 3, 3), (O, 4, 4), (X, 4, 4)]
Output:
'X'
Explanation:
Player 'X' wins with a diagonal from (0, 0) to (4, 4).
Test Case 5:
Input:
n = 15, K = 5
Moves: [(X, 14, 0), (O, 0, 14), (X, 13, 1), (O, 1, 13), (X, 12, 2), (O, 2, 12), (X, 11, 3), (O, 3, 11), (X, 10, 4), (O, 4, 10)]
Output:
'X'
Explanation:
Player 'X' wins with a diagonal from (14, 0) to (10, 4).
"""