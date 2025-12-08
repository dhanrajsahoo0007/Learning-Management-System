"""
Problem Statement:
This algorithm solves two related problems:

1. Find a Peak Element in an Array:
   A peak element in an array is an element that is strictly greater than its neighbors. Given an integer array arr, find a peak element, and return its index. 
   If the array contains multiple peaks, return the index to any of the peaks.
   You may imagine that arr[-1] = arr[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

2. Find Maximum Element in a Bitonic Array:
   A Bitonic array is an array that is first strictly increasing and then strictly decreasing. Note that a peak element in a Bitonic array is also its maximum element.

The algorithm below efficiently solves both these problems using the same approach.

Algorithm (Binary Search):
    1. Handle edge cases:
        - If array has only one element, return 0
        - If first element is greater than second, return 0
        - If last element is greater than second-last, return n-1
    2. Initialize low = 1 and high = n-2
    3. While low <= high:
    a. Calculate mid = (low + high) // 2
    b. If arr[mid] is greater than both its neighbors, return mid
    c. If arr[mid] > arr[mid-1], we are in the ascending part, so move right: low = mid + 1
    d. Otherwise, move left: high = mid - 1
    4. If no peak is found, return -1 (this should never happen given the problem constraints)

Time Complexity: O(log n), where n is the length of the array
Space Complexity: O(1), as we only use a constant amount of extra space

Note: 
    - For the Peak Element problem, this algorithm finds any peak element, not necessarily the global maximum.
    - For the Bitonic Array problem, this algorithm finds the maximum element, which is the unique peak in the array.
"""

def findPeakElement(arr: [int]) -> int:
    n = len(arr)  # Size of the array

    # Edge cases:
    # Case 1: If the array has only one element, it's the peak
    if n == 1:
        return 0
    
    # Case 2: If the first element is greater than the second, it's a peak
    if arr[0] > arr[1]:
        return 0
    
    # Case 3: If the last element is greater than the second-to-last, it's a peak
    if arr[n - 1] > arr[n - 2]:
        return n - 1

    low = 1
    high = n - 2
    while low <= high:
        mid = (low + high) // 2

        # If arr[mid] is the peak:
        if arr[mid - 1] < arr[mid] and arr[mid] > arr[mid + 1]:
            return mid

        # If we are in the left (ascending) part:
        if arr[mid] > arr[mid - 1]:
            low = mid + 1

        # If we are in the right (descending) part:
        # Or, arr[mid] is a common point:
        else:
            high = mid - 1

    # Dummy return statement (should never be reached)
    return -1

# Example usage
if __name__ == "__main__":
    print("Examples for Peak Element in Array:")
    test_cases = [
        [1, 2, 3, 4, 5, 6, 7, 8, 5, 1],
        [1, 2, 1, 3, 5, 6, 4],
        [1],
        [1, 2],
        [2, 1],
        [1, 2, 3]
    ]

    for i, arr in enumerate(test_cases, 1):
        peak_index = findPeakElement(arr)
        print(f"Test case {i}:")
        print(f"Input array: {arr}")
        print(f"Peak element index: {peak_index}")
        print(f"Peak element value: {arr[peak_index]}")
        print()

    print("Examples for Maximum Element in Bitonic Array:")
    bitonic_arrays = [
        [1, 3, 8, 12, 4, 2],
        [1, 3, 8, 12, 9, 5, 2],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [1, 2, 3, 4, 3, 2, 1]
    ]

    for i, arr in enumerate(bitonic_arrays, 1):
        max_index = findPeakElement(arr)
        print(f"Test case {i}:")
        print(f"Input Bitonic array: {arr}")
        print(f"Maximum element index: {max_index}")
        print(f"Maximum element value: {arr[max_index]}")
        print()