"""
Problem: Merge Sorted Array
    You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, 
    representing the number of elements in nums1 and nums2 respectively.
    Merge nums1 and nums2 into a single array sorted in non-decreasing order.
    The final sorted array should not be returned by the function, but instead be stored inside the array nums1. 

Time Complexity: O(m + n), where m and n are the number of elements in nums1 and nums2 respectively.
Space Complexity: O(1), as we're modifying nums1 in-place without using extra space.

Explanation:
    1. This solution uses a two-pointer approach, starting from the end of both arrays. 
    2. We compare elements from both arrays and place the larger one at the end of nums1. 
    3. We continue this process until we've processed all elements from nums2 or nums1. 
    4. If there are any elements left in nums2, we copy them to the beginning of nums1.

Examples:
1. Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
   Output: [1,2,2,3,5,6]

2. Input: nums1 = [1], m = 1, nums2 = [], n = 0
   Output: [1]

3. Input: nums1 = [0], m = 0, nums2 = [1], n = 1
   Output: [1]
"""

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:

        # Start from the end of both arrays
        while m > 0 and n > 0:
            # Compare the last elements of both arrays
            if nums1[m-1] >= nums2[n-1]:
                # If the last element of nums1 is larger or equal,
                # place it at the end of the merged array
                nums1[m+n-1] = nums1[m-1]
                # Move the pointer in nums1 one step back
                m -= 1
            else:
                # If the last element of nums2 is larger,
                # place it at the end of the merged array
                nums1[m+n-1] = nums2[n-1]
                # Move the pointer in nums2 one step back
                n -= 1
        
        # If there are remaining elements in nums2,
        # copy them to the beginning of nums1
        if n > 0:
            nums1[:n] = nums2[:n]

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    nums1 = [1, 2, 3, 0, 0, 0]
    m = 3
    nums2 = [2, 5, 6]
    n = 3
    solution.merge(nums1, m, nums2, n)
    print(f"Test case 1: {nums1}")  # Expected: [1, 2, 2, 3, 5, 6]

    # Test case 2
    nums1 = [1]
    m = 1
    nums2 = []
    n = 0
    solution.merge(nums1, m, nums2, n)
    print(f"Test case 2: {nums1}")  # Expected: [1]

    # Test case 3
    nums1 = [0]
    m = 0
    nums2 = [1]
    n = 1
    solution.merge(nums1, m, nums2, n)
    print(f"Test case 3: {nums1}")  # Expected: [1]