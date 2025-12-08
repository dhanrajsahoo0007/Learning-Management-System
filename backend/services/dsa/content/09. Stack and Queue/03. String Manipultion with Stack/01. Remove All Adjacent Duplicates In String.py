"""
Problem Statement:
    Given a string s consisting of lowercase English letters, perform duplicate removals on the string until no more can be made. 
    A duplicate removal consists of choosing two adjacent and equal letters and removing them. 
    Return the final string after all such duplicate removals have been made.

Example 1:
    Input: s = "abbaca"
    Output: "ca"
    Explanation: In "abbaca" we could remove "bb" since the letters are adjacent and equal, and this is the only possible move. The result of this move is that the string is "aaca", of which only "aa" is possible, so the final string is "ca".

Example 2:
    Input: s = "azxxzy"
    Output: "ay"

Constraints:
* 1 <= s.length <= 10^5
* s consists of lowercase English letters.

Time Complexity: O(n), where n is the length of the input string s.
Space Complexity: O(n) in the worst case, where we need to store all characters in the stack.
"""

class Solution:
    def removeDuplicates(self, s: str) -> str:
        stack = []
        for c in s:
            if stack and stack[-1] == c:
                stack.pop()
            else:
                stack.append(c)
        return "".join(stack)