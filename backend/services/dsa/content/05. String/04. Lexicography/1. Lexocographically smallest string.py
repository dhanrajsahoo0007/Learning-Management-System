"""
Problem Statement:

You are given a string s consisting of lowercase English letters. You need to find the smallest palindrome that can be created by changing some or all characters of s.

A palindrome is a string that reads the same forward and backward. For example, "abba" and "racecar" are palindromes.

The resulting palindrome should be the lexicographically smallest one possible. In other words, if there are multiple ways to create the smallest palindrome, choose the one that comes first in dictionary order.

Time Complexity: O(n), where n is the length of the string
Space Complexity: O(n) to create a list from the string

Example:
Input: s = "abcd"
Output: "abba"
Explanation: "abba" is the lexicographically smallest palindrome that can be made from "abcd".
"""

class Solution:
    def makeSmallestPalindrome(self, s: str) -> str:
        
        l, r = 0, len(s) - 1
        s_list = list(s)

        while l < r:
            if s_list[l] != s_list[r]:
                if ord(s_list[l]) < ord(s_list[r]):
                    s_list[r] = s_list[l]
                else:
                    s_list[l] = s_list[r]
            l += 1
            r -= 1
        return "".join(s_list)

# Test cases
def test_makeSmallestPalindrome():
    solution = Solution()

    # Test case 1
    s1 = "abcd"
    print("Test case 1:")
    print("Input:", s1)
    print("Output:", solution.makeSmallestPalindrome(s1))
    print()

    # Test case 2
    s2 = "leetcode"
    print("Test case 2:")
    print("Input:", s2)
    print("Output:", solution.makeSmallestPalindrome(s2))
    print()

    # Test case 3
    s3 = "abc"
    print("Test case 3:")
    print("Input:", s3)
    print("Output:", solution.makeSmallestPalindrome(s3))
    print()

# Run the tests
test_makeSmallestPalindrome()