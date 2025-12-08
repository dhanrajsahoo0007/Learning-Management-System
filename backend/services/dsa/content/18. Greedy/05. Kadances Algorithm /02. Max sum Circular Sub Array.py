"""
Problem Statement:
    Given a circular integer array nums, find the maximum possible sum of a non-empty subarray.
    A circular array means the end of the array connects to the beginning.
    A subarray may only include each element of the fixed buffer nums at most once.

Explanation:
    1. We use Kadane's algorithm to find the maximum subarray sum in a linear array.
    2. We consider two cases:
            a. The maximum sum subarray doesn't include circular wrapping (normal Kadane's algorithm)
            b. The maximum sum subarray includes circular wrapping
    3. For case 2, 
            We invert the signs of all elements and find the minimum subarray sum.
            Then, we add this to the total sum of the array to get the maximum circular subarray sum.
    4. We return the maximum of case 1 and case 2, except when all numbers are negative.

Time Complexity: O(n), where n is the length of the input array.
                 We perform two passes through the array using Kadane's algorithm.

Space Complexity: O(1), We only use a constant amount of extra space for variables.

"""
from typing import List
class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        def kadane(arr):
            maxSum = float('-inf')
            currentSum = 0
            for num in arr:
                currentSum = max(num, currentSum + num)
                maxSum = max(maxSum, currentSum)
            return maxSum

        # Case 1: Maximum sum subarray doesn't include circular wrapping
        maxSum = kadane(nums)

        # Case 2: Maximum sum subarray includes circular wrapping
        totalSum = sum(nums)
        invertedSum = kadane([-num for num in nums])
        circularSum = totalSum + invertedSum    # This is equivalent to totalSum - (-invertedSum)

        # Handle the case where all numbers are negative
        if circularSum > 0:
            return max(maxSum, circularSum)
        else:
            return maxSum



if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1: Normal case
    nums1 = [1, -2, 3, -2]
    print(f"Test case 1: {nums1}")
    print(f"Output: {solution.maxSubarraySumCircular(nums1)}")
    print(f"Expected: 3\n")

    # Test case 2: Circular wrapping needed
    nums2 = [5, -3, 5]
    print(f"Test case 2: {nums2}")
    print(f"Output: {solution.maxSubarraySumCircular(nums2)}")
    print(f"Expected: 10\n")

    # Test case 3: All negative numbers
    nums3 = [-3, -2, -3]
    print(f"Test case 3: {nums3}")
    print(f"Output: {solution.maxSubarraySumCircular(nums3)}")
    print(f"Expected: -2\n")

    # Test case 4: Larger array with mixed positive and negative numbers
    nums4 = [3, -1, 2, -1, 3, 4, -1, 2, -1]
    print(f"Test case 4: {nums4}")
    print(f"Output: {solution.maxSubarraySumCircular(nums4)}")
    print(f"Expected: 12\n")

    # Test case 5: Array with all positive numbers
    nums5 = [1, 2, 3, 4, 5]
    print(f"Test case 5: {nums5}")
    print(f"Output: {solution.maxSubarraySumCircular(nums5)}")
    print(f"Expected: 15\n")