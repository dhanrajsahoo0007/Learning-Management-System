"""
Problem: Longest Common Subsequence (LCS)

Given two strings X and Y, and their lengths n and m respectively, return the length of their longest common subsequence.
A subsequence of a string is a new string generated from the original string with some characters
(can be none) deleted without changing the relative order of the remaining characters.

Example 1:
Input: X = "abcde", Y = "ace", n = 5, m = 3
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:
Input: X = "abc", Y = "abc", n = 3, m = 3
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.

Example 3:
Input: X = "abc", Y = "def", n = 3, m = 3
Output: 0
Explanation: There is no such common subsequence, so the result is 0.


Explanation of the recursive approach:

    1. Base Case:
            If either of the strings is empty (n == 0 or m == 0), we return 0 as there can be no common subsequence.

    2. Recursive Cases:
        a.  If the last characters of both strings match (X[n-1] == Y[m-1]):
                We include this character in our LCS and recursively solve for the remaining substrings (n-1, m-1).
            
        b. If the last characters don't match:
                We have two choices:
                    - Exclude the last character of X and solve for (n-1, m)
                    - Exclude the last character of Y and solve for (n, m-1)
                We take the maximum of these two recursive calls.

    3. The final result is the value returned when n and m are the lengths of X and Y respectively.

Choice Diagram:

                    LCS(X[0..n-1], Y[0..m-1])
                              |
                   X[n-1] == Y[m-1] ?
                   /                \
                 Yes                No
                 /                    \
    1 + LCS(X[0..n-2], Y[0..m-2])     max(
                                        LCS(X[0..n-2], Y[0..m-1]),
                                        LCS(X[0..n-1], Y[0..m-2])
                                      )

Time Complexity: O(2^(n+m)), where n and m are the lengths of the input strings.
Space Complexity: O(n+m) due to the recursion stack.

Note: This recursive solution is not efficient for large inputs due to repeated subproblems.
A dynamic programming approach would be more efficient.
"""

class Solution:
    def longestCommonSubsequence(self, X: str, Y: str, n: int, m: int) -> int:
        def lcs_recursive(n, m):
            # Base case: if either string is empty
            if n == 0 or m == 0:
                return 0
            
            # If last characters match
            if X[n-1] == Y[m-1]:
                return 1 + lcs_recursive(n-1, m-1)
            
            # If last characters don't match
            else:
                return max(lcs_recursive(n-1, m),
                           lcs_recursive(n, m-1))
        
        return lcs_recursive(n, m)

# Test the solution
solution = Solution()

# Test case 1
s1 = "abcde" 
s2 = "ace"
print(solution.longestCommonSubsequence(s1, s2, len(s1), len(s2)))  # Expected: 3

# Test case 2
s1 = "abc"
s2 = "abc"
print(solution.longestCommonSubsequence(s1, s2, len(s1), len(s2)))  # Expected: 3

# Test case 3
s1 = "abc"
s2 = "def"
print(solution.longestCommonSubsequence(s1, s2, len(s1), len(s2)))  # Expected: 0

"""
Memoization:

    We use a 2D list memo to store computed results.
    memo[i][j] represents the length of LCS for X[:i] and Y[:j].
    We initialize memo with -1 to distinguish between computed (non-negative) and uncomputed (-1) values.

Main Function:

    Initializes the memoization table.
    Calls the recursive function with the full lengths of both strings.

Printing the LCS:

    We first fill the memo table using the recursive function.
    Then we backtrack through the memo table to construct the LCS string.
    We start from the bottom-right cell and move towards the top-left, collecting matching characters.

Time Complexity: O(m*n), where m and n are the lengths of the input strings. Although it's recursive, memoization ensures that each subproblem is solved only once.
Space Complexity: O(m*n) for the memoization table, plus O(min(m,n)) for the recursion stack.

"""

class Solution:
    def longestCommonSubsequence(self, X: str, Y: str) -> int:
        def lcs_recursive(i: int, j: int) -> int:
            # Base case: if we've reached the end of either string
            if i == 0 or j == 0:
                return 0
            
            # Check if we've already computed this subproblem
            if memo[i][j] != -1:
                return memo[i][j]
            
            # If the characters match
            if X[i-1] == Y[j-1]:
                memo[i][j] = 1 + lcs_recursive(i-1, j-1)
            else:
                # If the characters don't match, we have two choices:
                # 1. Exclude the character from X
                # 2. Exclude the character from Y
                # We take the maximum of these two choices
                memo[i][j] = max(lcs_recursive(i-1, j), lcs_recursive(i, j-1))
            
            return memo[i][j]

        # Initialize memoization table with -1
        m, n = len(X), len(Y)
        memo = [[-1 for _ in range(n+1)] for _ in range(m+1)]
        
        # Call the recursive function
        return lcs_recursive(m, n)
    
"""

Detailed explanation of the tabulation approach:

1. Table Creation:
   - We create a table 't' of size (m+1) x (n+1) where m and n are lengths of X and Y respectively.
   - The extra row and column (hence m+1 and n+1) are for handling empty string cases.

2. Base Case Initialization:
   - We initialize the first row and column with 0, representing cases where one string is empty.
   - This sets up our base cases: LCS of any string with an empty string is always 0.

3. Table Filling:
   - We iterate through each cell of the table, filling it based on the characters of X and Y.
   - For each cell t[i][j], we're essentially asking: "What's the LCS length for X[:i] and Y[:j]?"

4. Character Comparison:
   - If X[i-1] == Y[j-1], we've found a common character. So we add 1 to the LCS length of
     the strings without these characters (which is stored in t[i-1][j-1]).
   - If the characters don't match, we take the maximum of:
     a) LCS length without the current character from X (t[i-1][j])
     b) LCS length without the current character from Y (t[i][j-1])

5. Result:
   - After filling the entire table, t[m][n] gives the length of the LCS for the entire strings.

6. Reconstructing the LCS (in printLCS function):
   - We start from t[m][n] and move towards t[0][0], collecting characters along the way.
   - If characters match, we include it in our LCS and move diagonally up-left.
   - If they don't match, we move in the direction of the larger value (up or left).

Time Complexity: O(m*n) - we fill each cell of the m*n table once.
Space Complexity: O(m*n) for the tabulation table.

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
