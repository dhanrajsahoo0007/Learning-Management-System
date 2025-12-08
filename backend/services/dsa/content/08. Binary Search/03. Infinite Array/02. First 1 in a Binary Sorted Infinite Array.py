"""
Problem Statement: Index of First 1 in a Binary Sorted Infinite Array

    Given an infinite sorted binary array (containing only 0s and 1s), find the index of the first 1 in the array.
    The array is infinite, which means you don't know the size of the array beforehand.

Examples:

1. Input: arr = [0, 0, 0, 0, 0, 1, 1, 1, 1, ...]
   Output: 5
   Explanation: The first 1 appears at index 5.

2. Input: arr = [0, 0, 1, 1, 1, 1, 1, 1, 1, ...]
   Output: 2
   Explanation: The first 1 appears at index 2.

3. Input: arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, ...]
   Output: 0
   Explanation: The array starts with 1, so the first 1 is at index 0.

The approach uses a combination of exponential search to find a range and then binary search to find the first 1 within that range.
Explanation of the approach:

    1. Exponential Search:
        - We start with a small range and exponentially increase its size.
        - This allows us to quickly find a range that contains the first 1.

    2. Binary Search for First Occurrence:
        - Once we have a range, we perform a modified binary search to find the first occurrence of 1.
        - When we find a 1, we continue searching in the left half to find the first occurrence.

    3. Handling "Infinite" Array:
        - We use len(arr) in our implementation to avoid index out of range errors.
        - In a truly infinite array scenario, you would replace len(arr) checks with a method to test if an index is valid.
"""

def binary_search_first_one(arr, left, right):
    #Perform binary search to find the first occurrence of 1 in the given range of the array.

    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == 1:
            result = mid
            right = mid - 1  # Continue searching in the left half
        else:
            left = mid + 1
    return result

def find_first_one_infinite_array(arr):
    #Find the index of the first 1 in an infinite binary sorted array.

    # Start with a box of size 1
    left, right = 0, 1
    
    # Exponentially increase the box size until we find a 1
    while right < len(arr) and arr[right] == 0:
        left = right
        right = right * 2
    
    # Perform binary search in the found range
    return binary_search_first_one(arr, left, min(right, len(arr) - 1))

# Test cases
# Note: We'll use large but finite arrays to simulate "infinite" arrays
test_cases = [
    [0] * 10000 + [1] * 10000,  # First 1 at index 10000
    [0] * 100 + [1] * 100000,   # First 1 at index 100
    [1] * 100000,               # First 1 at index 0
    [0] * 100000,               # No 1 in the array
    [0] * 5 + [1] * 100000      # First 1 at index 5
]

for i, arr in enumerate(test_cases, 1):
    result = find_first_one_infinite_array(arr)
    print(f"Test case {i}:")
    if result != -1:
        print(f"First 1 found at index: {result}")
    else:
        print("No 1 found in the array")
    print()
