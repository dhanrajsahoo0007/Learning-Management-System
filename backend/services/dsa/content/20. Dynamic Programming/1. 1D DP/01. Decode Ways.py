"""
Problem Statement:
    Given a string s containing only digits, return the number of ways to decode it.
    The decoding is based on a mapping of digits to letters (1 -> A, 2 -> B, ..., 26 -> Z).
    If the entire string cannot be decoded in any valid way, return 0.

Time Complexity: O(n)
    - We process each index of the string at most once due to memoization.
    - Each recursive call does constant work.

Space Complexity: O(n)
- The memoization dictionary can store up to n entries in the worst case.
- The recursion stack can go up to n levels deep in the worst case.

Explanation:
    This solution uses a depth-first search (DFS) approach with memoization.
    It explores two possibilities at each step: decoding a single digit or two digits.
    Memoization is used to avoid recomputing results for the same starting index.
    The solution handles edge cases like leading zeros and invalid encodings.

Examples:
    Input: s = "12"
    Output: 2
    Explanation: It could be decoded as "AB" (1 2) or "L" (12).

    Input: s = "226"
    Output: 3
    Explanation: It could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).

    Input: s = "06"
    Output: 0
    Explanation: "06" cannot be mapped to "F" because of the leading zero.
"""

class Solution:
    def numDecodings(self, s: str) -> int:
        n = len(s)
        memo = {}  # Memoization dictionary to store computed results

        def dfs(starting_index: int) -> int:
            # Base case: If we've reached the end of the string, we've found a valid decoding
            if starting_index == n:
                return 1
            
            # If we've already computed this subproblem, return the memoized result
            if starting_index in memo:
                return memo[starting_index]
            
            ans = 0
            
            # If the current digit is '0', it can't be decoded on its own
            if s[starting_index] == "0":
                return ans
            
            # Case 1: Decode a single digit
            ans += dfs(starting_index + 1)
            
            # Case 2: Decode two digits if possible
            # Check if there's a next digit and if the two-digit number is between 10 and 26
            if starting_index < n - 1 and (
                10 <= int(s[starting_index: starting_index+2]) < 27
            ):
                ans += dfs(starting_index + 2)
            
            # Memoize the result for this starting index
            memo[starting_index] = ans
            return ans
        
        # Start the DFS from index 0
        num_ways = dfs(0)
        # Return 0 if the entire string couldn't be decoded
        return num_ways if num_ways > 0 else 0

# Test cases
solution = Solution()
print(solution.numDecodings("12"))   # Expected output: 2
print(solution.numDecodings("226"))  # Expected output: 3
print(solution.numDecodings("06"))   # Expected output: 0
print(solution.numDecodings("27"))   # Expected output: 1
print(solution.numDecodings("10"))   # Expected output: 1
print(solution.numDecodings("2101")) # Expected output: 1