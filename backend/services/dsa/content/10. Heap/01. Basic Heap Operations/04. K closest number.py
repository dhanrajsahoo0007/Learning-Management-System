"""
Problem Statement:
    list of numbers, a target number, and an integer k, find the k closest numbers to the target in the list.

Time Complexity: O(n log k), where n is the number of elements in the input list.
    - We iterate through all n elements once.
    - For each element, we might perform a heap operation, which takes log k time.

Space Complexity: O(k)
    - We maintain a heap of at most k elements.

Algorithm:
    1. Iterate through the list once, keeping track of the k closest numbers seen so far.
    2. For each number, if we haven't found k numbers yet, we add it to the heap.
    3. If we've already found k numbers, we compare the current number to the furthest number in our heap. 
    If it's closer, we remove the furthest and add the current number.
    4. Finally, we sort the k closest numbers based on their actual values.
"""
import heapq
def find_k_closest(numbers, target, k):
    # Use a max heap to keep track of the k closest numbers
    maxHeap = []
    
    for num in numbers:
        diff = abs(num - target)
        
        # If we haven't found k numbers yet, add to the heap
        if len(maxHeap) < k:
            heapq.heappush(maxHeap, (-diff, num))
        else:
            # If this number is closer than the furthest in our heap,
            # remove the furthest and add this one
            if diff < -maxHeap[0][0]:
                heapq.heappop(maxHeap)
                heapq.heappush(maxHeap, (-diff, num))
    
    # Extract the numbers from the heap
    result = [num for _, num in maxHeap]
    # Return sorted based on the nearest element 
    return sorted(result)

# Example usage
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
target = 5
k = 3

result = find_k_closest(numbers, target, k)
print(f"The {k} closest numbers to {target} are: {result}")