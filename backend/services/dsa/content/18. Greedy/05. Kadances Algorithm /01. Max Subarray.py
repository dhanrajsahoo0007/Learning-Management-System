"""
Problem Statement:
    Maximum Subarray
    Given an integer array nums, find the subarray with the largest sum, and return its sum.

    Example 1:
    Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
    Output: 6
    Explanation: The subarray [4,-1,2,1] has the largest sum 6.

    Example 2:
    Input: nums = [1]
    Output: 1
    Explanation: The subarray [1] has the largest sum 1.

    Example 3:
    Input: nums = [5,4,-1,7,8]
    Output: 23
    Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

Explanation:
    This solution uses Kadane's algorithm to find the maximum subarray sum:
    1. Initialize maxSub with the first element and curSum as 0.
    2. Iterate through the array:
       - If curSum becomes negative, reset it to 0.
       - Add the current number to curSum.
       - Update maxSub if curSum is greater.
    3. Return maxSub as the result.

Time Complexity: O(n), where n is the length of the input array.
We iterate through the array once.

Space Complexity: O(1)
We only use two variables regardless of the input size.
"""
from typing import List
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        maxSub = nums[0]
        curSum = 0
        for n in nums:
            if curSum < 0:
                curSum = 0
            curSum += n
            maxSub = max(maxSub, curSum)
        return maxSub

# Test the solution
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    nums1 = [-2,1,-3,4,-1,2,1,-5,4]
    print(f"Input: {nums1}")
    print(f"Output: {solution.maxSubArray(nums1)}")
    
    # Test case 2
    nums2 = [1]
    print(f"Input: {nums2}")
    print(f"Output: {solution.maxSubArray(nums2)}")
    
    # Test case 3
    nums3 = [5,4,-1,7,8]
    print(f"Input: {nums3}")
    print(f"Output: {solution.maxSubArray(nums3)}")
