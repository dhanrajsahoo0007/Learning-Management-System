"""
Problem Statement:
Implement a Trie (Prefix Tree) data structure that supports the following operations:
    1. Initialize the Trie object.
    2. Insert a word into the Trie.
    3. Search for a word in the Trie.
    4. Check if any word in the Trie starts with a given prefix.

Space Complexity:
    - O(N * M), where N is the number of words inserted, and M is the average length of the words.
    - In the worst case, when there are no common prefixes, the space complexity can be O(N * M).
    - Each node in the Trie contains a dictionary of children and a boolean flag, which takes constant space.

Time Complexity:
    - Insert: O(M), where M is the length of the word being inserted.
    - Search: O(M), where M is the length of the word being searched.
    - StartsWith: O(M), where M is the length of the prefix.

Explanation:
    1. The Trie is implemented using a tree-like structure where each node represents a character.
    2. Each TrieNode contains a dictionary 'children' to store its child nodes and a boolean 'is_end_of_word' to mark the end of a word.
    3. The Trie class has a root node initialized in the constructor.
    4. The insert method adds a word to the Trie by creating new nodes for each character if they don't exist.
    5. The search method checks if a word exists in the Trie by traversing the nodes and checking if the last node is marked as the end of a word.
    6. The startsWith method checks if any word in the Trie starts with the given prefix by traversing the nodes for the prefix characters.

Examples:
1. Inserting "apple":
   - Create nodes for 'a', 'p', 'p', 'l', 'e'
   - Mark the last 'e' node as the end of a word

2. Searching for "app":
   - Traverse nodes for 'a', 'p', 'p'
   - Return False because the last 'p' node is not marked as the end of a word

3. Checking startsWith "app":
   - Traverse nodes for 'a', 'p', 'p'
   - Return True because all prefix characters exist in the Trie
"""

class TrieNode:
    def __init__(self):
        self.children = {}  # Dictionary to store child nodes
        self.is_end_of_word = False  # Flag to mark the end of a word

class Trie:
    def __init__(self):
        """
        Initialize the Trie data structure.
        """
        self.root = TrieNode()  # Root node of the Trie

    def insert(self, word: str) -> None:
        """
        Inserts a word into the trie.
        Time complexity: O(M), where M is the length of the word.
        """
        node = self.root
        for char in word:
            # If the character is not in the current node's children, add it
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True  # Mark the end of the word

    def search(self, word: str) -> bool:
        """
        Returns if the word is in the trie.
        Time complexity: O(M), where M is the length of the word.
        """
        node = self.root
        for char in word:
            if char not in node.children:
                return False  # Character not found, word doesn't exist
            node = node.children[char]
        return node.is_end_of_word  # Check if it's a complete word

    def startsWith(self, prefix: str) -> bool:
        """
        Returns if there is any word in the trie that starts with the given prefix.
        Time complexity: O(M), where M is the length of the prefix.
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False  # Character not found, prefix doesn't exist
            node = node.children[char]
        return True  # All characters in the prefix were found

# Usage example:
trie = Trie()
trie.insert("apple")
print(trie.search("apple"))   # returns True
print(trie.search("app"))     # returns False
print(trie.startsWith("app")) # returns True
trie.insert("app")
print(trie.search("app"))     # returns True