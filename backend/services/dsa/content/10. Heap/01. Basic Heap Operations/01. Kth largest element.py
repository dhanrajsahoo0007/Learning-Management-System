"""
Problem Statement:
    Given an unsorted array of integers, find the kth largest element in the array.
    For example, given the array [7, 10, 4, 3, 20, 15] and k = 3, the 3rd largest element is 10.
    This solution uses a min heap to efficiently find the kth largest element.

Time Complexity: O(n * log(k)), where n is the length of the array
    - We iterate through all n elements once
    - For each element, we might perform a heap operation, which takes log(k) time

Space Complexity: O(k) - We maintain a heap of at most k elements

Note: This solution is particularly efficient when k is much smaller than n,
as it only needs to keep track of k elements at a time.
"""
import heapq

def kth_largest_heap(arr, k):
    if k < 1 or k > len(arr):
        return None
    
    # Create a max heap of the first k elements
    min_heap = arr[:k]
    heapq.heapify(min_heap)
    
    # If we take the k in range then we don't have to check the len(max_heap)
    for i in range(k, len(arr)):
        if arr[i] > min_heap[0]:
            heapq.heapreplace(min_heap, arr[i])
    
    # The root of the heap is the kth smallest element
    return min_heap[0]


# Example usage
arr = [7, 10, 4, 3, 20, 15]
k = 3
result = kth_largest_heap(arr, k)
print(f"The {k}th largest element is: {result}")