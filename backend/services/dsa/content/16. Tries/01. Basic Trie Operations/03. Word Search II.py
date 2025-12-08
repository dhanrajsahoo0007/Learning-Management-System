"""
Problem Statement:
    Given an m x n board of characters and a list of strings words, return all words on the board.
    Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells 
    are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

Time Complexity: O(M * N * 4^L), where M and N are the dimensions of the board, and L is the maximum length of words.
Space Complexity: O(K), where K is the total number of characters in all words.

Approach:
    1. Build a Trie (prefix tree) from the given words for efficient prefix matching.
    2. Perform DFS on the board, simultaneously traversing the Trie.
    3. When a word is found, add it to the result set.
    4. Use a set to store results to automatically handle duplicates.

Examples:
1. Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
   Output: ["eat","oath"]

2. Input: board = [["a","b"],["c","d"]], words = ["abcb"]
   Output: []
"""

class TrieNode:
    def __init__(self):
        # Dictionary to store child nodes, keys are characters, values are TrieNodes
        self.children = {}
        # Flag to mark if this node represents the end of a word
        self.is_word = False
        # Store the complete word at leaf nodes for easy retrieval
        self.word = ''

    def insert(self, word):
        """
        Inserts a word into the Trie.
        """
        node = self
        for char in word:
            # If the character doesn't exist, create a new node
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the child node
            node = node.children[char]
        # Mark the end of the word and store the full word
        node.is_word = True
        node.word = word

class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = TrieNode()
        
        # Build Trie from the given words
        for word in words:
            root.insert(word)
        
        def dfs(i, j, node):
            # If we've reached a word's end in the Trie, add it to results
            if node.is_word:
                result.add(node.word)
                # Mark as not a word to avoid duplicates if we encounter it again
                node.is_word = False
            
            # Check if we're out of board bounds or if the current cell doesn't match any child in the Trie
            if (i < 0 or i >= len(board) or 
                j < 0 or j >= len(board[0]) or 
                board[i][j] not in node.children):
                return
            
            # Store the current character and mark the cell as visited
            char = board[i][j]
            board[i][j] = '#'  # Use '#' as a visited marker
            
            # Explore all four adjacent cells (right, down, left, up)
            for di, dj in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                dfs(i + di, j + dj, node.children[char])
            
            # Restore the cell's original character after exploration
            board[i][j] = char
        
        result = set()  # Use a set to automatically handle duplicates
        # Start DFS from each cell in the board
        for i in range(len(board)):
            for j in range(len(board[0])):
                dfs(i, j, root)
        
        return list(result)  # Convert set to list before returning

# Example usage:
solution = Solution()

# Test case 1
board1 = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
words1 = ["oath","pea","eat","rain"]
print(solution.findWords(board1, words1))  # Expected output: ["eat","oath"]

# Test case 2
board2 = [["a","b"],["c","d"]]
words2 = ["abcb"]
print(solution.findWords(board2, words2))  # Expected output: []