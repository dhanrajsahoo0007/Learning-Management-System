"""
Problem Statement:
    Given an array of positive integers nums, partition the array into two non-empty subsets such that
    the difference between the sum of the elements in the two subsets is minimized. Return the minimum possible difference.

For example, 
    if nums = [1, 5, 11, 5], 
    the optimal partition would be [1, 5, 5] and [11], 
    and the minimum difference would be |1 + 5 + 5 - 11| = 0.

Explanation:
    1. The Minimum Subset Sum Difference problem can be solved using dynamic programming. 
    2. The key idea is to build a 2D boolean table dp where dp[i][j] represents whether it is possible to form 
       a subset with sum j using the first i elements of the input array nums.
    3. The subset_sum_exists function is a helper function that determines whether it is possible to form a subset with the given target sum using the input array. 
       It fills the dp table based on the following recurrence relation:
    4. If the current element numbers[i-1] is greater than the current sum j, then dp[i][j] = dp[i-1][j].
       Otherwise, dp[i][j] = dp[i-1][j] or dp[i-1][j-numbers[i-1]].
    5. The minimumDifference function then uses the dp table to find the minimum difference between the sums of two disjoint subsets. 
       It iterates through the last row of the dp table and computes the difference between totalSum and 2 * j for each j where dp[n][j] is True.

Time Complexity:
    The overall time complexity of both the subset_sum_exists and minimumDifference functions is O(n * totalSum),
    where n is the length of the input array nums and totalSum is the total sum of all elements.
    This is because the algorithms fill a 2D table dp of size (n+1) x (totalSum//2 + 1), 
    and for each cell in the table, the algorithms perform a constant number of operations to compute the value based on the recurrence relation.

Space Complexity:
    The space complexity of both the subset_sum_exists and minimumDifference functions is O(n * totalSum),
    where n is the length of the input array nums and totalSum is the total sum of all elements.
    This is because the algorithms use a 2D table dp of size (n+1) x (totalSum//2 + 1) to store the possible subset sums. 
    The additional space required is proportional to the size of this table, which is O(n * totalSum).

Constraints:

    The input array nums contains only positive integers.
    The length of the input array nums is between 1 and 20.
    The sum of all elements in the input array nums is between 1 and 3000.


"""

def subset_sum_exists(numbers, target_sum):

    n = len(numbers)
    dp = [[False for _ in range(target_sum + 1)] for _ in range(n + 1)]
    
    # Initialize the first column as True (empty subset sums to 0)
    for i in range(n + 1):
        dp[i][0] = True
    
    # Fill the dp table
    for i in range(1, n + 1):
        for j in range(1, target_sum + 1):
            if numbers[i-1] <= j:
                # We can either include the current number or exclude it
                dp[i][j] = dp[i-1][j - numbers[i-1]] or dp[i-1][j]
            else:
                # Current number is too large, so we exclude it
                dp[i][j] = dp[i-1][j]
    
    return dp[n][target_sum], dp

def minimumDifference(nums):

    n = len(nums)
    total_sum = sum(nums)
    
    # Use the subset_sum_exists function to build the dp table
    _, dp = subset_sum_exists(nums, total_sum // 2)
    
    # Find the minimum difference
    min_diff = float('inf')
    ## we only need the last row to iterate over 
    for j in range(total_sum // 2 + 1):
        if dp[n][j]:
            min_diff = min(min_diff, total_sum - 2 * j)
    
    return min_diff