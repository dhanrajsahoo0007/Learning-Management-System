"""
Problem Statement:
    Given an array of integers and a positive integer k, determine if it's possible to divide 
    the array into sets of k consecutive numbers. 
    
    This problem is also known as "Hand of Straights" where the array represents card values and k is the group size.

    For "Divide Array in Sets of K Consecutive Numbers":
        - Input: An array of integers 'nums' and an integer 'k'
        - Output: True if the array can be divided into sets of k consecutive numbers, False otherwise

    For "Hand of Straights":
        - Input: An array 'hand' representing card values and an integer 'groupSize'
        - Output: True if the cards can be rearranged into groups of 'groupSize' consecutive cards, False otherwise

Approach:
    We use a combination of a hash map (Counter) to count occurrences of each number
    and a min heap to process numbers in ascending order. We check if we can form
    groups of k consecutive numbers starting from the smallest available number.

Time Complexity: O(n log n), where n is the length of the input array
    - Counting elements: O(n)
    - Heapify: O(n)
    - Main loop: O(n log n) due to heap operations

Space Complexity: O(n)
    - Counter: O(n)
    - Heap: O(n)
"""
import heapq
from collections import Counter
from typing import List

class Solution:
    def isPossibleDivide(self, nums: List[int], k: int) -> bool:
        # For "Hand of Straights", this method would be named isNStraightHand(self, hand, groupSize)
        if len(nums) % k != 0:
            return False

        num_counts = Counter(nums)
        min_heap = list(num_counts.keys())
        heapq.heapify(min_heap)

        while min_heap:
            start = min_heap[0]

            for num in range(start, start + k):
                if num not in num_counts:
                    return False
                
                num_counts[num] -= 1
                if num_counts[num] == 0:
                    if num != min_heap[0]:
                        return False
                    heapq.heappop(min_heap)
                
        return True

# Test cases
solution = Solution()

# Example 1
nums1 = [1,2,3,3,4,4,5,6]
k1 = 4
print(f"Test case 1: {solution.isPossibleDivide(nums1, k1)}")  # Expected: True

# Example 2
nums2 = [3,2,1,2,3,4,3,4,5,9,10,11]
k2 = 3
print(f"Test case 2: {solution.isPossibleDivide(nums2, k2)}")  # Expected: True

# Example 3
nums3 = [1,2,3,4]
k3 = 3
print(f"Test case 3: {solution.isPossibleDivide(nums3, k3)}")  # Expected: False

# Additional test cases
print(f"Test case 4: {solution.isPossibleDivide([1,2,3,4,5,6], 2)}")  # Expected: True
print(f"Test case 5: {solution.isPossibleDivide([1,1,2,2,3,3], 3)}")  # Expected: False