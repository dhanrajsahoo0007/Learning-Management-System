"""
Problem Statement: Order-Agnostic Binary Search

    Implement a binary search algorithm that can find a target element in a sorted array,
    without knowing in advance whether the array is sorted in ascending or descending order.
    The function should return the index of the target element if it's present in the array,
    or -1 if it's not found.

Examples:

1. Input: arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target = 6
   Output: 5
   Explanation: Array is in ascending order, 6 is present at index 5.

2. Input: arr = [10, 8, 6, 4, 2, 1], target = 4
   Output: 3
   Explanation: Array is in descending order, 4 is present at index 3.

3. Input: arr = [5], target = 5
   Output: 0
   Explanation: Single element array, 5 is present at index 0.

The approach modifies the standard binary search to first determine the order of sorting,
then proceed with the search accordingly.


Explanation of the order-agnostic binary search algorithm:

1. Determine Sorting Order:
   - Before starting the search, we check if the array is sorted in ascending or descending order.
   - This is done by comparing the first and last elements of the array.

2. Binary Search:
   - The core binary search algorithm remains similar to the standard version.
   - The key difference is in how we update the search range based on the determined sort order.

3. Search Space Reduction:
   - If the array is ascending:
     * If target < mid element, search in the left half
     * If target > mid element, search in the right half
   - If the array is descending:
     * If target > mid element, search in the left half
     * If target < mid element, search in the right half

4. Edge Cases:
   - The function handles empty arrays and single-element arrays correctly.

"""

def order_agnostic_binary_search(arr: list[int], target: int) -> int:

    if not arr:
        return -1

    left, right = 0, len(arr) - 1
    
    # Determine the sorting order
    is_ascending = arr[left] < arr[right]

    while left <= right:
        mid = left + (right - left) // 2  # Avoid potential integer overflow

        if arr[mid] == target:
            return mid

        if is_ascending:
            if target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if target > arr[mid]:
                right = mid - 1
            else:
                left = mid + 1

    return -1  # Element not found

# Test cases
test_cases = [
    ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6),  # Ascending order
    ([10, 8, 6, 4, 2, 1], 4),              # Descending order
    ([5], 5),                              # Single element
    ([1, 1, 1, 1, 1], 1),                  # All elements same
    ([], 5),                               # Empty array
    ([1, 3, 5, 7, 9], 4),                  # Element not in ascending array
    ([9, 7, 5, 3, 1], 4)                   # Element not in descending array
]

for arr, target in test_cases:
    result = order_agnostic_binary_search(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found")
    print()

