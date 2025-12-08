"""
Problem Statement:
    Given an array of n elements, where each element is at most k positions away from its target position in the sorted array. 
    The task is to search for an element in this nearly sorted array efficiently.

    A nearly sorted array is one where an element at index i in the sorted array may be present at index i-k, i-k+1, ..., i, i+1, ..., i+k in the given array.

Example:
    Input: arr = [2, 3, 10, 4, 40], k = 2, target = 4
    Output: 3 (index of 4 in the array)

Approach:
    1. We'll use a modified binary search algorithm.
    2. Instead of checking only the middle element, we'll check the range [mid-k, mid+k].
    3. If the target is not in this range, we'll decide which half to search based on the value at mid.


Explanation of the algorithm:

    1. We start with two pointers, 'left' and 'right', initially pointing to the start and end of the array.

    2. In each iteration of the while loop:
    a. We calculate the middle index 'mid'.
    b. We first check if the middle element is the target.
    c. If not, we check k elements on both sides of mid (within array bounds).
    d. If the target is not found in this range:
        - If the target is smaller than arr[mid], we search the left half, but we can skip k+1 elements
            from mid as we've already checked them.
        - If the target is larger than arr[mid], we search the right half, again skipping k+1 elements.

    3. If we exit the while loop without finding the target, it means the target is not in the array,
    so we return -1.

Key points:
    - This algorithm is more efficient than a simple linear search, which would be O(n).
    - It's less efficient than a standard binary search on a fully sorted array, but more efficient
    than binary search would be if applied directly to this nearly sorted array.
    - The time complexity is O(log(n/k)) because in each iteration, we eliminate k elements from 
    consideration in addition to half of the remaining elements.
    - This algorithm is particularly useful when dealing with large datasets that are known to be
    nearly sorted, such as in real-time data processing where data arrives mostly in order.

Time Complexity:    O(log(n/k)), where n is the number of elements in the array.
Space Complexity:   O(1) as we're using constant extra space.

"""



def search_nearly_sorted(arr, target, k):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        # Check if the middle element is the target
        if arr[mid] == target:
            return mid

        # Check k elements on left and right of mid
        start = max(mid - k, 0)
        end = min(mid + k, len(arr) - 1)

        for i in range(start, end + 1):
            if arr[i] == target:
                return i

        # If target is smaller, search in the left half
        if arr[mid] > target:
            right = mid - k - 1
        # If target is larger, search in the right half
        else:
            left = mid + k + 1

    return -1  # Target not found


input = [2, 3, 10, 4, 40]
target = 4
kth_rotation = 2
result = search_nearly_sorted(input, target, kth_rotation)
print(f"Result: {result}") # Result: 3