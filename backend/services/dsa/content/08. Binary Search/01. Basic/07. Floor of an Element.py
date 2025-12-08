"""
Problem Statement: Find Floor of an Element in a Sorted Array

Given a sorted array and a target element, find the floor of the target element in the array.
The floor of an element is the largest element in the array that is less than or equal to the target.

Examples:

1. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 7
   Output: 6
   Explanation: 6 is the largest element in arr that is less than or equal to 7.

2. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 1
   Output: 1
   Explanation: 1 is the largest element in arr that is less than or equal to 1.

3. Input: arr = [1, 2, 4, 6, 10, 12, 14], target = 0
   Output: -1
   Explanation: There is no element in arr that is less than or equal to 0.

Explanation of the approach:

1. Modified Binary Search:
   - We use a binary search algorithm, modifying it to keep track of the floor value.

2. Search Logic:
   - Initialize floor as -1 (for the case where no floor exists).
   - In each iteration:
     a. If arr[mid] equals target, we've found an exact match, so return it.
     b. If arr[mid] is less than target, update floor to arr[mid] and search in the right half.
     c. If arr[mid] is greater than target, search in the left half.

3. Updating Floor:
   - We update the floor whenever we find an element smaller than the target.
   - This ensures that we always have the largest element that's less than or equal to the target.
"""

def find_floor(arr: list[int], target: int) -> int:
    """
    Find the floor of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to find the floor for
    
    Returns:
    int: The floor of the target element, or -1 if no floor exists
    """
    left, right = 0, len(arr) - 1
    floor = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return arr[mid]
        elif arr[mid] < target:
            floor = arr[mid]  # Update floor
            left = mid + 1    # Search in the right half
        else:
            right = mid - 1   # Search in the left half

    return floor

# Test cases
test_cases = [
    ([1, 2, 4, 6, 10, 12, 14], 7),
    ([1, 2, 4, 6, 10, 12, 14], 1),
    ([1, 2, 4, 6, 10, 12, 14], 0),
    ([1, 2, 4, 6, 10, 12, 14], 15),
    ([1, 2, 4, 6, 10, 12, 14], 3),
    ([1, 1, 1, 1, 1], 1),
    ([], 5),
    ([10], 5),
    ([10], 15)
]

for arr, target in test_cases:
    result = find_floor(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    if result != -1:
        print(f"Floor of {target}: {result}")
    else:
        print(f"No floor exists for {target}")
    print()

