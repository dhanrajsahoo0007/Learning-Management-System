"""
2530. Maximal Score After Applying K Operations

    You are given a 0-indexed integer array nums and an integer k. You have a starting score of 0.

    In one operation:
        1. Choose an index i such that 0 <= i < nums.length,
        2. Increase your score by nums[i], and
        3. Replace nums[i] with ceil(nums[i] / 3).

    Return the maximum possible score you can attain after applying exactly k operations.


Time Complexity: O(n + k * log n), where n is the length of nums
    - O(n) for building the initial heap
    - O(k * log n) for k operations, each involving heap pop and push

Space Complexity: O(n) for the heap

Explanation:
    To maximize the score, we always want to choose the largest number available for each operation.
    This can be efficiently done using a max heap. We use Python's heapq module, which implements
    a min heap, so we negate the values to simulate a max heap.

1. Build a max heap with all numbers from the input array.
2. Perform k operations:
   a. Pop the largest number from the heap
   b. Add it to the score
   c. Calculate its new value (ceil of division by 3)
   d. Push the new value back to the heap
3. Return the final score

Examples:
1. nums = [10,10,10,10,10], k = 5
   Operations: 10 -> 4 -> 2 -> 1 -> 1
   Score: 10 + 10 + 10 + 10 + 10 = 50

2. nums = [1,10,3,3,3], k = 3
   Operations: 10 -> 4 -> 3
   Score: 10 + 4 + 3 = 17
"""

import heapq
import math
from typing import List 

class Solution:
    def maxKelements(self, nums: List[int], k: int) -> int:
        # Initialize max heap (using negative values for max heap behavior)
        max_heap = [-num for num in nums]
        heapq.heapify(max_heap)
        
        score = 0
        for _ in range(k):
            # Pop the largest element (negated)
            max_elem = -heapq.heappop(max_heap)
            
            # Add to score
            score += max_elem
            
            # Calculate new value and push back to heap
            new_value = math.ceil(max_elem / 3)
            heapq.heappush(max_heap, -new_value)
        
        return score
    
# Test the solution
def test_maxKelements():
    solution = Solution()
    
    # Test case 1
    nums1 = [10, 10, 10, 10, 10]
    k1 = 5
    result1 = solution.maxKelements(nums1, k1)
    print(f"Test case 1: nums = {nums1}, k = {k1}")
    print(f"Result: {result1}")
    print(f"Expected: 50")
    print()
    
    # Test case 2
    nums2 = [1, 10, 3, 3, 3]
    k2 = 3
    result2 = solution.maxKelements(nums2, k2)
    print(f"Test case 2: nums = {nums2}, k = {k2}")
    print(f"Result: {result2}")
    print(f"Expected: 17")
    print()
    
    # Additional test case
    nums3 = [5, 5, 5]
    k3 = 2
    result3 = solution.maxKelements(nums3, k3)
    print(f"Test case 3: nums = {nums3}, k = {k3}")
    print(f"Result: {result3}")
    print(f"Expected: 10")
    print()

# Run the tests
test_maxKelements()