"""
Problem: Longest Common Suffix Queries

    Given a list of strings and a list of query strings, for each query string, 
    find the length of the longest common suffix it shares with any string in the original list.

Example:
    Input:
    strings = ["apple", "banana", "cherry", "date"]
    queries = ["pple", "ana", "ry", "e"]

    Output: [5, 6, 6, 5]

Explanation:
    - "pple" shares the suffix "pple" with "apple" (length 5)
    - "ana" shares the suffix "ana" with "banana" (length 6)
    - "ry" shares the suffix "ry" with "cherry" (length 6)
    - "e" shares the suffix "e" with "apple", "date" (length 5)

Approach:
    1. Build a reverse Trie (suffix Trie) from the given strings.
    2. For each query, traverse the Trie to find the longest matching suffix.

Time Complexity: 
    - Building the Trie: O(N * L), where N is the number of strings and L is the average length of strings.
    - Querying: O(M * L), where M is the number of queries and L is the average length of query strings.

Space Complexity: O(N * L) for storing the Trie.
"""

class TrieNode:
    def __init__(self):
        # Dictionary to store child nodes. Keys are characters, values are TrieNodes.
        self.children = {}
        # Boolean flag to mark if this node represents the end of a word.
        self.end_of_word = False
        # Stores the length of the longest word that ends at this node.
        # This is crucial for quickly determining the length of the longest common suffix.
        self.longest_word_length = 0

class SuffixTrie:
    def __init__(self):
        # Initialize the root of the Trie.
        self.root = TrieNode()

    def insert(self, word: str):
        # Start from the root node.
        node = self.root
        # Insert characters in reverse order to create a suffix trie.
        for char in reversed(word):
            # If the character doesn't exist, create a new node.
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the child node.
            node = node.children[char]
            # Update the longest word length at this node.
            # This ensures that each node knows the length of the longest word passing through it.
            node.longest_word_length = max(node.longest_word_length, len(word))
        # Mark the end of the word.
        node.end_of_word = True

    def longest_common_suffix(self, query: str) -> int:
        # Start from the root node.
        node = self.root
        # Traverse the query string in reverse order.
        for char in reversed(query):
            # If the character is not in the trie, we've reached the end of the common suffix.
            if char not in node.children:
                break
            # Move to the child node.
            node = node.children[char]
        # Return the length of the longest word that ends at this node.
        # This represents the length of the longest common suffix.
        return node.longest_word_length

def longest_common_suffix_queries(strings: list[str], queries: list[str]) -> list[int]:
    # Initialize the suffix trie.
    trie = SuffixTrie()
    
    # Build the suffix trie by inserting all strings.
    for string in strings:
        trie.insert(string)
    
    # Process queries and store results.
    results = []
    for query in queries:
        # For each query, find the longest common suffix and append to results.
        results.append(trie.longest_common_suffix(query))
    
    return results

# Example usage
strings = ["apple", "banana", "cherry", "date"]
queries = ["pple", "ana", "ry", "e"]
print(longest_common_suffix_queries(strings, queries))  # Output: [5, 6, 6, 5]