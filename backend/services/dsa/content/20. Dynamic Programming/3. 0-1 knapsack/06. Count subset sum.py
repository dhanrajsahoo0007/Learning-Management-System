"""
Count of Subsets Sum with a Given Sum

Problem Statement:
    Count of Subsets Sum with a Given Sum
    Given an array of non-negative integers and a target sum, count the number of subsets of the given array with a sum equal to the target sum.

Example:
    Input: arr[] = {1, 2, 3, 3}, target sum = 6
    Output: 3
    The subsets with sum 6 are {1, 2, 3}, {1, 2, 3}, and {3, 3}

Constraints:
    - All numbers in the array are non-negative integers.
    - The order of numbers in the subset doesn't matter.
    - An empty subset is not considered as a valid solution.

Approach:
    1. Use dynamic programming with a 2D DP table.
    2. dp[i][j] represents the count of subsets with sum j using the first i elements.
    3. Initialize base cases:
    - For sum 0, there's always one subset (empty subset) for any number of elements.
    - For no elements, only sum 0 has one subset.
    4. Fill the DP table:
    - For each element and sum, consider including or excluding the current element.
    - The count is the sum of these two choices.
    5. The final answer is in dp[n][target], where n is the number of elements.

Time Complexity: O(n * sum)
    - Iterate through each element: O(n)
    - Consider all possible sums from 0 to target sum: O(sum)
    - Total: O(n * sum)

Space Complexity: O(n * sum)
    - 2D DP table of size (n+1) * (sum+1)
    - No additional space used other than the DP table

"""

def count_subsets_with_sum(arr, target_sum):
    n = len(arr)
    dp = [[0 for _ in range(target_sum + 1)] for _ in range(n + 1)]
    
    # Initialize base cases
    for i in range(n + 1):
        dp[i][0] = 1
    
    # Fill the dp table
    for i in range(1, n + 1):
        for j in range(target_sum + 1):
            if arr[i-1] <= j:
                dp[i][j] = dp[i-1][j] + dp[i-1][j-arr[i-1]]
            else:
                dp[i][j] = dp[i-1][j]
    
    return dp[n][target_sum]

# Example usage
arr = [1, 2, 3, 3]
target_sum = 6
result = count_subsets_with_sum(arr, target_sum)
print(f"Number of subsets with sum {target_sum}: {result}")

"""

Optimization or Variations:
    1. Space Optimization: Reduce space complexity to O(sum) using only two rows.
    2. Handling Negative Numbers: Modify approach for inputs with negative numbers.
    3. Counting Subsets with Sum in a Range: Extend to count subsets within a sum range.
"""

# Additional function demonstrating space optimization
def count_subsets_with_sum_optimized(arr, target_sum):
    n = len(arr)
    dp = [0] * (target_sum + 1)
    dp[0] = 1
    
    for num in arr:
        for j in range(target_sum, num - 1, -1):
            dp[j] += dp[j - num]
    
    return dp[target_sum]

# Example usage of optimized version
result_optimized = count_subsets_with_sum_optimized(arr, target_sum)
print(f"Number of subsets with sum {target_sum} (optimized): {result_optimized}")