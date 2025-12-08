"""
Problem Statement: Count of an Element in a Sorted Array


Examples:

1. Input: arr = [1, 2, 3, 3, 3, 3, 5], target = 3
Output: 4
Explanation: The element 3 appears 4 times in the array.

2. Input: arr = [1, 2, 3, 4, 5], target = 6
Output: 0
Explanation: The element 6 does not appear in the array.

Explanation of the approach:

1. Binary Search for Boundaries:
   - We use two binary search functions to find the first and last occurrences of the target element.
   - find_first_occurrence: Searches for the leftmost occurrence of the target.
   - find_last_occurrence: Searches for the rightmost occurrence of the target.

2. Counting Occurrences:
   - Once we have the indices of the first and last occurrences, we can easily compute the count:
     count = last_index - first_index + 1
   - If the element is not found (first_index is -1), we return 0.

3. Efficiency:
   - Time Complexity: O(log n), where n is the number of elements in the array.
     * We perform two binary searches, each taking O(log n) time.
   - Space Complexity: O(1), as we only use a constant amount of extra space.

4. Edge Cases:
   - The algorithm correctly handles cases where:
     * The element is not in the array
     * The array is empty
     * The array contains only one element
     * All elements in the array are the same

"""

def find_first_occurrence(arr: list[int], target: int) -> int:
    """
    Find the index of the first occurrence of the target in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to search for
    
    Returns:
    int: The index of the first occurrence of the target, or -1 if not found
    """
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching in the left half
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

def find_last_occurrence(arr: list[int], target: int) -> int:
    """
    Find the index of the last occurrence of the target in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to search for
    
    Returns:
    int: The index of the last occurrence of the target, or -1 if not found
    """
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            left = mid + 1  # Continue searching in the right half
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

def count_occurrences(arr: list[int], target: int) -> int:
    """
    Count the number of occurrences of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to count
    
    Returns:
    int: The number of occurrences of the target element
    """
    first = find_first_occurrence(arr, target)
    if first == -1:
        return 0  # Element not found
    last = find_last_occurrence(arr, target)
    return last - first + 1

# Test cases
test_cases = [
    ([1, 2, 3, 3, 3, 3, 5], 3),
    ([1, 2, 3, 4, 5], 6),
    ([1, 1, 1, 1, 1, 1], 1),
    ([1, 2, 3, 4, 5], 3),
    ([], 1),
    ([1], 1),
    ([1, 2, 2, 2, 2, 3, 4, 5], 2)
]

for arr, target in test_cases:
    count = count_occurrences(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    print(f"Count of occurrences: {count}")
    print()

