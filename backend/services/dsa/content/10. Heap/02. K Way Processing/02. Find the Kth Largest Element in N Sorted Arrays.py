"""
Problem: Find the Kth Largest Element in N Sorted Arrays
         Sorted arrays and an integer K. Your task is to find the Kth largest element among all the arrays.

Example 1:
    Input: 
        arrays = [
            [9, 8, 7, 6],
            [5, 4, 3],
            [2, 1]
        ]
        k = 3
    Output: 7
    Explanation: The 3rd largest element is 7.

Example 2:
    Input:
        arrays = [
            [5, 4],
            [3, 2],
            [1]
        ]
        k = 4
    Output: 2
    Explanation: The 4th largest element is 2.

Constraints:
    1 <= N <= 10^4 (number of arrays)
    1 <= len(arrays[i]) <= 10^5 (length of each array)
    -10^9 <= arrays[i][j] <= 10^9 (value of each element)
    1 <= K <= total number of elements in all arrays
    Each array is sorted in descending order.

Explanation:
    1. Algorithm Overview:
        - Use a max heap to track the K largest elements.
        - Start with the largest element from each array.
        - Maintain the heap, always keeping track of the largest elements.

    2. Key Steps:
        a) Initialize the heap with the largest element from each array.
        b) Use a max heap (implemented as a min heap with negated values).
        c) Iterate K-1 times, each time:
            - Remove the largest element.
            - If possible, add the next largest element from the same array.

    3. Implementation Details:
        - Use Python's heapq module (min heap) with negated values to simulate a max heap.
        - Store each element as a tuple: (-value, array_index, element_index).
        - Use heappop and heappush for efficient removal and addition.

    4. Final Step:
        - The Kth largest element will be at the top of the heap after K-1 iterations.

Time Complexity: O(N * log(N) + K * log(N)), where N is the number of arrays.
Space Complexity: O(N) to store the initial elements in the heap.
"""
import heapq
from typing import List

class Solution:

    def kthLargestInNArrays(self, arrays: List[List[int]], k: int) -> int:
        # Initialize the max heap
        pq = []
        
        # Initialize the heap with the largest element from each array
        # Time: O(N * log(N)), where N is the number of arrays
        for i, arr in enumerate(arrays):
            if arr:  # Check if the array is not empty
                # Push tuple (-value, array index, element index) to the heap
                # We use -value to create a max heap with heapq (which is a min heap by default)
                heapq.heappush(pq, (-arr[0], i, 0))
        
        # Find the kth largest element
        # Time: O(K * log(N))
        for _ in range(k - 1):
            # We need k-1 iterations to get to the kth element
            # Get the largest element from the heap
            _, array_index, element_index = heapq.heappop(pq)
            
            # If there's a smaller element available in the same array
            if element_index + 1 < len(arrays[array_index]):
                # Push the next smaller element from the same array
                next_value = arrays[array_index][element_index + 1]
                heapq.heappush(pq, (-next_value, array_index, element_index + 1))
        
        # Get the kth largest element
        return -pq[0][0]  # Negate the value to get the original positive value

# Example usage
solution = Solution()

# Example 1
arrays1 = [
    [9, 8, 7, 6],
    [5, 4, 3],
    [2, 1]
]
k1 = 3
result1 = solution.kthLargestInNArrays(arrays1, k1)
print(f"Example 1: Input: arrays = {arrays1}, k = {k1}")
print(f"Output: {result1}")

# Example 2
arrays2 = [
    [5, 4],
    [3, 2],
    [1]
]
k2 = 4
result2 = solution.kthLargestInNArrays(arrays2, k2)
print(f"\nExample 2: Input: arrays = {arrays2}, k = {k2}")
print(f"Output: {result2}")