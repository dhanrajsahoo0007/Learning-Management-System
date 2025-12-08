"""
Problem Statement: Longest Palindromic Subsequence

Examples:

    1. Input: s = "bbbab"
    Output: 4
    Explanation: One possible longest palindromic subsequence is "bbbb".

    2. Input: s = "cbbd"
    Output: 2
    Explanation: One possible longest palindromic subsequence is "bb".

    3. Input: s = "agbdba"
    Output: 5
    Explanation: One possible longest palindromic subsequence is "abba".


Explanation of the approach:

1. Longest Common Subsequence (LCS):
   - We use the LCS algorithm to find the longest common subsequence between the string and its reverse.
   - The LCS of a string and its reverse is the Longest Palindromic Subsequence.

2. Dynamic Programming Table:
   - We create a 2D DP table where dp[i][j] represents the length of the LCS for the prefixes s[:i] and rev_s[:j].

3. Filling the DP Table:
   - If characters match (s[i-1] == rev_s[j-1]), we extend the LCS: dp[i][j] = dp[i-1][j-1] + 1
   - If they don't match, we take the maximum of excluding either character: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

4. Result:
   - The length of the LPS is stored in dp[m][m], where m is the length of the string.

5. Reconstructing the LPS:
   - We backtrack through the DP table to construct the actual LPS.
   - We start from dp[m][m] and work our way back, adding matching characters to the LPS.

6. Time Complexity: O(n^2), where n is the length of the input string.
   Space Complexity: O(n^2) for the DP table.

Key Insights:
    1. The LPS problem can be reduced to finding the LCS of a string and its reverse.
    2. This approach avoids the need to explicitly check for palindromes.
    3. The LCS approach naturally handles both even and odd length palindromes.
    4. While this method is intuitive, it requires more space than a direct LPS solution.

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

def printLongestPalindromeSubseq(s: str) -> str:
    """
    Compute and return the Longest Palindromic Subsequence using LCS.
    
    Args:
    s (str): The input string
    
    Returns:
    str: The longest palindromic subsequence
    """
    rev_s = s[::-1]
    m = len(s)
    
    # Create a DP table of size (m+1) x (m+1) initialized with 0
    dp = [[0 for _ in range(m + 1)] for _ in range(m + 1)]

    # Fill in the DP table
    for i in range(1, m + 1):
        for j in range(1, m + 1):
            if s[i - 1] == rev_s[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Reconstruct the LPS
    lps = [''] * dp[m][m]
    i, j = m, m
    index = dp[m][m] - 1
    
    while i > 0 and j > 0:
        if s[i - 1] == rev_s[j - 1]:
            lps[index] = s[i - 1]
            i -= 1
            j -= 1
            index -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(lps)

# Test the solution
# Test case 1
s = "bbbab"
print(f"Input: {s}")
print(f"Length of LPS: {longestPalindromeSubseq(s)}")
print(f"LPS: {printLongestPalindromeSubseq(s)}")

# Test case 2
s = "cbbd"
print(f"\nInput: {s}")
print(f"Length of LPS: {longestPalindromeSubseq(s)}")
print(f"LPS: {printLongestPalindromeSubseq(s)}")

# Test case 3
s = "agbdba"
print(f"\nInput: {s}")
print(f"Length of LPS: {longestPalindromeSubseq(s)}")
print(f"LPS: {printLongestPalindromeSubseq(s)}")
