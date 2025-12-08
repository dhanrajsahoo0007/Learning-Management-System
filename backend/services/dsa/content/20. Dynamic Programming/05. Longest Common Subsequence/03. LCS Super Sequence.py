"""
Explanation of the approach:

1. Longest Common Subsequence (LCS):
   - We use the provided longestCommonSubsequence function to compute the LCS length.
   - This function fills a DP table where t[i][j] represents the length of the LCS for the prefixes str1[:i] and str2[:j].

2. Shortest Common Supersequence (SCS):
   - We use the LCS information to construct the SCS.
   - The key insight is that the SCS should include all characters from both strings, but only include the LCS characters once.

3. Constructing the SCS:
   - We recreate the DP table used in the LCS computation for backtracking.
   - We start from the bottom-right of the table and work our way to the top-left.
   - If characters match, we include it once in the SCS and move diagonally in the table.
   - If they don't match, we include the character from the string that gives us a longer LCS and move in that direction.
   - We add any remaining characters from either string at the end.

4. SCS Length:
   - We can compute the SCS length using the formula: len(SCS) = len(str1) + len(str2) - len(LCS)
   - This is because the SCS includes all characters from both strings, except that the LCS characters are included only once instead of twice.

5. Time Complexity: O(mn), where m and n are the lengths of the input strings.
   Space Complexity: O(mn) for the DP table.

Key Insights:
1. The SCS problem is closely related to the LCS problem.
2. We can use the LCS solution as a building block for solving the SCS problem.
3. The backtracking process to construct the SCS is similar to reconstructing the LCS, but we include non-matching characters as well.

"""



def longestCommonSubsequence(X: str, Y: str) -> int:
    """
    Compute the length of the Longest Common Subsequence (LCS) of strings X and Y using tabulation.
    
    This function uses a bottom-up dynamic programming approach to solve the LCS problem.
    
    Args:
    X (str): The first input string
    Y (str): The second input string
    
    Returns:
    int: The length of the longest common subsequence
    """
    m = len(X)
    n = len(Y)
    
    # Create a DP table of size (m+1) x (n+1) initialized with -1
    t = [[-1 for j in range(n + 1)] for i in range(m + 1)]

    # Initialize the base cases:
    # - The length of LCS with an empty string is 0, so t[i][0] = 0 for all i
    # - The length of LCS with an empty string is 0, so t[0][j] = 0 for all j
    for i in range(m + 1):
        t[i][0] = 0
    for j in range(n + 1):
        t[0][j] = 0

    # Fill in the DP table by considering characters from both strings
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i - 1] == Y[j - 1]:
                # If the characters match, increment the LCS length
                t[i][j] = 1 + t[i - 1][j - 1]
            else:
                # If the characters do not match, take the maximum of
                # LCS length without one character from X or Y
                t[i][j] = max(t[i - 1][j], t[i][j - 1])
    
    # The value in t[m][n] represents the length of the Longest Common Subsequence
    return t[m][n]

def scs_length(str1: str, str2: str) -> int:
    """
    Compute the length of the Shortest Common Supersequence (SCS) of str1 and str2.
    
    This function uses the LCS length to calculate the SCS length.
    
    Args:
    str1 (str): The first input string
    str2 (str): The second input string
    
    Returns:
    int: The length of the Shortest Common Supersequence
    """
    lcs_length = longestCommonSubsequence(str1, str2)
    return len(str1) + len(str2) - lcs_length



str1, str2 = "abac", "cab"
print(f"Length of SCS: {scs_length(str1, str2)}")

# Test case 2
str1, str2 = "aaaaaaaa", "aaaaaaaa"
print(f"Length of SCS: {scs_length(str1, str2)}")

# Test case 3
str1, str2 = "abcde", "fghij"
print(f"Length of SCS: {scs_length(str1, str2)}")

def shortestCommonSupersequence(str1: str, str2: str) -> str:
    """
    Compute the Shortest Common Supersequence (SCS) of str1 and str2.
    
    This function uses the LCS function to help construct the SCS.
    
    Args:
    str1 (str): The first input string
    str2 (str): The second input string
    
    Returns:
    str: The Shortest Common Supersequence
    """
    m, n = len(str1), len(str2)
    
    # Step 1: Compute the LCS length and fill the DP table
    lcs_length = longestCommonSubsequence(str1, str2)
    
    # Recreate the DP table to use for backtracking
    t = [[-1 for j in range(n + 1)] for i in range(m + 1)]
    for i in range(m + 1):
        t[i][0] = 0
    for j in range(n + 1):
        t[0][j] = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                t[i][j] = 1 + t[i - 1][j - 1]
            else:
                t[i][j] = max(t[i - 1][j], t[i][j - 1])
    
    # Step 2: Construct the SCS by backtracking through the DP table
    scs = []
    i, j = m, n
    
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            scs.append(str1[i-1])
            i -= 1
            j -= 1
        elif t[i-1][j] > t[i][j-1]:
            scs.append(str1[i-1])
            i -= 1
        else:
            scs.append(str2[j-1])
            j -= 1
    
    # Add any remaining characters
    while i > 0:
        scs.append(str1[i-1])
        i -= 1
    while j > 0:
        scs.append(str2[j-1])
        j -= 1
    
    # Reverse the result to get the correct order
    return ''.join(reversed(scs))



# Test the solution
# Test case 1
str1, str2 = "abac", "cab"
print(f"SCS of '{str1}' and '{str2}': {shortestCommonSupersequence(str1, str2)}")
print(f"Length of SCS: {scs_length(str1, str2)}")

# Test case 2
str1, str2 = "aaaaaaaa", "aaaaaaaa"
print(f"\nSCS of '{str1}' and '{str2}': {shortestCommonSupersequence(str1, str2)}")
print(f"Length of SCS: {scs_length(str1, str2)}")

# Test case 3
str1, str2 = "abcde", "fghij"
print(f"\nSCS of '{str1}' and '{str2}': {shortestCommonSupersequence(str1, str2)}")
print(f"Length of SCS: {scs_length(str1, str2)}")

