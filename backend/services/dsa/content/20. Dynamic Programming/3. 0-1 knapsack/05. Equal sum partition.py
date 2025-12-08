"""
Equal Sum Partition Problem

Problem Statement:
    Given an array of positive integers nums, determine if it is possible to partition the array into two non-empty subsets
    such that the sum of the elements in both subsets is equal.
    
For example,
    if nums = [1, 5, 11, 5], the optimal partition would be [1, 5, 5] and [11], and the sum of the elements in both subsets would be equal (11).

Explanation:
    This problem is a variation of the Subset Sum problem. 
    The key insight is that if we can find a subset that sums to half of the total sum of the list,
    then the remaining elements will automatically form the other subset with the same sum.

Algorithm:
    1. Calculate the total sum of the list.
    2. If the total sum is odd, return False (as it can't be divided into two equal parts).
    3. Set the target sum as half of the total sum.
    4. Use dynamic programming to find if there's a subset with sum equal to the target.

Time Complexity:

    The overall time complexity of the Equal Sum Partition algorithm is O(n * sum), where n is the length of the input array nums and sum is the total sum of all elements.
    This can be derived as follows:
        The algorithm fills a 2D table dp of size (n+1) x (sum//2 + 1).
        For each cell in the table, the algorithm performs a constant number of operations to compute the value based on the recurrence relation.
        Therefore, the total number of operations is proportional to the size of the table, which is (n+1) x (sum//2 + 1), or O(n * sum).

Space Complexity:
    The space complexity of the Equal Sum Partition algorithm is O(n * sum), where n is the length of the input array nums and sum is the total sum of all elements.
    This is because the algorithm uses a 2D table dp of size (n+1) x (sum//2 + 1) to store the possible subset sums. 
    The additional space required is proportional to the size of this table, which is O(n * sum).

"""

from typing import List, Tuple

def canPartition(nums):
    n = len(nums)
    total_sum = sum(nums)
    
    # If the total sum is odd, it's not possible to partition the array
    if total_sum % 2 != 0:
        return False
    
    target_sum = total_sum // 2
    dp = [[False] * (target_sum + 1) for _ in range(n + 1)]
    
    # Initialize the base case
    dp[0][0] = True
    
    # Fill the dp table
    for i in range(1, n + 1):
        for j in range(target_sum + 1):
            if nums[i - 1] > j:
                dp[i][j] = dp[i - 1][j]
            else:
                dp[i][j] = dp[i - 1][j] or dp[i - 1][j - nums[i - 1]]
    
    return dp[n][target_sum]

# Example usage
nums = [1, 5, 11, 5]
print(canPartition(nums))  