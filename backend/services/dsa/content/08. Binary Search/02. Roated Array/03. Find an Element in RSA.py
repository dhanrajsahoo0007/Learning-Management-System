"""
Problem Statement:
    Given a sorted array of n elements, which is rotated at some unknown pivot, and a target element.
    The task is to find the index of the target element in the array. If the element is not present, return -1.

For example:
    Input: arr = [4, 5, 6, 7, 0, 1, 2], target = 0
    Output: 4
    The array was originally sorted in ascending order and then rotated. We need to find the target
    element 0, which is at index 4 in this rotated array.

APPROACH - 1
=============
Based on the previous problem of finding how many times the array is roated 

Explanation:
This problem can be solved efficiently using a two-step approach:

1. Find the rotation point:
   - First, we find the number of times the array has been rotated.
   - This is equivalent to finding the index of the smallest element in the rotated array.
   - We use a modified binary search to find this rotation point in O(log n) time.

2. Perform binary search:
   - Once we know the rotation point, we can treat the array as two sorted subarrays.
   - We perform binary search on both subarrays to find the target element.
   - If the element is found in either subarray, we return its index.
   - If not found in both subarrays, we return -1.


Time Complexity Analysis:
    - find_rotation_count: O(log n)
    - binary_search: O(log n)
    - search_rotated_array: O(log n) + O(log n) = O(log n)

    The overall time complexity is O(log n), where n is the number of elements in the array.
    We perform at most two binary searches, but this still results in logarithmic time complexity.

Space Complexity Analysis:
    The space complexity is O(1) 

"""

def count_rotations(arr):
    left, right = 0, len(arr) - 1
    
    # If the array is not rotated at all
    if arr[left] <= arr[right]:
        return 0
    
    while left <= right:
        # If the first element is less than the last element,
        # then we have found the smallest element
        if arr[left] <= arr[right]:
            return left
        
        mid = (left + right) // 2
        next_mid = (mid + 1) % len(arr)
        prev_mid = (mid - 1 + len(arr)) % len(arr)
        
        # Check if mid element is the smallest
        if arr[mid] <= arr[next_mid] and arr[mid] <= arr[prev_mid]:
            return mid
        
        # If the right half is sorted, the pivot must be in the left half
        elif arr[mid] <= arr[right]:
            right = mid - 1
        
        # If the left half is sorted, the pivot must be in the right half
        elif arr[left] <= arr[mid]:
            left = mid + 1

    return 0  # This line should never be reached for a valid input

def binary_search(arr, target, left, right):
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def search_rotated_array(arr, target):
    n = len(arr)
    rotation_index = count_rotations(arr)
    
    # Search in the left sorted subarray
    left_result = binary_search(arr, target, 0, rotation_index - 1)
    if left_result != -1:
        return left_result
    
    # Search in the right sorted subarray
    right_result = binary_search(arr, target, rotation_index, n - 1)
    return right_result

# Example usage:
arr = [4, 5, 6, 7, 0, 1, 2]
target = 0
result = search_rotated_array(arr, target)
print(f"The element {target} is found at index: {result}")



"""

APPROACH - 2 
=============

Explanation:
    This algorithm uses a modified binary search to find the target element in a rotated sorted array.
    In each iteration, we determine which half of the array is sorted and then check if the target
    lies within the sorted half. If it does, we search that half; otherwise, we search the other half.

    1. Calculate the middle index.
    2. If the middle element is the target, return its index.
    3. Check which half of the array is sorted:
    - If the left half is sorted, check if the target is in this range. If yes, search left; otherwise, search right.
    - If the right half is sorted, check if the target is in this range. If yes, search right; otherwise, search left.
    4. Repeat until the element is found or the search space is exhausted.

Time Complexity: O(log n), where n is the number of elements in the array.
This is because we're using a binary search approach, halving the search space in each iteration.

Space Complexity: O(1), as we're only using a constant amount of extra space
regardless of the input size.
"""

def search_rotated_array(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        # Check if the left half is sorted
        if arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # If the left half is not sorted, the right half must be sorted
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1  # Element not found

# Example usage:
arr = [4, 5, 6, 7, 0, 1, 2]
target = 0
result = search_rotated_array(arr, target)
print(f"The element {target} is found at index: {result}")
