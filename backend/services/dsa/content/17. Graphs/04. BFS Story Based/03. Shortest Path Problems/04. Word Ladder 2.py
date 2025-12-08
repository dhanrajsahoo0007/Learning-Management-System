"""
126. Word Ladder II
Attempted
Hard
Topics
Companies
A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

Every adjacent pair of words differs by a single letter.
Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
sk == endWord
Given two words, beginWord and endWord, and a dictionary wordList, return all the shortest transformation sequences from beginWord to endWord, or an empty list if no such sequence exists. Each sequence should be returned as a list of the words [beginWord, s1, s2, ..., sk].

 

Example 1:

Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
Explanation: There are 2 shortest transformation sequences:
"hit" -> "hot" -> "dot" -> "dog" -> "cog"
"hit" -> "hot" -> "lot" -> "log" -> "cog"
Example 2:

Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: []
Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.
 

Constraints:

1 <= beginWord.length <= 5
endWord.length == beginWord.length
1 <= wordList.length <= 500
wordList[i].length == beginWord.length
beginWord, endWord, and wordList[i] consist of lowercase English letters.
beginWord != endWord
All the words in wordList are unique.
The sum of all shortest transformation sequences does not exceed 105.
"""
class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
    	"""
    	NOte: For more optimized approach 
    	use the  backtracking way to solve this
    	"""
        from collections import deque
        available_words = set(wordList)
        word_queue = deque([])
        word_queue.append((beginWord, [beginWord]))
        if beginWord in available_words:
            available_words.remove(beginWord)
        paths_to_word = []
        previous_level = 1
        prev_level_words = set()
        while word_queue:
            curr_word, path_to_word = word_queue.popleft()
            current_level = len(path_to_word)
            if len(path_to_word) > previous_level:
                available_words = available_words - prev_level_words
                prev_level_words = set()
                previous_level = len(path_to_word)
            if curr_word == endWord:
                paths_to_word.append(path_to_word)
                continue
            next_words = self.find_next_available_words(curr_word, available_words)
            for next_word in next_words:
                prev_level_words.add(next_word)
                word_queue.append( (next_word, path_to_word+[next_word]) )
        return paths_to_word

    def find_next_available_words(self, word, available_words):
        next_words = []
        for pos in range(len(word)):
            for char in string.ascii_lowercase:
                if char == word[pos]:
                    continue
                new_word = list(word)
                new_word[pos] = char
                new_word = "".join(new_word)
                if new_word not in available_words:
                    continue
                next_words.append(new_word)
        return next_words