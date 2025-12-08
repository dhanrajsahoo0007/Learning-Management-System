"""
Maximum Sum of Non-Adjacent Elements | House Robber Problem

Problem Statement:
    You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed,
    the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected
    and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money
you can rob tonight without alerting the police.

Example:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Constraints:
1 <= nums.length <= 100
0 <= nums[i] <= 400
"""

# 1. Recursive Approach
def rob_recursive(nums):
    def rob_helper(i):
        if i < 0:
            return 0
        return max(rob_helper(i-1), rob_helper(i-2) + nums[i])
    
    return rob_helper(len(nums) - 1)

# 2. Memoized Approach
def rob_memoized(nums):
    memo = {}
    
    def rob_helper(i):
        if i in memo:
            return memo[i]
        if i < 0:
            return 0
        result = max(rob_helper(i-1), rob_helper(i-2) + nums[i])
        memo[i] = result
        return result
    
    return rob_helper(len(nums) - 1)

# 3. Dynamic Programming Approach
def rob_dp(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[-1]

# 4. Space-Optimized Dynamic Programming Approach
def rob_dp_optimized(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1

# Test the functions
nums = [2,7,9,3,1]
print(f"Recursive approach result: {rob_recursive(nums)}")
print(f"Memoized approach result: {rob_memoized(nums)}")
print(f"Dynamic Programming approach result: {rob_dp(nums)}")
print(f"Optimized DP approach result: {rob_dp_optimized(nums)}")

"""
Explanation of approaches:

1. Recursive Approach:
   - Base case: If the index is negative, return 0 (no houses to rob).
   - For each house, we have two choices:
     a) Skip this house and take the maximum from the previous houses.
     b) Rob this house and add its value to the maximum from two houses before.
   - We take the maximum of these two choices.
   - Time Complexity: O(2^n) - we make two recursive calls for each house.
   - Space Complexity: O(n) for the recursion stack.

2. Memoized Approach:
   - Similar to the recursive approach, but we store computed results in a memo dictionary.
   - Before computing, we check if the result for the current index is already in memo.
   - After computing, we store the result in memo before returning.
   - Time Complexity: O(n) - we compute the result for each index only once.
   - Space Complexity: O(n) for the memo dictionary and the recursion stack.

3. Dynamic Programming Approach:
   - We build our solution iteratively from the bottom up.
   - dp[i] represents the maximum amount we can rob up to the i-th house.
   - For each house, we decide whether to rob it based on:
     dp[i] = max(dp[i-1], dp[i-2] + nums[i])
   - Time Complexity: O(n) - we iterate through the array once.
   - Space Complexity: O(n) for the dp array.

4. Space-Optimized Dynamic Programming Approach:
   - Instead of keeping the entire dp array, we only keep track of the two previous values.
   - This reduces the space complexity to O(1) while maintaining the same time complexity.
   - Time Complexity: O(n)
   - Space Complexity: O(1)

Key Insight:
    The core of this problem lies in the decision at each house: do we rob it or not? If we rob it, we can't rob the
    previous house. If we don't rob it, we take the maximum up to the previous house. This forms the basis of our
    recurrence relation: max(previous, twoHousesBefore + current).

"""