"""
Problem Statement:
    Given a string s, partition s such that every substring of the partition is a palindrome.
    Return all possible palindrome partitioning of s.

Time Complexity: O(N * 2^N)
    - There are 2^N possible substrings in the worst case.
    - For each substring, we spend O(N) time to check if it's a palindrome.

Space Complexity: O(N)
    - The recursion stack can go up to depth N in the worst case.
    - We also store the current path, which can be at most N long.

Explanation:
    1. We use a backtracking approach to generate all possible partitions.
    2. The 'is_palindrome' method checks if a substring is a palindrome.
    3. The 'backtrack' method:
        - If we've reached the end of the string, we've found a valid partition.
        - Otherwise, we try to extend the current partition with new palindromes.
    4. We explore all possible end points for the current substring.
    5. If a palindrome is found, we add it to the path and recurse on the rest of the string.
    6. After exploring a path, we backtrack by removing the last added palindrome.

Examples:
    Input: s = "aab"
    Output: [["a","a","b"],["aa","b"]]

    Input: s = "a"
    Output: [["a"]]
"""

from typing import List

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        def is_palindrome(start: int, end: int) -> bool:
            while start < end:
                if s[start] != s[end]:
                    return False
                start += 1
                end -= 1
            return True

        def backtrack(start: int, path: List[str]):
            # If we've reached the end of the string, we've found a valid partition
            if start == len(s):
                result.append(path[:])
                return
            
            # Try all possible end points for the current substring
            for end in range(start, len(s)):
                if is_palindrome(start, end):
                    # If it's a palindrome, add it to the path and recurse
                    path.append(s[start:end+1])
                    backtrack(end + 1, path)
                    # Backtrack: remove the last added palindrome
                    path.pop()

        result = []
        backtrack(0, [])
        return result

# Test the solution
solution = Solution()

# Test case 1
s1 = "aab"
print(f"Input: s = \"{s1}\"")
print(f"Output: {solution.partition(s1)}")

# Test case 2
s2 = "a"
print(f"\nInput: s = \"{s2}\"")
print(f"Output: {solution.partition(s2)}")

# Additional test case
s3 = "abba"
print(f"\nInput: s = \"{s3}\"")
print(f"Output: {solution.partition(s3)}")