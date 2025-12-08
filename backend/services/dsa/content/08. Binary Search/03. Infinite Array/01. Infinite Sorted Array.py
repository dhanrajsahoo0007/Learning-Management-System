"""
Problem Statement: Find Position of an Element in an Infinite Sorted Array
                Given an infinite sorted array (or an array with unknown size) and a target element, 
                find the index of the target element in the array. If the element is not present, return -1.

Examples:

1. Input: arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...], target = 5
   Output: 4
   Explanation: The element 5 is at index 4.

2. Input: arr = [1, 2, 3, 5, 7, 9, 11, 13, 15, 17, ...], target = 9
   Output: 5
   Explanation: The element 9 is at index 5.

3. Input: arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, ...], target = 8
   Output: -1
   Explanation: The element 8 is not in the array.

Explanation of the approach:

    1. Exponential Search:
        - We start with a small range (box) and exponentially increase its size.
        - This allows us to quickly find a range that potentially contains the target.

    2. Binary Search:
     have a range, we perform a standard binary search within this range.

    3. Handling "Infinite" Array:
        - We use len(arr) in our implementation to avoid index out of range errors.
        - In a truly infinite array scenario, you would replace len(arr) checks with a method to test if an index is valid.
"""

def binary_search(arr, left, right, target):
    # Perform binary search in the given range of the array.
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def find_in_infinite_array(arr, target):

    #Find the position of the target element in an infinite sorted array.
    
    # Start with a box of size 1
    left, right = 0, 1
    
    # Exponentially increase the box size until we find a range that contains the target
    while right < len(arr) and arr[right] < target:
        left = right
        right = right * 2
    
    # Perform binary search in the found range
    return binary_search(arr, left, min(right, len(arr) - 1), target)

# Test cases
# Note: We'll use a large but finite array to simulate an "infinite" array
large_array = list(range(1, 1000000, 2))  # Odd numbers from 1 to 999999

test_cases = [
    (large_array, 501),
    (large_array, 1000),
    (large_array, 2),
    (large_array, 999999),
    (large_array, 500000),
    (large_array, 4)  # Not in the array
]

for arr, target in test_cases:
    result = find_in_infinite_array(arr, target)
    print(f"Target: {target}")
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found")
    print()

