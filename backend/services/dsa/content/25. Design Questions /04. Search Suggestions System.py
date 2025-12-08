"""
Search Suggestions System
Solved
Medium
Topics
Companies
Hint
You are given an array of strings products and a string searchWord.

Design a system that suggests at most three product names from products after each character of searchWord is typed. Suggested products should have common prefix with searchWord. If there are more than three products with a common prefix return the three lexicographically minimums products.

Return a list of lists of the suggested products after each character of searchWord is typed.



Example 1:

Input: products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"
Output: [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
Explanation: products sorted lexicographically = ["mobile","moneypot","monitor","mouse","mousepad"].
After typing m and mo all products match and we show user ["mobile","moneypot","monitor"].
After typing mou, mous and mouse the system suggests ["mouse","mousepad"].
Example 2:

Input: products = ["havana"], searchWord = "havana"
Output: [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]
Explanation: The only word "havana" will be always suggested while typing the search word.


Constraints:

1 <= products.length <= 1000
1 <= products[i].length <= 3000
1 <= sum(products[i].length) <= 2 * 104
All the strings of products are unique.
products[i] consists of lowercase English letters.
1 <= searchWord.length <= 1000
searchWord consists of lowercase English letters.
"""
class TrieNode():
    def __init__(self, char):
        self.char = char
        self.end_word = False
        self.children = [0]*26

class Trie():
    def __init__(self):
        self.root = TrieNode("")

    def add_word(self, word):
        node = self.root
        for char in word:
            char_index = ord(char) - ord('a')
            if node.children[char_index] == 0:
                node.children[char_index] = TrieNode(char)
            node = node.children[char_index]
        node.end_word = True


    def search_n_suggest(self, searchWord) -> List:
        suggestions = []
        node = self.root
        prefix_str = ""
        prefix = searchWord
        for char in prefix:
            prefix_str += char
            char_index = ord(char) - ord('a')
            if node.children[char_index] == 0:
                suggestions.extend(
                     [[]]* (len(searchWord) - len(prefix_str) + 1) )
                break
            node = node.children[char_index]
            suggestions.append(self.collect_suggestions(node, prefix_str=prefix_str, suggestions=[]))
        return suggestions

    def collect_suggestions(self, prefix_node, prefix_str:str, suggestions: List) -> List[str]:
        if prefix_node.end_word:
            suggestions.append(prefix_str)
        if len(suggestions) == 3:
            return suggestions
        results = []
        for node in prefix_node.children:
            if node == 0:
                continue
            self.collect_suggestions(node, prefix_str+node.char, suggestions)
            if len(suggestions) == 3:
                return suggestions
        return suggestions


class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        prefix_tree = Trie()
        root = prefix_tree.root
        for product in products:
            prefix_tree.add_word(product)
        suggestions = prefix_tree.search_n_suggest(searchWord)
        return suggestions

