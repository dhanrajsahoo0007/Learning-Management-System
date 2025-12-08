
"""
Problem Statement: Minimum number of insertions in a string to make it a palindrome

Given a string s, find the minimum number of characters to insert into the string to make it a palindrome.

A palindrome is a string that reads the same backward as forward.

Examples:

1. Input: s = "zzazz"
   Output: 0
   Explanation: The string is already a palindrome.

2. Input: s = "mbadm"
   Output: 2
   Explanation: String can be "mbdadbm" or "mdbabdm".

3. Input: s = "leetcode"
   Output: 5
   Explanation: Inserting 5 characters the string becomes "leetcodocteel".

Approach - THIS IS THE SAME PROBLEM AS NUMBER OF DELETETION TO MAKE PALLIDRUM
"""
def longestPalindromeSubseq(s: str) -> int:
    """
    Compute the length of the Longest Palindromic Subsequence using dynamic programming.
    
    Args:
    s (str): The input string
    
    Returns:
    int: The length of the longest palindromic subsequence
    """
    n = len(s)
    dp = [[0 for _ in range(n)] for _ in range(n)]
    
    # All substrings of length 1 are palindromes of length 1
    for i in range(n):
        dp[i][i] = 1
    
    # Fill the dp table
    for cl in range(2, n + 1):  # cl is the chain length
        for i in range(n - cl + 1):
            j = i + cl - 1
            if s[i] == s[j] and cl == 2:
                dp[i][j] = 2
            elif s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]


def minInsertions(s: str) -> int:
    """
    Compute the minimum number of insertions to make the string a palindrome.
    
    Args:
    s (str): The input string
    
    Returns:
    int: The minimum number of insertions required
    """
    lps_length = longestPalindromeSubseq(s)
    return len(s) - lps_length

