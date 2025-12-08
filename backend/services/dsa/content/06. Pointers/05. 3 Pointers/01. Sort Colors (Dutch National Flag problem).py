"""
Problem Statement:
    Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent,
    with the colors in the order red, white, and blue.

    We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.

    You must solve this problem without using the library's sort function.

Time Complexity: O(n), where n is the number of elements in the array.
Space Complexity: O(1), as we're sorting in-place with only a constant amount of extra space.

Explanation:
    This solution uses the Dutch National Flag algorithm, which partitions the array into three parts:
        - Left part: all 0s (red)
        - Middle part: all 1s (white)
        - Right part: all 2s (blue)

We use three pointers:
    - i: rightmost boundary of 0s
    - j: current element under consideration
    - k: leftmost boundary of 2s

We iterate through the array using j, and swap elements to their correct positions:
    - If we find a 0, we swap it with the element at i and increment both i and j.
    - If we find a 2, we swap it with the element at k and decrement k.
    - If we find a 1, we leave it in place and increment j.

This process continues until j crosses k.

Examples:
1. Input: nums = [2,0,2,1,1,0]
   Output: [0,0,1,1,2,2]

2. Input: nums = [2,0,1]
   Output: [0,1,2]
"""

class Solution:
    def sortColors(self, nums: list[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        n = len(nums)
        
        i = 0   # rightmost boundary of 0s (red)
        j = 0   # current element under consideration
        k = n - 1  # leftmost boundary of 2s (blue)
        
        while j <= k:
            if nums[j] == 0:
                # Swap 0 to the left part
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
                j += 1
            elif nums[j] == 2:
                # Swap 2 to the right part
                nums[j], nums[k] = nums[k], nums[j]
                k -= 1
            else:  # nums[j] == 1
                # Leave 1 in the middle
                j += 1

# Test the solution
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    nums1 = [2,0,2,1,1,0]
    solution.sortColors(nums1)
    print(f"Test case 1: {nums1}")  # Expected: [0,0,1,1,2,2]
    
    # Test case 2
    nums2 = [2,0,1]
    solution.sortColors(nums2)
    print(f"Test case 2: {nums2}")  # Expected: [0,1,2]