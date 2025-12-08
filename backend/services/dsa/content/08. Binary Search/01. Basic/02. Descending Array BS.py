"""
Problem Statement: Binary Search on Reverse Sorted Array

Examples:

1. Input: arr = [10, 8, 6, 4, 2, 1], target = 6
   Output: 2
   Explanation: 6 is present at index 2.

2. Input: arr = [9, 7, 5, 3, 1], target = 8
   Output: -1
   Explanation: 8 is not present in the array.


The approach modifies the standard binary search algorithm to work with descending order.

"""

def binary_search_reverse_sorted(arr: list[int], target: int) -> int:
    """
    Perform binary search on a reverse sorted array.

    Args:
    arr (list[int]): The reverse sorted (descending order) array to search in
    target (int): The element to search for

    Returns:
    int: The index of the target element if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Avoid potential integer overflow

        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            left = mid + 1  # Search in the right half
        else:
            right = mid - 1  # Search in the left half

    return -1  # Element not found

# Test cases
test_cases = [
    ([10, 8, 6, 4, 2, 1], 6),
    ([9, 7, 5, 3, 1], 8),
    ([20, 17, 15, 14, 13, 10, 9, 8, 4], 13),
    ([5, 4, 3, 2, 1], 1),
    ([10, 8, 6, 4, 2], 10),
    ([3], 3),
    ([], 5)
]

for arr, target in test_cases:
    result = binary_search_reverse_sorted(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found")
    print()

