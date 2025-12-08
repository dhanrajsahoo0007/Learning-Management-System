"""
Problem Statement:
    Given an integer array nums of unique elements, return all possible subsets(the power set).
    The solution set must not contain duplicate subsets. Return the solution in any order.

Example 1:
    Input: nums = [1,2,3]
    Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
Example 2:
    Input: nums = [0]
    Output: [[],[0]]
    
Approach:
    We'll use a backtracking approach to generate all subsets.
    1. Start with an empty subset.
    2. For each element, we have two choices: include it in the current subset or not.
    3. Recursively generate subsets for the remaining elements.
    4. Add each generated subset to the result.

Time Complexity: O(2^n), where n is the number of elements in nums.
We have two choices (include or not) for each element, leading to 2^n subsets.

Space Complexity: O(n), where n is the number of elements in nums.
This accounts for the recursion stack. The space to store all subsets is not counted as auxiliary space.
    
Key Points:
    1. Every subset is valid, including the empty set and the full set.
    2. The order of elements in each subset doesn't matter, but we maintain a specific order to avoid duplicates.
    3. We add each subset to the result immediately, before making recursive calls.
    4. Backtracking ensures we explore all possibilities efficiently.

Visualization of the backtracking process for [1,2,3]:

                      []
           /          |          \
         [1]         [2]         [3]
       /     \        |
    [1,2]   [1,3]    [2,3]
      |
   [1,2,3]

"""

class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        def backtrack(start, current_subset):
            # Add the current subset to the result
            # we are adding the copy
            result.append(current_subset.copy())
            # result.append(current_subset[:])
            
            # Generate subsets by including elements from start to end
            for i in range(start, len(nums)):
                # Include the current element
                current_subset.append(nums[i])
                # Recursively generate subsets for the remaining elements
                backtrack(i + 1, current_subset)
                # Backtrack: remove the last added element
                current_subset.pop()

        result = []
        backtrack(0, [])
        return result

# Example usage:
solution = Solution()
print(solution.subsets([1,2,3]))
print(solution.subsets([0]))
input = "abc"
print(solution.subsets(list(input)))

