"""
Problem Statement:
    Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

    Implement the KthLargest class:
        KthLargest(int k, int[] nums): Initializes the object with the integer k and the stream of integers nums.
        int add(int val): Appends the integer val to the stream and returns the element representing the kth largest element in the stream.

Explanation:
    Step-1 : We use a min-heap to keep track of the k largest elements.
    Step-2 : In the constructor, we initialize the heap with the first k elements from nums.
    Step-3 : In the add method:
        If the heap size is less than k, we simply add the new value.
        If the heap is full and the new value is larger than the smallest in the heap, we replace the smallest with the new value.
        We always return the smallest value in the heap, which is the kth largest overall.

Time Complexity:
    Constructor: O(n log k), where n is the length of nums
    add method: O(log k)

Space Complexity:
    O(k) to store the heap

Input
    ["KthLargest", "add", "add", "add", "add", "add"]
    [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output
    [null, 4, 5, 5, 8, 8]
"""

import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []
        
        # Initialize the heap with the first k elements
        for num in nums:
            self.add(num)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        
        return self.heap[0]

kthLargest = KthLargest(3, [4, 5, 8, 2]);
print(kthLargest.add(3))   # Output: 4
print(kthLargest.add(5))   # Output: 5
print(kthLargest.add(10))  # Output: 5
print(kthLargest.add(9))   # Output: 8
print(kthLargest.add(4)) 