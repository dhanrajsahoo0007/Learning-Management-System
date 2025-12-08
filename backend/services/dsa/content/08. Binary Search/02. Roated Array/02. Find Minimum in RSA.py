"""
Problem Statement:
    Given a sorted array of n elements, which is rotated at some unknown pivot, find the minimum element in the array.

Example:
    Input: arr = [4, 5, 6, 7, 0, 1, 2]
    Output: 0

Explanation:
    The original sorted array was [0, 1, 2, 4, 5, 6, 7] and it was rotated 4 times.
    The minimum element (0) is at index 4, which is equal to the number of rotations.

Approach:
    1. We'll use the solution to the "Number of Times Array is Rotated" problem.
    2. The index returned by this function will be the index of the minimum element.
    3. We can then return the element at this index as the minimum element.

Explanation of the algorithm:

    1. The find_rotation_count function:
        - Uses binary search to find the rotation point of the array.
        - The rotation point is the index where the next element is smaller than the current element.
        - This index is equal to the number of times the array has been rotated.

    2. The find_minimum_in_rsa function:
        - First checks if the array is empty.
        - Then calls find_rotation_count to get the index of the minimum element.
        - Returns the element at this index, which is the minimum element.

    3. Key points:
        - In a rotated sorted array, the number of rotations is equal to the index of the minimum element.
        - This approach leverages the existing solution to the "Number of Times Array is Rotated" problem.
        - It maintains the O(log n) time complexity of the binary search approach.



Time Complexity: O(log n), where n is the number of elements in the array.
Space Complexity: O(1) as we're using constant extra space.
"""

def find_rotation_count(arr):
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

def find_minimum_in_rsa(arr):
    if not arr:
        return None  # or raise an exception for empty array
    
    rotation_count = find_rotation_count(arr)
    return arr[rotation_count]
