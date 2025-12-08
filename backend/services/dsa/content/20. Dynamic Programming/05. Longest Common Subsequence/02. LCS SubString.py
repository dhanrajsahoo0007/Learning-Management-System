

class Solution:

    def longestCommonSubstring_topdown(self, X: str, Y: str) -> int:
        """
        Top-down dynamic programming approach for finding the length of the longest common substring.
        
        Time Complexity: O(m*n)
        Space Complexity: O(m*n) for the DP table
        """
        m, n = len(X), len(Y)
        
        # Create a DP table of size (m+1) x (n+1) initialized with 0
        t = [[0 for _ in range(n + 1)] for _ in range(m + 1)]

        # max_length = 0
        
        # Fill the DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if X[i-1] == Y[j-1]:
                    # If characters match, extend the substring
                    t[i][j] = t[i-1][j-1] + 1
                    # max_length = max(max_length, dp[i][j])
                else:
                    # If characters don't match, reset to 0
                    t[i][j] = 0
        
        return t[m][n]


    def printLongestCommonSubstring(self, X: str, Y: str) -> str:
        """
        Function to print the longest common substring using the top-down approach.
        """
        m, n = len(X), len(Y)
        dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
        
        max_length = 0
        end_index = 0
        
        # Fill the DP table and keep track of the maximum length and end index
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if X[i-1] == Y[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                    if dp[i][j] > max_length:
                        max_length = dp[i][j]
                        end_index = i - 1
                else:
                    dp[i][j] = 0
        
        # Extract the substring using the end index and length
        start_index = end_index - max_length + 1
        return X[start_index:end_index + 1]

# Test the solution
solution = Solution()

# Test case 1
X1, Y1 = "abcdxyz", "xyzabcd"
print("Top-down approach:", solution.longestCommonSubstring_topdown(X1, Y1))
print("Longest Common Substring:", solution.printLongestCommonSubstring(X1, Y1))