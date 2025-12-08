
""" 
Count of Subsets with Given Difference

Problem Statement:
    Given an array of integers and a difference 'diff', count the number of subsets of the array with a difference between their sums equal to 'diff'.

For example:
    Input: arr[] = [1, 1, 2, 3], diff = 1
    Output: 3
    Explanation: The subsets are: {1, 3} and {1, 2}, {1, 3} and {1, 2}, {1, 1, 2} and {3}

Approach:
    1. Let S1 and S2 be the two subsets.
    2. We know: S1 + S2 = total_sum and S1 - S2 = diff
    3. Adding these equations: 2 * S1 = total_sum + diff
    4. Therefore, S1 = (total_sum + diff) / 2
    5. The problem reduces to finding the count of subsets with sum equal to (total_sum + diff) / 2
    6. We can use the given count_subsets_with_sum function with this target sum

Time Complexity: O(n * target_sum)
    1. Calculation of total_sum: O(n)
            We iterate through the array once to calculate the sum of all elements.
    2. Main DP computation: O(n * target_sum)
        * We use a nested loop structure:
            * Outer loop iterates n times (for each element in the array)
            * Inner loop iterates target_sum times
        * For each cell in the DP table, we perform constant time operations
    
    3. target_sum calculation: target_sum = (total_sum + diff) / 2
        In the worst case, target_sum ≈ total_sum / 2
        total_sum can be at most n * max(arr), where max(arr) is the maximum element in the array
    
    Therefore, the overall time complexity is O(n * target_sum), which can also be expressed as O(n^2 * max(arr)) in the worst case.

Space Complexity: O(n * target_sum)
    The space complexity is determined by the size of the DP table:
    1. DP Table: O(n * target_sum)
        We create a 2D array of size (n+1) * (target_sum+1)
    2. Additional Variables: O(1)
        We use a constant amount of extra space for variables like total_sum, diff, etc.
    Therefore, the overall space complexity is O(n * target_sum).


Key Points:
    1. Problem Transformation: We transform the problem into a subset sum counting problem.
    2. Even Sum Requirement: (total_sum + diff) must be even for a solution to exist.
    3. Negative Numbers: This approach works for positive numbers. For negative numbers, additional handling is needed.
    4. Overlapping Subproblems: The dynamic programming approach efficiently handles overlapping subproblems.

Code Implementation:
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

def count_subsets_with_diff(arr, diff):
    total_sum = sum(arr)
    
    # Check if a solution is possible
    if (total_sum + diff) % 2 != 0:
        return 0
    
    target_sum = (total_sum + diff) // 2
    
    return count_subsets_with_sum(arr, target_sum)

# Example usage
arr = [1, 1, 2, 3]
diff = 1
result = count_subsets_with_diff(arr, diff)
print(f"Number of subsets with difference {diff}: {result}")


