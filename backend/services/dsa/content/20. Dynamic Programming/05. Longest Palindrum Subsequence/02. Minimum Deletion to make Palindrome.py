"""
Problem Statement: Minimum number of deletions in a string to make it a palindrome

Given a string s, find the minimum number of characters to delete to make it a palindrome.

A palindrome is a string that reads the same backward as forward.

Examples:

1. Input: s = "aebcbda"
   Output: 2
   Explanation: Remove characters 'e' and 'd' to make "abcba", which is a palindrome.

2. Input: s = "geeksforgeeks"
   Output: 8
   Explanation: Remove "geeksfor" or "forgeeks" to get palindrome "geeks" or "skeeg".

3. Input: s = "abcde"
   Output: 4
   Explanation: Remove any 4 characters to get a single-character palindrome.

Explanation of the approach:

1. Longest Common Subsequence (LCS):
   - We use the LCS algorithm to find the length of the longest common subsequence between the string and its reverse.
   - This LCS is equivalent to the Longest Palindromic Subsequence (LPS) of the original string.

2. Longest Palindromic Subsequence (LPS):
   - We compute the LPS by finding the LCS of the string and its reverse.
   - The LPS is the longest subsequence that doesn't need to be deleted to make the string a palindrome.

3. Minimum Deletions:
   - The minimum number of deletions is the difference between the length of the string and the length of its LPS.
   - Minimum deletions = len(s) - len(LPS)

4. Reconstructing the Deletions:
   - We use the LCS DP table to backtrack and determine which characters need to be deleted.
   - We compare the original string with its reverse:
     * If characters match, they are part of the LPS and should be kept.
     * If they don't match, we delete the character from the original string that leads to a longer LCS.

5. Time Complexity: O(n^2), where n is the length of the input string.
   Space Complexity: O(n^2) for the DP table.

Key Insights:
    1. The problem of minimizing deletions is equivalent to maximizing the length of the palindromic subsequence.
    2. We can use the LCS of a string and its reverse to find the LPS efficiently.
    3. This approach demonstrates how solutions to one problem (LCS) can be used to solve related problems (LPS and minimum deletions).
    4. The method works for both even and odd length palindromes without any special handling.

Time Complexity: O(n^2)

Space Complexity: O(n^2)

"""

def longestCommonSubsequence(X: str, Y: str) -> int:
    """
    Compute the length of the Longest Common Subsequence (LCS) of strings X and Y using tabulation.
    
    Args:
    X (str): The first input string
    Y (str): The second input string
    
    Returns:
    int: The length of the longest common subsequence
    """
    m, n = len(X), len(Y)
    
    # Create a DP table of size (m+1) x (n+1) initialized with 0
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]

    # Fill in the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]

def longestPalindromeSubseq(s: str) -> int:
    """
    Compute the length of the Longest Palindromic Subsequence using LCS.
    
    Args:
    s (str): The input string
    
    Returns:
    int: The length of the longest palindromic subsequence
    """
    # The LPS is the LCS of s and its reverse
    return longestCommonSubsequence(s, s[::-1])

def minDeletionsToMakePalindrome(s: str) -> int:
    """
    Compute the minimum number of deletions to make the string a palindrome.
    
    Args:
    s (str): The input string
    
    Returns:
    int: The minimum number of deletions required
    """
    lps_length = longestPalindromeSubseq(s)
    return len(s) - lps_length

def printMinDeletions(s: str) -> str:
    """
    Print the characters that need to be deleted to make the string a palindrome.
    
    Args:
    s (str): The input string
    
    Returns:
    str: A string showing the deletions
    """
    n = len(s)
    rev_s = s[::-1]
    
    # Create a DP table for LCS
    dp = [[0 for _ in range(n + 1)] for _ in range(n + 1)]

    # Fill in the DP table
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == rev_s[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Reconstruct the deletions
    result = list(s)
    i, j = n, n
    while i > 0 and j > 0:
        if s[i - 1] == rev_s[j - 1]:
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            result[i - 1] = f"({result[i - 1]})"  # Mark for deletion
            i -= 1
        else:
            j -= 1
    
    return ''.join(result)

# Test the solution
# Test case 1
s = "aebcbda"
print(f"Input: {s}")
print(f"Minimum deletions: {minDeletionsToMakePalindrome(s)}")
print(f"Deletions: {printMinDeletions(s)}")

# Test case 2
s = "geeksforgeeks"
print(f"\nInput: {s}")
print(f"Minimum deletions: {minDeletionsToMakePalindrome(s)}")
print(f"Deletions: {printMinDeletions(s)}")

# Test case 3
s = "abcde"
print(f"\nInput: {s}")
print(f"Minimum deletions: {minDeletionsToMakePalindrome(s)}")
print(f"Deletions: {printMinDeletions(s)}")

