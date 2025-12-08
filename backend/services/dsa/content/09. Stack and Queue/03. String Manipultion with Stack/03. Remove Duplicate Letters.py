"""
Problem Statement: Remove Duplicate Letters  | Smallest Subsequence of Distinct Characters

    Given a string s, remove duplicate letters so that every letter appears once and only once. 
    You must make sure your result is the smallest in lexicographical order among all possible results.

Example 1:
    Input: s = "bcabc"
    Output: "abc"

Example 2:
    Input: s = "cbacdcbc"
    Output: "acdb"

Constraints:
    * 1 <= s.length <= 10^4
    * s consists of lowercase English letters.

Answer Explanation:
The solution uses a greedy approach with a stack-like structure (implemented as a list in Python):
    1. We iterate through the string once to record the last occurrence of each character.
    2. We then iterate through the string again:
        - If the current character is already in our result, we skip it.
        - If it's not in our result, we compare it with the last character in our result:
            - If the current character is smaller and the last character in our result appears later in the string,
            we remove the last character from our result (we can add it back later).
        - After these checks, we add the current character to our result.
    3. This process ensures that we keep the string lexicographically smallest while maintaining the relative order of characters.

Time Complexity: O(n), where n is the length of the input string s.
    - We iterate through the string twice: once to find last occurrences and once to build the result.
    - Each character is added to and removed from the result list at most once.

Space Complexity: O(1)
    - The result list, taken list, and last_index dictionary will never contain more than 26 elements
    (as there are only 26 lowercase English letters).
    - Therefore, the space used is constant regardless of the input size.
"""

class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        n = len(s)
        result = []
        
        taken = [False] * 26  # O(1) space
        last_index = {}  # O(1) space
        
        # Store the last occurrence of each character
        for i, ch in enumerate(s):
            last_index[ch] = i
        
        for i, ch in enumerate(s):
            idx = ord(ch) - ord('a')
            
            # If the character is already in our result, skip it
            if taken[idx]:
                continue
            
            # Remove characters from result if they are greater than current character
            # and occur later in the string
            while result and ch < result[-1] and last_index[result[-1]] > i:
                taken[ord(result.pop()) - ord('a')] = False
            
            result.append(ch)
            taken[idx] = True
        
        return ''.join(result)

if __name__ == "__main__":
    solution = Solution()
    s1 = "bcabc"
    result = solution.removeDuplicateLetters(s1)
    print(f"Input: {s1} , output = {result}")
    s2 = "cbacdcbc"
    result = solution.removeDuplicateLetters(s2)
    print(f"Input: {s2} , output = {result}")
    s2 = "leetcode"
    result = solution.removeDuplicateLetters(s2)
    print(f"Input: {s2} , output = {result}")
