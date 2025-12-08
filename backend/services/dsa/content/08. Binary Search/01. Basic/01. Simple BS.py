"""
Problem Statement: Simple Binary Search

Explanation of the binary search algorithm:

1. Initialize Pointers:
   - We start with two pointers, 'left' and 'right', pointing to the start and end of the array.

2. Middle Element:
   - In each iteration, we calculate the middle index as mid = left + (right - left) // 2.
   - This formula avoids potential integer overflow that could occur with (left + right) // 2.

3. Comparison and Search Space Reduction:
   - If the middle element is equal to the target, we've found the element and return its index.
   - If the middle element is less than the target, we search the right half (left = mid + 1).
   - If the middle element is greater than the target, we search the left half (right = mid - 1).

4. Termination:
   - The search continues while left <= right.
   - If the element is not found, we exit the loop and return -1.

5. Time Complexity: O(log n), where n is the number of elements in the array.
   - Each iteration reduces the search space by half, leading to logarithmic time complexity.

6. Space Complexity: O(1)
   - We only use a constant amount of extra space, regardless of the input size.

Key Insights:
    1. Binary search requires the array to be sorted (in this case, in ascending order).
    2. It's much more efficient than linear search for large datasets, but may be slower for very small arrays due to overhead.
    3. The algorithm naturally handles both odd and even-length arrays.

Trade-offs and Considerations:
    - Binary search is highly efficient for searching in large, sorted datasets.
    - However, if the data is frequently updated, maintaining a sorted array can be costly.
    - For small arrays, linear search might be faster due to better cache performance and simplicity.

"""

def binary_search(arr: list[int], target: int) -> int:
    """
    Perform binary search on a sorted array.

    Args:
    arr (list[int]): The sorted (ascending order) array to search in
    target (int): The element to search for

    Returns:
    int: The index of the target element if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Avoid potential integer overflow

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1  # Search in the right half
        else:
            right = mid - 1  # Search in the left half

    return -1  # Element not found


# Test cases
test_cases = [
    ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6),
    ([1, 3, 5, 7, 9], 4),
    ([1, 2, 3, 4, 5], 5),
    ([1, 2, 3, 4, 5], 1),
    ([1, 2, 3, 4, 5], 6),
    ([1], 1),
    ([], 5)
]

for arr, target in test_cases:
    result = binary_search(arr, target)
    print(f"Array: {arr}")
    print(f"Target: {target}")
    if result != -1:
        print(f"Element found at index: {result}")
    else:
        print("Element not found")
    print()