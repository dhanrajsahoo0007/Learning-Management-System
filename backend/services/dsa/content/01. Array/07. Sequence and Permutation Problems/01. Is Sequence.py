"""
Problem statement: Determine if s is a subsequence of t.
Example 1:
    Input: s = "abc", t = "ahbgdc"
    Output: true
Example 2:
    Input: s = "axc", t = "ahbgdc"
    Output: false       
        
"""

class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        
        i, j = 0, 0
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1
            j += 1
        return i == len(s)

# Test cases
solution = Solution()
print(solution.isSubsequence("abc", "ahbgdc"))  # Output: True
print(solution.isSubsequence("axc", "ahbgdc"))  # Output: False
