"""
Problem Staement 
    Find two numbers in the array that add up to the target.

Example 1:
    Input: nums = [3,4,5,6], target = 7
    Output: [0,1]
    Explanation: nums[0] + nums[1] == 7, so we return [0, 1].
Example 2:
    Input: nums = [4,5,6], target = 10
    Output: [0,2]
"""
from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:

        num_map = {}  # Map to store number-to-index mapping
        
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        
        # This line should never be reached if the input is valid
        return []  # or raise an exception

# Test cases
solution = Solution()
print(solution.twoSum([3,4,5,6], 7))  # Output: [0, 1]
print(solution.twoSum([4,5,6], 10))   # Output: [0, 2]
