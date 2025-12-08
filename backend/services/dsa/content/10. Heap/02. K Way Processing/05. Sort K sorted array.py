"""
Problem Statement: Sort K sorted array (Nearly sorted array)
    A K-sorted array is an array where each element is at most K positions away from its position in the sorted array.

Example:
    Input: arr = [6, 5, 3, 2, 8, 10, 9], k = 3
    Output: [2, 3, 5, 6, 8, 9, 10]

Algorithm Steps:
    1. Create a min heap of the first k+1 elements of the array.
    2. For each remaining element in the array:
        a. Extract the minimum element from the heap and place it in the output array.
        b. Add the next element from the input array to the heap.
    3. Extract and place the remaining elements from the heap into the output array.

Time Complexity: O(n log k)
    - Building initial heap: O(k)
    - For each of the n elements:
      - Extracting min: O(log k)
      - Inserting new element: O(log k)
    Total: O(k + n log k) = O(n log k) [since k < n]

Space Complexity: O(k)
    - We use a heap of size k+1
"""
import heapq
def sort_k_sorted_array(arr, k):
    n = len(arr)
    
    # Create a min heap of the first k+1 elements
    min_heap = arr[:k+1]
    heapq.heapify(min_heap)
    
    # Index for where to put the next sorted element
    index = 0
    
    # Process remaining elements
    for i in range(k+1, n):
        # The smallest element in the heap is the next sorted element
        arr[index] = heapq.heappop(min_heap)
        index += 1
        
        # Add the next element to the heap
        heapq.heappush(min_heap, arr[i])
    
    # Pop and place the remaining elements from the heap
    while min_heap:
        arr[index] = heapq.heappop(min_heap)
        index += 1
    
    return arr

# Example usage
if __name__ == "__main__":
    arr = [6, 5, 3, 2, 8, 10, 9]
    k = 3
    print(f"Original array: {arr}")
    print(f"K value: {k}")
    
    sorted_arr = sort_k_sorted_array(arr, k)
    print(f"Sorted array: {sorted_arr}")

    # Additional example
    arr2 = [10, 9, 8, 7, 4, 70, 60, 50]
    k2 = 4
    print(f"\nOriginal array: {arr2}")
    print(f"K value: {k2}")
    
    sorted_arr2 = sort_k_sorted_array(arr2, k2)
    print(f"Sorted array: {sorted_arr2}")