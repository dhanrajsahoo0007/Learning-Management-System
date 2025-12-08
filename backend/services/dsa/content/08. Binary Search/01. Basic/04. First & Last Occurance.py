"""
Problem Statement: First and Last Occurrence of an Element in Sorted Array

Given a sorted array of integers and a target element, find the index of the first and last occurrence of the target element in the array.
If the target is not found in the array, return [-1, -1].

Examples:

1. Input: arr = [1, 3, 3, 3, 5, 5, 5, 7, 8, 9], target = 5
   Output: [4, 6]
   Explanation: The first occurrence of 5 is at index 4, and the last occurrence is at index 6.

2. Input: arr = [1, 2, 3, 4, 5, 6], target = 7
   Output: [-1, -1]
   Explanation: 7 is not present in the array.

3. Input: arr = [1, 1, 1, 1, 1, 1], target = 1
   Output: [0, 5]
   Explanation: 1 occurs throughout the array, from index 0 to 5.

The approach uses separate binary search methods to efficiently find the first and last occurrences.

Explanation of the approach:

1. Separate Methods:
   - We use two separate methods for finding the first and last occurrences:
     * find_first_occurrence: Searches for the leftmost occurrence of the target.
     * find_last_occurrence: Searches for the rightmost occurrence of the target.

2. Binary Search Logic:
   - Both methods use a modified binary search algorithm.
   - The key difference is in how they handle finding the target:
     * find_first_occurrence moves the right pointer when a match is found to search for earlier occurrences.
     * find_last_occurrence moves the left pointer when a match is found to search for later occurrences.

3. Result Tracking:
   - Both methods use a 'result' variable to keep track of the most recent valid occurrence found.
   - This ensures that even if we continue searching, we always have the correct index stored.

4. Combining Results:
   - The find_first_and_last function calls both search methods and returns their results as a pair.

5. Time Complexity: O(log n) for each method, where n is the number of elements in the array.
   - We perform two separate binary searches, each taking O(log n) time.

6. Space Complexity: O(1)
   - We use only a constant amount of extra space in each method.
"""

def find_first_occurrence(arr: list[int], target: int) -> int:
    """
    Perform binary search to find the first occurrence of the target.
    
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
            right = mid - 1  # Continue searching in the left half for first occurrence
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

def find_last_occurrence(arr: list[int], target: int) -> int:
    """
    Perform binary search to find the last occurrence of the target.
    
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
            left = mid + 1  # Continue searching in the right half for last occurrence
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result

def find_first_and_last(arr: list[int], target: int) -> list[int]:
    """
    Find the indices of the first and last occurrences of the target in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to search for
    
    Returns:
    list[int]: A list containing the indices of the first and last occurrences, or [-1, -1] if not found
    """
    first = find_first_occurrence(arr, target)
    last = find_last_occurrence(arr, target)
    return [first, last]

# Test cases
test_cases = [
    ([1, 3, 3, 3, 5, 5, 5, 7, 8, 9], 5),
    ([1, 2, 3, 4, 5, 6], 7),
    ([1, 1, 1, 1, 1, 1], 1),
    ([1, 2, 3, 4, 5], 3),
    ([], 1),
    ([1], 1),
    ([1, 2, 3, 3, 3, 4, 5], 3)
]

for arr, target in test_cases:
    result = find_first_and_last(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    print(f"First and Last Occurrence: {result}")
    print()

