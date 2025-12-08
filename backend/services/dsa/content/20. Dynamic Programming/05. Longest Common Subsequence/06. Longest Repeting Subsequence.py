"""
Problem Statement: Longest Repeating Subsequence

Examples:

    1. Input: str = "AABEBCDD"
    Output: 3
    Explanation: The longest repeating subsequence is "ABD". 'A' is at index 0 and 1, 'B' is at index 2 and 4, 'D' is at index 7 and 8.

    2. Input: str = "AABEBCDD"
    Output: 3
    Explanation: Another longest repeating subsequence is "ABD". 'A' is at index 0 and 1, 'B' is at index 2 and 4, 'D' is at index 6 and 7.

    3. Input: str = "GEEKSFORGEEKS"
    Output: 5
    Explanation: The longest repeating subsequence is "GEEKS". 'G' is at index 0 and 8, 'E' is at index 1 and 9, 'E' is at index 2 and 10, 'K' is at index 3 and 11, 'S' is at index 4 and 12.



Explanation of the approach:

1. Dynamic Programming Table:
   - We create a 2D DP table where dp[i][j] represents the length of the longest repeating
     subsequence considering the prefixes s[0:i] and s[0:j].

2. Filling the DP Table:
   - We iterate through the table, comparing each character with every other character.
   - If characters match (s[i-1] == s[j-1]) and their indices are different (i != j),
     we increment the length of the repeating subsequence.
   - If they don't match or indices are the same, we take the maximum of excluding either character.

3. Result:
   - The length of the longest repeating subsequence is stored in dp[n][n].

4. Reconstructing the Subsequence:
   - We backtrack through the DP table to construct the actual repeating subsequence.
   - We start from dp[n][n] and move towards dp[0][0], collecting characters when they match
     and indices are different.

5. Time Complexity: O(n^2), where n is the length of the input string.
   Space Complexity: O(n^2) for the DP table.

Key Insights:
    1.  This problem is a variation of the Longest Common Subsequence problem, where we compare
        the string with itself.
    2.  The crucial difference is the condition i != j, which ensures we don't match a character
        with itself at the same position.
    3.  This approach effectively finds repeated patterns in the string, even if they are interleaved
        with other characters.

This solution demonstrates how to modify the LCS algorithm to solve a different but related problem.
It showcases the versatility of dynamic programming in solving various string-related problems.

"""

def longestRepeatingSubsequence(s: str) -> int:
    """
    Compute the length of the Longest Repeating Subsequence.
    
    Args:
    s (str): The input string
    
    Returns:
    int: The length of the longest repeating subsequence
    """
    n = len(s)
    
    # Create a DP table of size (n+1) x (n+1) initialized with 0
    dp = [[0 for _ in range(n + 1)] for _ in range(n + 1)]

    # Fill the DP table
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            # If characters match and indices are different , the only addition to LCS is ( and i != j )
            if s[i - 1] == s[j - 1] and i != j:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[n][n]

def printLongestRepeatingSubsequence(s: str) -> str:
    """
    Compute and return the Longest Repeating Subsequence.
    
    Args:
    s (str): The input string
    
    Returns:
    str: The longest repeating subsequence
    """
    n = len(s)
    dp = [[0 for _ in range(n + 1)] for _ in range(n + 1)]

    # Fill the DP table
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == s[j - 1] and i != j:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Reconstruct the longest repeating subsequence
    lrs = []
    i, j = n, n
    while i > 0 and j > 0:
        if s[i - 1] == s[j - 1] and i != j:
            lrs.append(s[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lrs))

# Test the solution
# Test case 1
s = "AABEBCDD"
print(f"Input: {s}")
print(f"Length of Longest Repeating Subsequence: {longestRepeatingSubsequence(s)}")
print(f"Longest Repeating Subsequence: {printLongestRepeatingSubsequence(s)}")

# Test case 2
s = "GEEKSFORGEEKS"
print(f"\nInput: {s}")
print(f"Length of Longest Repeating Subsequence: {longestRepeatingSubsequence(s)}")
print(f"Longest Repeating Subsequence: {printLongestRepeatingSubsequence(s)}")

