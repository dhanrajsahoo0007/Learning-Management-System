"""
Problem Statement:
Implement a Trie (Prefix Tree) data structure that supports the following operations:
    1. Initialize the Trie object.
    2. Insert a word into the Trie.
    3. Count the number of instances of a word in the Trie.
    4. Count the number of words in the Trie that have a given prefix.
    5. Erase a word from the Trie.

Space Complexity:
    - O(N * M), where N is the total number of characters in all inserted words, and M is the size of the character set (26 in this case).
    - In the worst case, when there are no common prefixes, each character of each word requires a new TrieNode.

Time Complexity:
    - Insert: O(L), where L is the length of the word being inserted.
    - CountWordsEqualTo: O(L), where L is the length of the word being counted.
    - CountWordsStartingWith: O(L), where L is the length of the prefix.
    - Erase: O(L), where L is the length of the word being erased.

Explanation:
    1. The Trie is implemented using a tree-like structure where each node represents a character.
    2. Each TrieNode contains a dictionary 'children' to store its child nodes, a 'word_count' to track complete words, and a 'prefix_count' to track prefixes.
    3. The Trie class has a root node initialized in the constructor.
    4. The insert method adds a word to the Trie, incrementing prefix counts along the way and the word count at the end.
    5. The countWordsEqualTo method traverses the Trie to find the node corresponding to the word and returns its word count.
    6. The countWordsStartingWith method traverses the Trie to find the node corresponding to the prefix and returns its prefix count.
    7. The erase method removes a word from the Trie, decrementing counts and potentially removing unused nodes.

Examples:
1. Inserting "apple" twice:
   - Create nodes for 'a', 'p', 'p', 'l', 'e'
   - Increment prefix_count for each node along the path
   - Increment word_count for the last 'e' node to 2

2. Counting words equal to "apple":
   - Traverse nodes for 'a', 'p', 'p', 'l', 'e'
   - Return the word_count of the last 'e' node (2)

3. Counting words starting with "app":
   - Traverse nodes for 'a', 'p', 'p'
   - Return the prefix_count of the last 'p' node (2)

4. Erasing "apple":
   - Traverse nodes for 'a', 'p', 'p', 'l', 'e'
   - Decrement prefix_count for each node along the path
   - Decrement word_count for the last 'e' node
   - Remove any nodes that become unused (no words passing through and no children)
"""

class TrieNode:
    def __init__(self):
        self.children = {}  # Dictionary to store child nodes
        self.word_count = 0  # Number of words ending at this node
        self.prefix_count = 0  # Number of words passing through this node

class Trie:
    def __init__(self):
        """
        Initialize the Trie data structure.
        """
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """
        Inserts the string word into the trie.
        Time complexity: O(L), where L is the length of the word.
        """
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.prefix_count += 1
        node.word_count += 1

    def countWordsEqualTo(self, word: str) -> int:
        """
        Returns the number of instances of the string word in the trie.
        Time complexity: O(L), where L is the length of the word.
        """
        node = self.root
        for char in word:
            if char not in node.children:
                return 0
            node = node.children[char]
        return node.word_count

    def countWordsStartingWith(self, prefix: str) -> int:
        """
        Returns the number of strings in the trie that have the string prefix as a prefix.
        Time complexity: O(L), where L is the length of the prefix.
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return 0
            node = node.children[char]
        return node.prefix_count

    def erase(self, word: str) -> None:
        """
        Erases the string word from the trie.
        Time complexity: O(L), where L is the length of the word.
        """
        node = self.root
        stack = []
        for char in word:
            if char not in node.children:
                return  # Word not found, nothing to erase
            stack.append((node, char))
            node = node.children[char]
            node.prefix_count -= 1
        
        node.word_count -= 1

        # Remove nodes if they become unused
        if node.word_count == 0 and not node.children:
            for parent, char in reversed(stack):
                del parent.children[char]
                if parent.children or parent.word_count > 0:
                    break

# Usage example:
trie = Trie()
trie.insert("apple")
trie.insert("apple")
print(trie.countWordsEqualTo("apple"))  # Output: 2
print(trie.countWordsStartingWith("app"))  # Output: 2
trie.erase("apple")
print(trie.countWordsEqualTo("apple"))  # Output: 1
print(trie.countWordsStartingWith("app"))  # Output: 1
trie.erase("apple")
print(trie.countWordsStartingWith("app"))  # Output: 0