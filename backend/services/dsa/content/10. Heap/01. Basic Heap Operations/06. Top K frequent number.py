"""
Problem Statement:
    integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Time Complexity: O(n log k), where n is the number of elements in the input array.
    - We iterate through all n elements once to count frequencies.
    - We perform at most n heap operations, each taking O(log k) time.

Space Complexity: O(n)
    - O(n) for the Counter to store frequencies of all elements.
    - O(k) for the heap, which stores at most k elements.
    - Overall, the space complexity is O(n) since n >= k.

Algorithm:
    1. Use a Counter to count the frequency of each number in the input array.
    2. Use a min heap to keep track of the k most frequent elements.
    3. Iterate through the items in our frequency counter:
        - If the heap has less than k elements, add the current element.
        - If the heap is full (has k elements) and the current frequency is higher than the smallest frequency in the heap, remove the smallest and add the current one.
    4. The heap stores tuples of (frequency, number). We use the frequency as the first element of the tuple because heapq in Python compares tuples lexicographically.
    5. Finally, extract just the numbers from the heap to get our result.
"""
from collections import Counter
import heapq

def top_k_frequent(nums, k):
    # Count the frequency of each number
    count = Counter(nums)
    
    # Use a min heap to keep track of the k most frequent elements
    heap = []
    
    for num, freq in count.items():
        # If the heap has less than k elements, just add the current element
        if len(heap) < k:
            heapq.heappush(heap, (freq, num))
        # If the current frequency is higher than the smallest frequency in the heap,
        # remove the smallest and add the current one
        elif freq > heap[0][0]:
            heapq.heapreplace(heap, (freq, num))
    
    # Extract the numbers from the heap (ignoring their frequencies)
    return [num for freq, num in heap]

# Example usage
nums = [1, 1, 1, 2, 2, 3]
k = 2
result = top_k_frequent(nums, k)
print(f"The {k} most frequent elements are: {result}")