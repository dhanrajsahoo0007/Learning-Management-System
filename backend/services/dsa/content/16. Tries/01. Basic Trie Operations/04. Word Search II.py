"""
212. Word Search II
Hard

Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

 

Example 1:


Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
Example 2:


Input: board = [["a","b"],["c","d"]], words = ["abcb"]
Output: []
 

Constraints:

m == board.length
n == board[i].length
1 <= m, n <= 12
board[i][j] is a lowercase English letter.
1 <= words.length <= 3 * 104
1 <= words[i].length <= 10
words[i] consists of lowercase English letters.
All the strings of words are unique.
"""             

class TrieNode():
    def __init__(self, char):
        self.char = char
        self.children = {}
        self.end_of_word = False

class Trie():
    def __init__(self):
        self.root = TrieNode("")

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode(char)
            node = node.children[char]
        node.end_of_word = True       

    def search_prefix(self, prefix: str):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    def search_word_exists(self, full_word):
        node = self.root
        for char in full_word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.end_of_word

class Solution:

    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        if not board:
            return []
        trie = Trie()
        for word in words:
            trie.insert(word)

        results = set()
        x_max = len(board)
        y_max = len(board[0])
        def dfs(prefix, x, y, x_max, y_max,
                       node, board, results, visited_matrix):
            """
            Boundary of the board
            prepare a string, 
            next position with string dfs()
            move up down  left right dfs yourself,
            after exhausting, move next step
            """
            if x >= x_max or y >= y_max or x < 0 or y < 0 or visited_matrix[x][y] or board[x][y] not in node.children:
                return
            
            prefix += board[x][y]
            visited_matrix[x][y] = True

            directions = [
                # x, y
                [0, 1],
                [ 0, -1],
                [-1, 0],
                [1, 0]
            ]
            node = node.children[board[x][y]]
            if node.end_of_word:
                results.add(prefix[:])
            for direction in ():
                x_new = x+ direction[0]
                y_new = y+ direction[1]
                dfs(prefix, x_new, y_new, x_max, y_max, node, board, results, visited_matrix)
            visited_matrix[x][y] = False
        

        for row_index in range(x_max):
            for col_index in range(y_max):
                if board[row_index][col_index] in trie.root.children:
                    visited_matrix = [[False for _ in range(y_max)] for _ in range(x_max)]
                    dfs("", row_index, col_index, x_max, y_max, trie.root, board, results, visited_matrix)
        return list(results)
