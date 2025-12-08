"""
Problem Statement: Minimum Number of Increments on Subarrays to Form a Target Array

    Given an integer array target, you have an initial array of the same size with all elements initially zeros.
    In one operation, you can choose any subarray from initial and increment each value by one.
    Return the minimum number of operations to form the target array from initial.

Example 1:

    Input: target = [1,2,3,2,1]
    Output: 3
    Explanation: We need at least 3 operations to form the target array from the initial array.
                [0,0,0,0,0] increment 1 from index 0 to 4 (inclusive).
                [1,1,1,1,1] increment 1 from index 1 to 3 (inclusive).
                [1,2,2,2,1] increment 1 at index 2.
                [1,2,3,2,1] target array is formed.

Example 2:

    Input: target = [3,1,1,2]
    Output: 4
    Explanation: [0,0,0,0] -> [1,1,1,1] -> [1,1,1,2] -> [2,1,1,2] -> [3,1,1,2]

Example 3:

    Input: target = [3,1,5,4,2]
    Output: 7
    Explanation: [0,0,0,0,0] -> [1,1,1,1,1] -> [2,1,1,1,1] -> [3,1,1,1,1] -> [3,1,2,2,2] -> [3,1,3,3,2] -> [3,1,4,4,2] -> [3,1,5,4,2].


Time Complexity: O(n), where n is the length of the target array.
    - We iterate through the array once.

Space Complexity: O(1)
    - We only use a constant amount of extra space.

Detailed explanation of the solution:

The key insight to solve this problem efficiently is to realize that we only need to count the number of "increases" in the target array. Here's why this works:

    1. Initial State: We start with all zeros.

    2. Observation: To reach any element in the target array, we need to perform at least as many operations as the value of that element.

    3. Optimization: However, we don't always need to start from zero for each element. 
        If the current element is smaller than or equal to the previous element, we don't need any additional operations for it.

    4. Key Point: We only need additional operations when the current element is greater than the previous element.

Algorithm:

1. Initialize the number of operations with the first element of the target array.
   This is because we always need at least this many operations to reach the first element.

2. Iterate through the array starting from the second element:
   - If the current element is greater than the previous element, add the difference to the total operations.
   - If it's smaller or equal, we don't need to do anything extra.

3. Return the total number of operations.

Why this works:
    - When we encounter an increase, we're essentially "building up" to that new height.
    - All the elements before this increase have already been accounted for.
    - We only need to perform additional operations for the amount of increase.
    - Decreases don't require any new operations because we can simply not include those positions in our subarray for the previous operations.

"""

class Solution:
    def minNumberOperations(self, target: list[int]) -> int:
        operations = target[0]  # Initialize with the first element
        
        for i in range(1, len(target)):
            # If current element is greater than the previous,
            # we need additional operations to reach this element
            if target[i] > target[i-1]:
                operations += target[i] - target[i-1]
        
        return operations

# Test cases
solution = Solution()

# Test case 1
print(solution.minNumberOperations([1,2,3,2,1]))  # Output: 3
# Explanation: 
# [0,0,0,0,0] -> [1,1,1,1,1] -> [1,2,2,2,1] -> [1,2,3,2,1]

# Test case 2
print(solution.minNumberOperations([3,1,1,2]))  # Output: 4
# Explanation:
# [0,0,0,0] -> [1,1,1,1] -> [2,1,1,1] -> [3,1,1,1] -> [3,1,1,2]

# Test case 3
print(solution.minNumberOperations([3,1,5,4,2]))  # Output: 7
# Explanation:
# [0,0,0,0,0] -> [1,1,1,1,1] -> [2,1,1,1,1] -> [3,1,1,1,1] -> 
# [3,1,2,2,2] -> [3,1,3,3,2] -> [3,1,4,4,2] -> [3,1,5,4,2]
