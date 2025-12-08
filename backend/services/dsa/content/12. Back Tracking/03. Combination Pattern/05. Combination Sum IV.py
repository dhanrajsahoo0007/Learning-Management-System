"""
Problem Statement: Combination Sum IV

Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target.

The test cases are generated so that the answer can fit in a 32-bit integer.

Example 1:
    Input: nums = [1,2,3], target = 4
    Output: 7
    Explanation:
        The possible combination ways are:
        (1, 1, 1, 1)
        (1, 1, 2)
        (1, 2, 1)
        (1, 3)
        (2, 1, 1)
        (2, 2)
        (3, 1)
Note that different sequences are counted as different combinations.

Example 2:
    Input: nums = [9], target = 3
    Output: 0

Constraints:
    1 <= nums.length <= 200
    1 <= nums[i] <= 1000
    All the elements of nums are unique.
    1 <= target <= 1000

Visualization of the backtracking process for nums = [1,2,3], target = 4:

                       4
            /          |          \
           3           2           1
        /  |  \      / |  \      / |  \
       2   1   0    1  0  -1    0  -1 -2
     / | \  | \    | \
    1  0 -1 0 -1   0 -1
   /|\
  0-1-2

Each node represents the remaining target after choosing a number.
Paths ending with 0 are valid combinations.
Paths ending with negative numbers are pruned.

The valid paths are:
1. 4 -> 3 -> 2 -> 1 -> 0  (1,1,1,1)
2. 4 -> 3 -> 1 -> 0      (1,1,2)
3. 4 -> 2 -> 1 -> 0      (1,2,1)
4. 4 -> 1 -> 0           (1,3)
5. 4 -> 2 -> 2 -> 0      (2,2)
6. 4 -> 2 -> 1 -> 0      (2,1,1)
7. 4 -> 1 -> 0           (3,1)

Note: This implementation uses backtracking, which is not the most efficient approach for this problem.
A dynamic programming solution would be more suitable for larger inputs.
"""

class Solution:
    def __init__(self):
        self.result = 0  # Counter for valid combinations

    def solve(self, nums: list[int], target: int, temp: list[int]) -> None:
        # Base case: if we've reached the target sum
        if target == 0:
            self.result += 1  # Increment the counter
            return
        
        # Pruning: stop if target becomes negative
        if target < 0:
            return
        
        # Try all possible numbers
        for num in nums:
            temp.append(num)  # Add current number to the combination
            # Recurse with reduced target
            self.solve(nums, target - num, temp)
            temp.pop()  # Backtrack: remove the last added number

    def combinationSum4(self, nums: list[int], target: int) -> int:
        temp = []  # Temporary list to build combinations
        self.result = 0  # Reset result counter
        self.solve(nums, target, temp)  # Start solving
        return self.result

# Example usage
solution = Solution()
nums = [1, 2, 3]
target = 4
result = solution.combinationSum4(nums, target)
print(f"Input: nums = {nums}, target = {target}")
print(f"Output: {result}")  # Output: 7

nums = [9]
target = 3
result = solution.combinationSum4(nums, target)
print(f"\nInput: nums = {nums}, target = {target}")
print(f"Output: {result}")  # Output: 0




"""
Optimal Approach:
We'll use dynamic programming to solve this problem efficiently.
    1. Create a DP array where dp[i] represents the number of ways to form sum i.
    2. Initialize dp[0] = 1 (there's one way to form sum 0: by choosing nothing).
    3. Iterate from 1 to target, and for each sum i:
        - For each number in nums, if it's less than or equal to i, add dp[i - num] to dp[i].
    4. Return dp[target] as the final answer.

Time Complexity: O(target * len(nums))
Space Complexity: O(target)

Visual representation of the DP process for nums = [1,2,3], target = 4:

    dp[0] = 1 (base case)
    dp[1] = dp[0] = 1  (using 1)
    dp[2] = dp[1] + dp[0] = 2  (using 1 and 2)
    dp[3] = dp[2] + dp[1] + dp[0] = 4  (using 1, 2, and 3)
    dp[4] = dp[3] + dp[2] + dp[1] = 7  (final answer)

This shows how we build up the solution for larger sums using the solutions for smaller sums.
"""

class SolutionOptimal:
    def combinationSum4(self, nums: list[int], target: int) -> int:
        # Initialize DP array with 0s
        dp = [0] * (target + 1)
        
        # Base case: there's one way to form sum 0
        dp[0] = 1
        
        # Build up the DP array
        for i in range(1, target + 1):
            for num in nums:
                if num <= i:
                    dp[i] += dp[i - num]
        
        # Return the number of combinations for the target
        return dp[target]

# Example usage
solution = SolutionOptimal()
nums = [1, 2, 3]
target = 4
result = solution.combinationSum4(nums, target)
print(f"Input: nums = {nums}, target = {target}")
print(f"Output: {result}")  # Output: 7

nums = [9]
target = 3
result = solution.combinationSum4(nums, target)
print(f"\nInput: nums = {nums}, target = {target}")
print(f"Output: {result}")  # Output: 0