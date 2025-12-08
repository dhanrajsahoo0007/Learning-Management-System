"""
Length of Last Word
    Given a string s consisting of words and spaces, return the length of the last word in the string..

Example 1:

Input: s = "Hello World"
Output: 5
Explanation: The last word is "World" with length 5.
"""

class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        """
	one shortcut
	"""
	#	return len(s.split()[-1])
        c = 0
        for i in s[::-1]:
            if i == " ":
                if c >= 1:
                    return c
            else:
                c += 1
        return c