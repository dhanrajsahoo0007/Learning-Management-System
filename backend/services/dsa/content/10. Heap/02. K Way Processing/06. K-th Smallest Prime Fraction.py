"""
Problem: K-th Smallest Prime Fraction

    You are given a sorted integer array arr containing 1 and prime numbers, where all the integers of arr are unique. You are also given an integer k.
    For every i and j where 0 <= i < j < arr.length, we consider the fraction arr[i] / arr[j].
    Return the kth smallest fraction considered. Return your answer as an array of integers of size 2, where answer[0] == arr[i] and answer[1] == arr[j].

Example 1:

    Input: arr = [1,2,3,5], k = 3
    Output: [2,5]
    Explanation: The fractions to be considered in sorted order are:
                1/5, 1/3, 2/5, 1/2, 3/5, and 2/3.
                The third fraction is 2/5.

Example 2:
    Input: arr = [1,7], k = 1
    Output: [1,7]

Constraints:
    2 <= arr.length <= 1000
    1 <= arr[i] <= 3 * 104
    arr[0] == 1
    arr[i] is a prime number for i > 0.
    All the numbers of arr are unique and sorted in strictly increasing order.
    1 <= k <= arr.length * (arr.length - 1) / 2

Explanation:
    1. Algorithm Overview:
        - Use a max heap to track the k smallest fractions.
        - Iterate through all pairs (i, j) where i < j in the array.
        - Maintain the heap size at k, always keeping the k smallest fractions.

    2. Key Steps:
        a) Generate all possible fractions arr[i] / arr[j].
        b) Use a max heap of size k to store the smallest fractions.
        c) If heap size < k, add the new fraction.
        d) If heap size = k and new fraction is smaller than the largest in heap:
            - Remove the largest and add the new fraction.
        e) After processing all pairs, the top of the heap is the kth smallest fraction.

    3. Implementation Details:
        - Use Python's heapq module (min heap) with negated fractions to simulate a max heap.
        - Store each fraction as a tuple: (-fraction_value, numerator, denominator).
        - Use heappushpop for efficient add-and-remove when heap is full.

    4. Final Step:
        - Extract the numerator and denominator from the top of the heap.
        - Return them as the result.

Time Complexity: O(n^2 * log(k)), where n is the length of the input array.
Space Complexity: O(k) to store the k smallest fractions in the heap.

"""

import heapq
from typing import List 

class Solution:
    def kthSmallestPrimeFraction(self, arr: List[int], k: int) -> List[int]:
        # Initialize an empty list to serve as our heap
        pq = []
        
        # Generate all possible fractions
        for i in range(len(arr)):
            for j in range(i+1, len(arr)):
                # Calculate the fraction
                frac = arr[i] / arr[j]
                
                # If heap size is less than k, simply add the new fraction
                if len(pq) < k:
                    heapq.heappush(pq, (-frac, arr[i], arr[j]))
                # If heap is full and new fraction is smaller than the largest in heap
                elif -frac > pq[0][0]:
                    # Remove the largest and add the new fraction
                    heapq.heappushpop(pq, (-frac, arr[i], arr[j]))
        
        # The top of the heap now contains the kth smallest fraction
        # Extract the numerator and denominator
        _, numerator, denominator = pq[0]
        
        # Return the result
        return [numerator, denominator]
    
"""
Problem: K-th Smallest Prime Fraction

Solution 2:
    Problem: K-th Smallest Prime Fraction

    Time Complexity: O(k * log(n)), where n is the length of the input array.
    Space Complexity: O(n) for the priority queue.

    Explanation:
        This solution uses a min-heap to efficiently find the kth smallest fraction. The algorithm works as follows:
        1. Initialize a min-heap with fractions formed by each element as numerator and the last element as denominator.
        2. Repeatedly extract the smallest fraction and add a new fraction with the same numerator but next smaller denominator.
        3. After k-1 extractions, the top of the heap contains the kth smallest fraction.

The key insight is that we don't need to consider all possible fractions at once. 
Instead, we start with the smallest possible denominator (the largest element) and progressively explore smaller denominators as needed.
"""

import heapq


class Solution:
    def kthSmallestPrimeFraction(self, arr: List[int], k: int) -> List[int]:
        n = len(arr)
        pq = []
        
        # Initialize the heap with fractions using the last element as denominator
        # Time: O(n * log(n))
        for i in range(n - 1):  # We don't need to include the last element as numerator
            # Push tuple (fraction, numerator index, denominator index) to the heap
            heapq.heappush(pq, (arr[i]/arr[-1], i, n-1))
        
        # Find the kth smallest fraction
        # Time: O(k * log(n))
        for _ in range(k - 1):  # We need k-1 iterations to get to the kth element
            # Get the smallest fraction from the heap
            _, i, j = heapq.heappop(pq)
            
            # If there's a smaller denominator available
            if j > i + 1:
                # Push the fraction with the next smaller denominator
                heapq.heappush(pq, (arr[i]/arr[j-1], i, j-1))
        
        # Get the kth smallest fraction
        _, i, j = pq[0]
        
        # Return the numerator and denominator of the kth smallest fraction
        return [arr[i], arr[j]]
    
# Example usage:
sol = Solution()
print(sol.kthSmallestPrimeFraction([1, 2, 3, 5], 3))  # Output: [2, 5]
print(sol.kthSmallestPrimeFraction([1, 7], 1))  # Output: [1, 7]