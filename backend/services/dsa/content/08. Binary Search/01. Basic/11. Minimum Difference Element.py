"""
Problem Statement: Minimum Difference Element in a Sorted Array

Given a sorted array of integers and a target integer, find the element in the array that has the minimum difference with the target.

Examples:

1. Input: arr = [1, 3, 8, 10, 15], target = 12
   Output: 10
   Explanation: 10 has the minimum difference with 12 (|10-12| = 2).

2. Input: arr = [2, 5, 10, 12, 15], target = 6
   Output: 5
   Explanation: 5 has the minimum difference with 6 (|5-6| = 1).

3. Input: arr = [2, 4, 6, 8, 10], target = 5
   Output: 4 or 6
   Explanation: Both 4 and 6 have the same minimum difference with 5 (|4-5| = |6-5| = 1).

The approach uses ceiling and floor operations to find the element with the minimum difference.

Explanation of the approach:

    1. Floor and Ceiling Functions:
        - find_floor: Finds the largest element in the array that is less than or equal to the target.
        - find_ceiling: Finds the smallest element in the array that is greater than or equal to the target.

    2. Minimum Difference Element:
        - Use floor and ceiling functions to find the two elements closest to the target.
        - Compare the differences of these two elements with the target and return the one with the smaller difference.

    3. Edge Cases:
        - If the target is less than or equal to the first element, return the first element.
        - If the target is greater than or equal to the last element, return the last element.

"""

def find_floor(arr: list[int], target: int) -> int:
    """
    Find the floor of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to find the floor for
    
    Returns:
    int: The index of the floor of the target element, or -1 if no floor exists
    """
    left, right = 0, len(arr) - 1
    floor = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            floor = mid
            left = mid + 1
        else:
            right = mid - 1

    return floor

def find_ceiling(arr: list[int], target: int) -> int:
    """
    Find the ceiling of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to find the ceiling for
    
    Returns:
    int: The index of the ceiling of the target element, or len(arr) if no ceiling exists
    """
    left, right = 0, len(arr) - 1
    ceiling = len(arr)

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            ceiling = mid
            right = mid - 1

    return ceiling

def find_min_diff_element(arr: list[int], target: int) -> int:
    """
    Find the element in the sorted array with the minimum difference from the target.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The target value
    
    Returns:
    int: The element with the minimum difference from the target
    """
    n = len(arr)
    
    # Edge cases
    if target <= arr[0]:
        return arr[0]
    if target >= arr[n-1]:
        return arr[n-1]
    
    floor_index = find_floor(arr, target)
    ceiling_index = find_ceiling(arr, target)
    
    if floor_index == ceiling_index:
        return arr[floor_index]
    
    if (target - arr[floor_index]) <= (arr[ceiling_index] - target):
        return arr[floor_index]
    else:
        return arr[ceiling_index]

# Test cases
test_cases = [
    ([1, 3, 8, 10, 15], 12),
    ([2, 5, 10, 12, 15], 6),
    ([2, 4, 6, 8, 10], 5),
    ([1, 2, 3, 4, 5], 10),
    ([1, 2, 3, 4, 5], 0),
    ([1, 4, 7, 10], 5),
    ([1], 5)
]

for arr, target in test_cases:
    result = find_min_diff_element(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    print(f"Element with minimum difference: {result}")
    print(f"Difference: {abs(result - target)}")
    print()
