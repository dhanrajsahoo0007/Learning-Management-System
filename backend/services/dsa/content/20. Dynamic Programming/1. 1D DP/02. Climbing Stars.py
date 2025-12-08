"""
Problem Statement:
    You are climbing a staircase. It takes n steps to reach the top.
    Each time you can either climb 1 or 2 steps.
    In how many distinct ways can you climb to the top?

Example:
    Input: n = 5
    Output: 8

Explanation: There are 8 distinct ways to climb to the top.
            1. 1 step + 1 step + 1 step + 1 step + 1 step
            2. 1 step + 1 step + 1 step + 2 steps
            3. 1 step + 1 step + 2 steps + 1 step
            4. 1 step + 2 steps + 1 step + 1 step
            5. 2 steps + 1 step + 1 step + 1 step
            6. 1 step + 2 steps + 2 steps
            7. 2 steps + 1 step + 2 steps
            8. 2 steps + 2 steps + 1 step
"""

# 1. Recursive Approach
# Time Complexity: O(2^n)
# Space Complexity: O(n) for the call stack

def climbStairs_recursive(n):
    if n <= 2:
        return n
    return climbStairs_recursive(n-1) + climbStairs_recursive(n-2)

# 2. Memoization Approach
# Time Complexity: O(n)
# Space Complexity: O(n) for the memoization dictionary and call stack

def climbStairs_memoization(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return n
    memo[n] = climbStairs_memoization(n-1, memo) + climbStairs_memoization(n-2, memo)
    return memo[n]

# 3. Bottom-up Dynamic Programming Approach
# Time Complexity: O(n)
# Space Complexity: O(n) for the DP array

def climbStairs_dp(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

"""
Example Walkthrough (n = 5):
Initialize: dp = [0, 1, 2, 0, 0, 0]
            i = 3: dp[3] = dp[2] + dp[1] = 2 + 1 = 3
            i = 4: dp[4] = dp[3] + dp[2] = 3 + 2 = 5
            i = 5: dp[5] = dp[4] + dp[3] = 5 + 3 = 8

Final array: dp = [0, 1, 2, 3, 5, 8]
Result: dp[5] = 8

This means there are 8 distinct ways to climb 5 stairs.
"""
# Example usage
n = 5
print(f"Recursive: {climbStairs_recursive(n)}")
print(f"Memoization: {climbStairs_memoization(n)}")
print(f"Bottom-up DP: {climbStairs_dp(n)}")