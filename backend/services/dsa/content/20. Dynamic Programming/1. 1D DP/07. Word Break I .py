"""
139. Word Break

Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
Note that the same word in the dictionary may be reused multiple times in the segmentation.


 

Example 1:

Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".
Example 2:

Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.
Example 3:

Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
 

Constraints:

1 <= s.length <= 300
1 <= wordDict.length <= 1000
1 <= wordDict[i].length <= 20
s and wordDict[i] consist of only lowercase English letters.
All the strings of wordDict are unique.
"""



class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        """
        Time: Assuming the size of the dictionary is m, and string matching takes O(n), the overall time complexity is `O(n^2 * m).
        Space: O(n)
        """
        n = len(s)

        def dfs(starting_index) -> bool:
            if starting_index >= n:
                return True
            if starting_index in memo:
                return memo[starting_index]
            res = False
            for word in wordDict:
                if s[starting_index:].startswith(word):
                    res = res or dfs( starting_index + len(word))
                    if res:
                        break
            memo[starting_index] = res
            return res
        memo = {}
        can_break_word = dfs(0)
        return can_break_word