"""
Problem Statement:
    Given a set of non-negative integers and a target sum, determine if there exists
    a subset of the given set with a sum equal to the target sum. If such a subset
    exists, return the subset.

Explanation:
    This problem is solved using dynamic programming. We create a 2D table where
    dp[i][j] represents whether it's possible to achieve a sum of j using the first
    i elements of the input array. We fill this table bottom-up and then backtrack
    to find the actual subset if a solution exists.

Time Complexity: O(n * target_sum)
    - We fill a 2D table of size (n+1) * (target_sum+1)
    - n is the number of elements in the input array

Space Complexity: O(n * target_sum)
    - We use a 2D dp table of size (n+1) * (target_sum+1)

Note: This implementation prioritizes clarity and modularity over optimal space
    efficiency. A more space-efficient version could use a 1D dp array, reducing
    space complexity to O(target_sum), but at the cost of making backtracking more
    complex.
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

def find_subset_sum(numbers, target_sum):
    """
    Finds a subset of numbers that sum up to the target sum, if it exists.
    
    Args:
    numbers (list): List of non-negative integers
    target_sum (int): The target sum to achieve
    
    Returns:
    list or None: A subset of numbers that sum to target_sum, or None if no such subset exists
    
    Time Complexity: O(n * target_sum)
    Space Complexity: O(n * target_sum)
    """
    exists, dp = subset_sum_exists(numbers, target_sum)
    
    if not exists:
        return None
    
    # Backtrack to find the subset
    subset = []
    i, j = len(numbers), target_sum
    while i > 0 and j > 0:
        if i > 0 and dp[i][j] != dp[i-1][j]:
            subset.append(numbers[i-1])
            j -= numbers[i-1]
        i -= 1
    
    return subset

# Example usage
if __name__ == "__main__":
    numbers = [3, 34, 4, 12, 5, 2]
    target_sum = 9

    # Check if a subset sum exists
    exists, _ = subset_sum_exists(numbers, target_sum)
    print(f"input -> {numbers}")
    print(f"Subset with sum {target_sum} exists: {exists}")

    # Find the subset if it exists
    subset = find_subset_sum(numbers, target_sum)
    if subset:
        print(f"Subset: {subset}")
    else:
        print("No subset found.")