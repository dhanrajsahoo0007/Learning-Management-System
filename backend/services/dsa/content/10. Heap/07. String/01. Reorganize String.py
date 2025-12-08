"""
767. Reorganize String
Attempted
Medium
Topics
Companies
Hint
Given a string s, rearrange the characters of s so that any two adjacent characters are not the same.

Return any possible rearrangement of s or return "" if not possible.

 

Example 1:

Input: s = "aab"
Output: "aba"
Example 2:

Input: s = "aaab"
Output: ""
 

Constraints:

1 <= s.length <= 500
s consists of lowercase English letters.
"""

class Solution:
    def reorganizeString(self, s: str) -> str:
        from collections import Counter
        s_len = len(s)
        freq_counter = Counter(s)
        char_heap = []
        for char, char_freq in freq_counter.items():
            if char_freq > ((s_len+1) // 2):
                return ""
            heapq.heappush(char_heap, (-char_freq, char))
        result = []
        prev = ()
        while char_heap:
            curr_char_freq, curr_char = heapq.heappop(char_heap)
            result.append(curr_char)
            if prev:
                heapq.heappush(char_heap, prev)
            if curr_char_freq < -1: #freq is in negative
                prev = (curr_char_freq+1, curr_char)
            else:
                prev =()
        return "".join(result) if len(result) == s_len else ""
