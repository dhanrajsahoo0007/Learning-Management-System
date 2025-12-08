"""
Remove duplicates from a sorted array in-place.

    This function removes duplicates from the input array 'nums' which is sorted
    in non-decreasing order. It modifies the array in-place such that each unique
    element appears only once, maintaining the relative order of elements.

Algorithm:
    1. Use two pointers: L and R
        - L keeps track of the position to place the next unique element
        - R iterates through the array
    2. Start L at 1 (first element is always unique in a sorted array)
    3. Iterate through the array starting from the second element (index 1)
    4. If nums[R] != nums[R-1], we've found a new unique element:
        - Place this element at position L
        - Increment L
    5. After the loop, L represents the number of unique elements

Time Complexity: O(n), where n is the length of the input array
Space Complexity: O(1), as we modify the array in-place

Returns:
int: The number of unique elements in nums (also the length of the modified portion)

Examples:
1. Input: nums = [1,1,2]
   Output: 2, nums = [1,2,_]
   Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
   It does not matter what you leave beyond the returned k (hence they are underscores).

2. Input: nums = [0,0,1,1,1,2,2,3,3,4]
   Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
   Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
   It does not matter what you leave beyond the returned k (hence they are underscores).

"""
from typing import List 

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if not nums:
            return 0
        
        L = 1  # Start from the second element
        
        for R in range(1, len(nums)):
            if nums[R] != nums[R - 1]:
                nums[L] = nums[R]
                L += 1
        
        return L

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    nums1 = [1, 1, 2]
    k1 = solution.removeDuplicates(nums1)
    print(f"Test case 1: k = {k1}, nums = {nums1[:k1]}")
    # Expected: k = 2, nums = [1, 2]

    # Test case 2
    nums2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
    k2 = solution.removeDuplicates(nums2)
    print(f"Test case 2: k = {k2}, nums = {nums2[:k2]}")
    # Expected: k = 5, nums = [0, 1, 2, 3, 4]

    # Test case 3 (empty array)
    nums3 = []
    k3 = solution.removeDuplicates(nums3)
    print(f"Test case 3: k = {k3}, nums = {nums3[:k3]}")
    # Expected: k = 0, nums = []

    # Test case 4 (all elements are the same)
    nums4 = [1, 1, 1, 1, 1]
    k4 = solution.removeDuplicates(nums4)
    print(f"Test case 4: k = {k4}, nums = {nums4[:k4]}")
    # Expected: k = 1, nums = [1]