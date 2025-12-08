# 1. Recursive Approach

def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)

"""
Recursive Approach:

Time Complexity: O(2^n)
Space Complexity: O(n) for the call stack
"""

# 2. Memoization Approach

def fib_memoization(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memoization(n-1, memo) + fib_memoization(n-2, memo)
    return memo[n]
"""
Memoization Approach:

Time Complexity: O(n)
Space Complexity: O(n) for the memoization dictionary and call stack
"""

# 3. Top-down Dynamic Programming Approach

def fib_top_down(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

"""
Top-down Dynamic Programming Approach:

Time Complexity: O(n)
Space Complexity: O(n) for the DP array
"""
# Example usage
n = 10
print(f"Recursive: {fib_recursive(n)}")
print(f"Memoization: {fib_memoization(n)}")
print(f"Top-down DP: {fib_top_down(n)}")