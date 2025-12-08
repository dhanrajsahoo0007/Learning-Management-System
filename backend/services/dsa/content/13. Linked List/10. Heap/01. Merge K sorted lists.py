"""
Problem Statement:
    Given an array of k sorted lists, merge them into a single sorted list.

Example:
    Input: [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
    ]
    Output: [1, 1, 2, 3, 4, 4, 5, 6]

Algorithm Steps:
    1. Create a min-heap to keep track of the smallest elements from each list.
    2. Initialize the heap by adding the first element from each list. Each entry in the heap is a tuple containing:
        - The value of the element
        - The index of the element within its list
        - The index of the list it came from
    3. Enter a loop that continues until the heap is empty:
        - Pop the smallest element from the heap
        - Add this element to our result list
        - If there are more elements in the list that this element came from, add the next element from that list to the heap
    4. Once the heap is empty, we've processed all elements, and our result list contains all elements in sorted order.

Time Complexity: O(N log k)
    - N is the total number of elements across all lists
    - k is the number of lists
    - Each element is pushed and popped from the heap once, and the heap has at most k elements at any time

Space Complexity: O(k) + O(N)
    - O(k) for the heap
    - O(N) for the output list
"""
import heapq

def merge_k_sorted_lists(lists):
    min_heap = []
    result = []
    
    # Add the first element from each list to the min heap
    for i, lst in enumerate(lists):
        if lst:
            # val, element_index, list_index
            heapq.heappush(min_heap, (lst[0], 0, i))
    
    # Process elements until the heap is empty
    while min_heap:
        val, element_index, list_index = heapq.heappop(min_heap)
        
        # Add the smallest element to the result
        result.append(val)
        
        # If there are more elements in the list, add the next one to the heap
        if element_index + 1 < len(lists[list_index]):
            next_element = lists[list_index][element_index + 1]
            heapq.heappush(min_heap, (next_element, element_index + 1, list_index))
    
    return result

# Example usage
if __name__ == "__main__":
    lists = [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
    ]

    merged = merge_k_sorted_lists(lists)
    print("Input lists:", lists)
    print("Merged sorted list:", merged)