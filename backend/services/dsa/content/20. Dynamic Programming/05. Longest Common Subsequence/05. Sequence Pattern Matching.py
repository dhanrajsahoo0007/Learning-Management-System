"""
Problem Statement: Sequence Pattern Matching

Given two strings A and B, determine if A is a subsequence of B.

A subsequence of a string is a new string generated from the original string with some characters
(can be none) deleted without changing the relative order of the remaining characters.

Examples:

1. Input: A = "AXY", B = "ADXCPY"
   Output: True
   Explanation: A is a subsequence of B as we can delete 'D', 'C', and 'P' from B to get A.

2. Input: A = "AXY", B = "YADXCP"
   Output: False
   Explanation: A is not a subsequence of B as the relative order of 'A', 'X', and 'Y' is different in A and B.

3. Input: A = "gksrek", B = "geeksforgeeks"
   Output: True
   Explanation: A is a subsequence of B.

The approach uses a modification of the Longest Common Subsequence (LCS) algorithm.

Explanation of the approaches:

1. LCS Approach:
   - We use the Longest Common Subsequence algorithm to find the length of the LCS of A and B.
   - If the length of the LCS is equal to the length of A, then A is a subsequence of B.
   - Time Complexity: O(m*n), where m and n are the lengths of A and B respectively.
   - Space Complexity: O(m*n) for the DP table.

2. Two-Pointer Approach:
   - We use two pointers, one for A and one for B.
   - We iterate through B, advancing the pointer for A only when we find a match.
   - If we can match all characters of A in order, then A is a subsequence of B.
   - Time Complexity: O(n), where n is the length of B.
   - Space Complexity: O(1), as we only use two pointers.

Key Insights:
    1. The LCS approach is more general but less efficient for this specific problem.
    2. The two-pointer approach is more efficient and intuitive for sequence pattern matching.
    3. The two-pointer approach maintains the relative order of characters, which is crucial for subsequence checking.

Trade-offs:
- LCS Approach:
  * Pros: Can be extended to solve related problems (e.g., finding the actual subsequence).
  * Cons: Higher time and space complexity.
- Two-Pointer Approach:
  * Pros: More efficient in both time and space.
  * Cons: Less flexible for solving related problems.

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

def isSubsequence(A: str, B: str) -> bool:
    """
    Determine if A is a subsequence of B using the LCS approach.
    
    Args:
    A (str): The potential subsequence
    B (str): The main string
    
    Returns:
    bool: True if A is a subsequence of B, False otherwise
    """
    lcs_length = longestCommonSubsequence(A, B)
    return lcs_length == len(A)

def isSubsequence_twoPointer(A: str, B: str) -> bool:
    """
    Determine if A is a subsequence of B using a two-pointer approach.
    
    Args:
    A (str): The potential subsequence
    B (str): The main string
    
    Returns:
    bool: True if A is a subsequence of B, False otherwise
    """
    i, j = 0, 0
    while i < len(A) and j < len(B):
        if A[i] == B[j]:
            i += 1
        j += 1
    return i == len(A)

# Test the solutions
# Test case 1
A, B = "AXY", "ADXCPY"
print(f"Input: A = '{A}', B = '{B}'")
print(f"Is A a subsequence of B (LCS approach)? {isSubsequence(A, B)}")
print(f"Is A a subsequence of B (Two-pointer approach)? {isSubsequence_twoPointer(A, B)}")

# Test case 2
A, B = "AXY", "YADXCP"
print(f"\nInput: A = '{A}', B = '{B}'")
print(f"Is A a subsequence of B (LCS approach)? {isSubsequence(A, B)}")
print(f"Is A a subsequence of B (Two-pointer approach)? {isSubsequence_twoPointer(A, B)}")

# Test case 3
A, B = "gksrek", "geeksforgeeks"
print(f"\nInput: A = '{A}', B = '{B}'")
print(f"Is A a subsequence of B (LCS approach)? {isSubsequence(A, B)}")
print(f"Is A a subsequence of B (Two-pointer approach)? {isSubsequence_twoPointer(A, B)}")

