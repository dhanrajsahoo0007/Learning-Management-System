"""
Problem Statement:
    Given an unsorted array of integers, find the kth smallest element in the array.
    For example, given the array [7, 10, 4, 3, 20, 15] and k = 3, the 3rd smallest element is 7.
    This solution uses a max heap to efficiently find the kth smallest element.

Time Complexity: O(n * log(k)), where n is the length of the array
    - We iterate through all n elements once
    - For each element, we might perform a heap operation, which takes log(k) time

Space Complexity: O(k) - We maintain a heap of at most k elements

Note: This solution is particularly efficient when k is much smaller than n, 
     as it only needs to keep track of k elements at a time.
"""
import heapq

def kth_smallest_heap(arr, k):
    if k < 1 or k > len(arr):
        return None
    
    max_heap = []
    
    for i in range(len(arr)):
        # If the heap size is less than k, just add the element
        if len(max_heap) < k:
            heapq.heappush(max_heap, -arr[i])
        else:
            # If the current element is smaller than the largest in the heap,
            # remove the largest and add this one
            if -arr[i] > max_heap[0]:
                heapq.heappop(max_heap)
                heapq.heappush(max_heap, -arr[i])
                ## or use 
                heapq.heapreplace(max_heap, -arr[i])
    
    # The root of the heap is the kth smallest element
    return -max_heap[0]

def kth_smallest_heap(arr, k):
    if k < 1 or k > len(arr):
        return None
    
    # Create a max heap of the first k elements
    max_heap = [-x for x in arr[:k]]
    heapq.heapify(max_heap)
    
    # If we take the k in range then we don't have to check the len(max_heap)
    for i in range(k, len(arr)):
        if arr[i] < -max_heap[0]:
            heapq.heapreplace(max_heap, -arr[i])
    
    # The root of the heap is the kth smallest element
    return -max_heap[0]


# Example usage
arr = [7, 10, 4, 3, 20, 15]
k = 3
result = kth_smallest_heap(arr, k)
print(f"The {k}th smallest element is: {result}")