"""
Problem: Kth Missing Positive Number

    Given an array arr of positive integers sorted in a strictly increasing order, and an integer k.
    Return the kth positive integer that is missing from this array.

Example 1:
    Input: arr = [2,3,4,7,11], k = 5
    Output: 9
    Explanation: The missing positive integers are [1,5,6,8,9,10,12,13,...]. The 5th missing positive integer is 9.

Example 2:
    Input: arr = [1,2,3,4], k = 2
    Output: 6
    Explanation: The missing positive integers are [5,6,7,...]. The 2nd missing positive integer is 6.

Constraints:
    1 <= arr.length <= 1000
    1 <= arr[i] <= 1000
    1 <= k <= 1000
    arr[i] < arr[j] for 1 <= i < j <= arr.length

Time Complexity: O(log n), where n is the length of the array
Space Complexity: O(1)

Explanation:
    This solution uses a binary search approach to efficiently find the kth missing positive number.
    The key insight is that for each index i, the number of missing positives up to arr[i] is arr[i] - (i + 1).

We perform a binary search on the array:
    1. If the number of missing positives at the middle element is less than k, 
        we know the kth missing positive is in the right half of the array.
    2. Otherwise, it's in the left half (including the current middle element).

After the binary search, 'left' will be the index where the kth missing positive would be 
if it were inserted into the array. The actual kth missing positive is then left + k.

"""

from typing import List

class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        # Initialize pointers for binary search
        left, right = 0, len(arr) - 1
        
        while left <= right:
            # Calculate the middle index
            mid = (left + right) // 2
            
            # Calculate the number of missing positives up to arr[mid]
            # If arr[mid] is 7 and mid is 3, then 3 numbers are missing (1, 2, 3 are present, 4, 5, 6 are missing)
            missing = arr[mid] - (mid + 1)
            
            if missing < k:
                # If missing is less than k, the kth missing number is after mid
                left = mid + 1
            else:
                # If missing is greater than or equal to k, the kth missing number is at mid or before it
                right = mid - 1
        
        # After the binary search, 'left' is the insertion point for the kth missing number
        # The kth missing number is 'left' steps ahead of where it would be without any missing numbers
        # left represents how many numbers present 
        # k represents how many numbers missing 
        # left+ k is the missing number we are looking for 
        return left + k

# Test cases
def test_findKthPositive():
    solution = Solution()
    
    test_cases = [
        ([2,3,4,7,11], 5),
        ([1,2,3,4], 2),
        ([1,3,5,6,7], 2),
        ([2,3,4,5,6,7], 1),
        ([1,2,3,4,5,6,7,8,9,10], 3)
    ]
    
    for arr, k in test_cases:
        result = solution.findKthPositive(arr, k)
        print(f"Input: arr = {arr}, k = {k}")
        print(f"Output: {result}")
        print()

# Run the tests
test_findKthPositive()