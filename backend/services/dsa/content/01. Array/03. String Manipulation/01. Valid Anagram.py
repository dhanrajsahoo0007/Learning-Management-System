"""
Problem Statement:
    Given two strings s and t, return true if t is an anagram of s, and false otherwise.
    An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Time Complexity: O(n), where n is the length of the input strings
Space Complexity: O(k), where k is the number of unique characters in the string (at most 26 for lowercase English letters)

Explanation:
    This solution uses a hash map approach to count the frequency of characters in both strings.
    If the frequency of all characters matches in both strings, they are anagrams.

Examples:
1. Input: s = "anagram", t = "nagaram"
   Output: true

2. Input: s = "rat", t = "car"
   Output: false
"""

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        countS, countT = {}, {}

        for i in range(len(s)):
            countS[s[i]] = 1 + countS.get(s[i], 0)
            countT[t[i]] = 1 + countT.get(t[i], 0)
        return countS == countT