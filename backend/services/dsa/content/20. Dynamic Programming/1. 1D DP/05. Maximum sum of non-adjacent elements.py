"""
Maximum Sum of Non-Adjacent Elements

Problem Statement:
    Given an array of integers, find the maximum sum of a subsequence with the constraint that no two elements 
    in the sequence should be adjacent in the array.

Example:
Input: arr = [5, 5, 10, 100, 10, 5]
Output: 110
Explanation: We can choose elements 5 (index 0), 100 (index 3), and 5 (index 5). 
             These elements are not adjacent in the original array, and their sum is maximum.

Constraints:
1 <= arr.length <= 10^5
0 <= arr[i] <= 10^4
"""

# 1. Recursive Approach
def max_sum_recursive(arr, n):
    if n < 0:
        return 0
    if n == 0:
        return arr[0]
    
    # Either include the current element and skip the previous one,
    # or exclude the current element
    return max(max_sum_recursive(arr, n-2) + arr[n], max_sum_recursive(arr, n-1))

# 2. Memoized Approach
def max_sum_memoized(arr):
    memo = {}
    
    def helper(n):
        if n in memo:
            return memo[n]
        if n < 0:
            return 0
        if n == 0:
            return arr[0]
        
        memo[n] = max(helper(n-2) + arr[n], helper(n-1))
        return memo[n]
    
    return helper(len(arr) - 1)

# 3. Dynamic Programming Approach
def max_sum_dp(arr):
    n = len(arr)
    if n == 0:
        return 0
    if n == 1:
        return arr[0]
    
    dp = [0] * n
    dp[0] = arr[0]
    dp[1] = max(arr[0], arr[1])
    
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + arr[i])
    
    return dp[-1]

# 4. Space-Optimized Dynamic Programming Approach
def max_sum_dp_optimized(arr):
    n = len(arr)
    if n == 0:
        return 0
    if n == 1:
        return arr[0]
    
    prev2 = arr[0]
    prev1 = max(arr[0], arr[1])
    
    for i in range(2, n):
        current = max(prev1, prev2 + arr[i])
        prev2 = prev1
        prev1 = current
    
    return prev1

# Test the functions
arr = [5, 5, 10, 100, 10, 5]
print(f"Recursive approach result: {max_sum_recursive(arr, len(arr) - 1)}")
print(f"Memoized approach result: {max_sum_memoized(arr)}")
print(f"Dynamic Programming approach result: {max_sum_dp(arr)}")
print(f"Optimized DP approach result: {max_sum_dp_optimized(arr)}")

"""
Explanation of approaches:

1. Recursive Approach:
   - Base cases: 
     - If index is negative, return 0 (no elements to consider).
     - If index is 0, return the first element (only one element to consider).
   - For each element, we have two choices:
     a) Include this element and the maximum sum from two positions back.
     b) Exclude this element and take the maximum sum from the previous position.
   - We return the maximum of these two choices.
   - Time Complexity: O(2^n) - we potentially make two recursive calls for each element.
   - Space Complexity: O(n) for the recursion stack.

2. Memoized Approach:
   - Similar to the recursive approach, but we store computed results in a memo dictionary.
   - Before computing, we check if the result for the current index is already in memo.
   - After computing, we store the result in memo before returning.
   - Time Complexity: O(n) - we compute the result for each index only once.
   - Space Complexity: O(n) for the memo dictionary and the recursion stack.

3. Dynamic Programming Approach:
   - We build our solution iteratively from the bottom up.
   - dp[i] represents the maximum sum we can achieve up to index i.
   - For each element, we decide whether to include it based on:
     dp[i] = max(dp[i-1], dp[i-2] + arr[i])
   - Time Complexity: O(n) - we iterate through the array once.
   - Space Complexity: O(n) for the dp array.

4. Space-Optimized Dynamic Programming Approach:
   - Instead of keeping the entire dp array, we only keep track of the two previous values.
   - This reduces the space complexity to O(1) while maintaining the same time complexity.
   - Time Complexity: O(n)
   - Space Complexity: O(1)

Key Insight:
    The core of this problem lies in the decision for each element: do we include it or not? If we include it,
    we can't include the previous element. If we don't include it, we take the maximum sum up to the previous element.
    This forms the basis of our recurrence relation: max(previous, twoElementsBefore + current).

"""