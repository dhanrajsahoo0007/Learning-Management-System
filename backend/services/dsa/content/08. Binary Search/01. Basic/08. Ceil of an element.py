"""
Problem Statement: Find Ceiling of an Element in a Sorted Array

Given a sorted array and a target element, find the ceiling of the target element in the array.
The ceiling of an element is the smallest element in the array that is greater than or equal to the target.

Examples:

1. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 7
   Output: 10
   Explanation: 10 is the smallest element in arr that is greater than or equal to 7.

2. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 14
   Output: 14
   Explanation: 14 is the smallest element in arr that is greater than or equal to 14.

3. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 15
   Output: -1
   Explanation: There is no element in arr that is greater than or equal to 15.

Explanation of the approach:

1. Modified Binary Search:
   - We use a binary search algorithm, modifying it to keep track of the ceiling value.

2. Search Logic:
   - Initialize ceiling as -1 (for the case where no ceiling exists).
   - In each iteration:
     a. If arr[mid] equals target, we've found an exact match, so return it.
     b. If arr[mid] is less than target, search in the right half.
     c. If arr[mid] is greater than target, update ceiling to arr[mid] and search in the left half.

3. Updating Ceiling:
   - We update the ceiling whenever we find an element larger than the target.
   - This ensures that we always have the smallest element that's greater than or equal to the target.
"""

def find_ceiling(arr: list[int], target: int) -> int:
    """
    Find the ceiling of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to find the ceiling for
    
    Returns:
    int: The ceiling of the target element, or -1 if no ceiling exists
    """
    left, right = 0, len(arr) - 1
    ceiling = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return arr[mid]
        elif arr[mid] < target:
            left = mid + 1
        else:
            ceiling = arr[mid]  # Update ceiling
            right = mid - 1     # Search in the left half

    return ceiling

# Test cases
test_cases = [
    ([1, 2, 4, 6, 10, 12, 14], 7),
    ([1, 2, 4, 6, 10, 12, 14], 14),
    ([1, 2, 4, 6, 10, 12, 14], 15),
    ([1, 2, 4, 6, 10, 12, 14], 0),
    ([1, 2, 4, 6, 10, 12, 14], 3),
    ([1, 1, 1, 1, 1], 1),
    ([], 5),
    ([10], 5),
    ([10], 15)
]

for arr, target in test_cases:
    result = find_ceiling(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    if result != -1:
        print(f"Ceiling of {target}: {result}")
    else:
        print(f"No ceiling exists for {target}")
    print()

