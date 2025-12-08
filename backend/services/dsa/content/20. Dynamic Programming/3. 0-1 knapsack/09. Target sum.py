
""" 
Count of Subsets with Given Difference

Problem Statement:
   Given an array of integers nums and an integer target, you need to find the total number of ways to assign + and - signs 
   to each integer in nums so that the sum of all elements equals the target.

For example:
    Input: nums = [1,1,1,1,1], target = 3
    Output: 5
    Explanation: There are 5 ways to assign symbols to make the sum of nums be target 3.
    -1 + 1 + 1 + 1 + 1 = 3
    +1 - 1 + 1 + 1 + 1 = 3
    +1 + 1 - 1 + 1 + 1 = 3
    +1 + 1 + 1 - 1 + 1 = 3
    +1 + 1 + 1 + 1 - 1 = 3

Approach:
    exact problem as the number of subset sum in given diff 

Time Complexity: O(n * target_sum)

Space Complexity: O(n * target_sum)

Code Implementation:
"""

# Example usage
# arr = [1, 1, 1, 1,1]
# target = 3
# result = count_subsets_with_diff(arr, target)
# print(f"Number of subsets with difference {target}: {result}")


