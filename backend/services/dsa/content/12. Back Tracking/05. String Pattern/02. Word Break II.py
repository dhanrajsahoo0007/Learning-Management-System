"""
140. Word Break II

    Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word.
    Return all such possible sentences in any order.

    Note that the same word in the dictionary may be reused multiple times in the segmentation.

Example 1:

    Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
    Output: ["cats and dog","cat sand dog"]
    
Example 2:

    Input: s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
    Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
    Explanation: Note that you are allowed to reuse a dictionary word.
    
Example 3:

    Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
    Output: []
    

Constraints:

    1 <= s.length <= 20
    1 <= wordDict.length <= 1000
    1 <= wordDict[i].length <= 10
    s and wordDict[i] consist of only lowercase English letters.
    All the strings of wordDict are unique.
    Input is generated in a way that the length of the answer doesn't exceed 105.


Time Complexity: O(2^n * n), where n is the length of the string s.
    - In the worst case, we may need to generate all possible substrings (2^n)
    - For each substring, we perform a substring operation which takes O(n) time

Space Complexity: O(n + m), where n is the length of the string and m is the total length of wordDict
    - We store the dictionary in a set, which takes O(m) space
    - The recursion stack can go up to O(n) in the worst case


"""
class Solution1:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        results = []
        n = len(s)

        def dfs(starting_index: int, path: list[str]):
            if starting_index == n:
                results.append(" ".join(path))
                return
            for word in wordDict:
                if s[starting_index:].startswith(word):
                    path.append(word)
                    dfs(starting_index+len(word), path)
                    path.pop()
            return
        dfs(0,[])
        return results
    

class Solution2:
    def __init__(self):
        self.result = []  # list to store all valid sentence breakdowns
        self.dict = set()  # Set to store the dictionary words for fast lookup

    def solve(self, i: int, curr_sentence: str, s: str) -> None:
        # Base case: if we've reached the end of the string
        if i >= len(s):
            self.result.append(curr_sentence)
            return
        
        # Try all possible words starting from index i
        for j in range(i, len(s)):
            temp_word = s[i:j+1]
            if temp_word in self.dict:
                # If the word is in the dictionary, add it to the current sentence
                orig_sentence = curr_sentence
                if curr_sentence:
                    curr_sentence += " "
                
                curr_sentence += temp_word
                # Recursively solve for the rest of the string
                self.solve(j+1, curr_sentence, s)
                # Backtrack: restore the original sentence
                curr_sentence = orig_sentence

    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        # Initialize the dictionary set
        self.dict = set(wordDict)
        # Initialize an empty current sentence
        curr_sentence = ""
        # Start the recursive solving process
        self.solve(0, curr_sentence, s)
        # Return all valid sentences found
        return self.result
    

# Example usage:
solution = Solution2()
s = "catsanddog"
wordDict = ["cat","cats","and","sand","dog"]
result = solution.wordBreak(s, wordDict)
print(result)  # Output: ["cats and dog","cat sand dog"]