"""
Squares of a Sorted Array

    Given an integer array nums sorted in non-decreasing order, return an array 
    of the squares of each number sorted in non-decreasing order.

Time Complexity: O(n), where n is the length of the input array.
Space Complexity: O(n) for the result array.

Explanation:
    - The input array is sorted, but may contain negative numbers.
    - The largest squares will be from either the leftmost (most negative) 
        or rightmost (most positive) elements.
    - We use two pointers, one at each end of the array, to compare squares 
        and fill the result array from the end.

Examples:
1. Input: nums = [-4,-1,0,3,10]
    Output: [0,1,9,16,100]
    Explanation: After squaring, the array becomes [16,1,0,9,100].
                After sorting, it becomes [0,1,9,16,100].

2. Input: nums = [-7,-3,2,3,11]
    Output: [4,9,9,49,121]
"""

from typing import List 

class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
       
        n = len(nums)
        result = [0] * n  # Initialize result array with zeros
        left, right = 0, n - 1  # Two pointers: left at start, right at end
        
        for i in range(n - 1, -1, -1):  # Fill result array from the end
            left_square = nums[left] ** 2
            right_square = nums[right] ** 2
            
            if left_square > right_square:
                result[i] = left_square
                left += 1  # Move left pointer right
            else:
                result[i] = right_square
                right -= 1  # Move right pointer left
        
        return result

# Test the solution
solution = Solution()

# Test case 1
nums1 = [-4, -1, 0, 3, 10]
print(f"Input: nums = {nums1}")
print(f"Output: {solution.sortedSquares(nums1)}")
print()

# Test case 2
nums2 = [-7, -3, 2, 3, 11]
print(f"Input: nums = {nums2}")
print(f"Output: {solution.sortedSquares(nums2)}")