"""
Problem Statement: Minimum Number of Insertions and Deletions to Convert String A to String B

Given two strings str1 and str2, the task is to find the minimum number of insertions and deletions required to convert str1 into str2.

Examples:

    1. Input:  str1 = "heap", str2 = "pea"
    Output: Minimum Deletions = 2, Minimum Insertions = 1
    Explanation: 
    Delete 'h' and 'p' from "heap" to get "ea".
    Insert 'p' at the beginning to get "pea".

    2. Input:  str1 = "geeksforgeeks", str2 = "geeks"
    Output: Minimum Deletions = 8, Minimum Insertions = 0
    Explanation:
    Delete 8 characters "forgeeks" from "geeksforgeeks" to get "geeks".

    3. Input:  str1 = "cat", str2 = "cut"
    Output: Minimum Deletions = 1, Minimum Insertions = 1
    Explanation:
    Delete 'a' from "cat" and insert 'u' to get "cut".

The approach uses the Longest Common Subsequence (LCS) as a key component in solving this problem efficiently.

Explanation of the approach:

1. Longest Common Subsequence (LCS):
   - We use the provided longestCommonSubsequence function to compute the LCS length.
   - The LCS represents the characters that are common to both strings and don't need to be changed.

2. Minimum Operations Calculation:
   - Deletions: We need to delete all characters in str1 that are not part of the LCS.
     Number of deletions = len(str1) - LCS length
   - Insertions: We need to insert all characters in str2 that are not part of the LCS.
     Number of insertions = len(str2) - LCS length

3. Printing Specific Operations:
   - We recreate the LCS DP table for backtracking.
   - We start from the bottom-right of the table and work our way to the top-left.
   - If characters match, they're part of LCS, so we move diagonally.
   - If they don't match:
     * If the LCS length is greater by excluding the current character of str1, we delete it.
     * Otherwise, we insert the current character of str2.

4. Time Complexity: O(mn), where m and n are the lengths of the input strings.
   Space Complexity: O(mn) for the DP table.

Key Insights:
    1. The minimum number of operations is directly related to the LCS length.
    2. Characters in the LCS don't need to be changed (neither deleted nor inserted).
    3. All characters in str1 not in LCS must be deleted.
    4. All characters in str2 not in LCS must be inserted.


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

def min_operations(str1: str, str2: str) -> tuple:
    """
    Compute the minimum number of insertions and deletions to convert str1 to str2.
    
    This function uses the LCS length to calculate the required operations.
    
    Args:
    str1 (str): The source string
    str2 (str): The target string
    
    Returns:
    tuple: (insertions, deletions)
    """
    m, n = len(str1), len(str2)
    lcs_length = longestCommonSubsequence(str1, str2)
    
    # Deletions: characters in str1 that are not in LCS
    deletions = m - lcs_length
    
    # Insertions: characters in str2 that are not in LCS
    insertions = n - lcs_length
    
    return (insertions, deletions)

def print_operations(str1: str, str2: str) -> None:
    """
    Print the specific insertions and deletions required to convert str1 to str2.
    
    This function uses the LCS to determine which characters to delete and insert.
    
    Args:
    str1 (str): The source string
    str2 (str): The target string
    """
    m, n = len(str1), len(str2)
    
    # Recreate the DP table for LCS
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
    
    # Backtrack to find the operations
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            i -= 1
            j -= 1
        elif t[i-1][j] > t[i][j-1]:
            print(f"Delete '{str1[i-1]}' at position {i}")
            i -= 1
        else:
            print(f"Insert '{str2[j-1]}' at position {i+1}")
            j -= 1
    
    # Handle remaining characters
    while i > 0:
        print(f"Delete '{str1[i-1]}' at position {i}")
        i -= 1
    while j > 0:
        print(f"Insert '{str2[j-1]}' at position 1")
        j -= 1

# Test the solution
# Test case 1
str1, str2 = "heap", "pea"
insertions, deletions = min_operations(str1, str2)
print(f"To convert '{str1}' to '{str2}':")
print(f"Minimum insertions: {insertions}")
print(f"Minimum deletions: {deletions}")
print("Operations:")
print_operations(str1, str2)

# Test case 2
print("\n")
str1, str2 = "geeksforgeeks", "geeks"
insertions, deletions = min_operations(str1, str2)
print(f"To convert '{str1}' to '{str2}':")
print(f"Minimum insertions: {insertions}")
print(f"Minimum deletions: {deletions}")
print("Operations:")
print_operations(str1, str2)

# Test case 3
print("\n")
str1, str2 = "cat", "cut"
insertions, deletions = min_operations(str1, str2)
print(f"To convert '{str1}' to '{str2}':")
print(f"Minimum insertions: {insertions}")
print(f"Minimum deletions: {deletions}")
print("Operations:")
print_operations(str1, str2)

