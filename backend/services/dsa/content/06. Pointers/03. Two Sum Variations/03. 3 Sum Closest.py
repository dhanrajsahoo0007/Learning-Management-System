"""
Problem Statement : 3Sum Closest

    Given an integer array nums of length n and an integer target, find three integers
    in nums such that the sum is closest to target.

    Return the sum of the three integers.

    You may assume that each input would have exactly one solution.

Time Complexity: O(n^2), where n is the length of the input array.
    - Sorting takes O(n log n)
    - The nested loops (one explicit, one while loop) take O(n^2)

Space Complexity: O(1) or O(n)
    - O(1) if we don't count the space for sorting (depends on the sorting algorithm used)
    - O(n) if we include the space needed for sorting

Examples:
1. Input: nums = [-1,2,1,-4], target = 1
   Output: 2
   Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

2. Input: nums = [0,0,0], target = 1
   Output: 0
   Explanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).

Constraints:
    - 3 <= nums.length <= 1000
    - -1000 <= nums[i] <= 1000
    - -10^4 <= target <= 10^4
"""

class Solution:
    def threeSumClosest(self, nums: list[int], target: int) -> int:
        n = len(nums)
        nums.sort()  # Sort the array to use two-pointer technique
        
        closest_sum = float('inf')  # Initialize with positive infinity
        
        for i in range(n - 2):  # Iterate up to third last element
            left = i + 1
            right = n - 1
            
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                
                # Update closest_sum if current_sum is closer to target
                if abs(target - current_sum) < abs(target - closest_sum):
                    closest_sum = current_sum
                
                if current_sum > target:
                    right -= 1  # Sum too large, decrease right pointer
                else:
                    left += 1  # Sum too small or equal, increase left pointer
                
                # Optional optimization: if we found the target, we can return immediately
                if closest_sum == target:
                    return closest_sum
        
        return closest_sum

# Test the solution
solution = Solution()

# Test case 1
nums1 = [-1,2,1,-4]
target1 = 1
print(f"Input: nums = {nums1}, target = {target1}")
print(f"Output: {solution.threeSumClosest(nums1, target1)}")
print()

# Test case 2
nums2 = [0,0,0]
target2 = 1
print(f"Input: nums = {nums2}, target = {target2}")
print(f"Output: {solution.threeSumClosest(nums2, target2)}")