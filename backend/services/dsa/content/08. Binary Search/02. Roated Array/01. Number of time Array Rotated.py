"""
Problem Statement:
    Given a sorted array arr[] of N distinct integers that has been rotated some number of times,
    find the number of rotations the array has undergone.

    
Explanation:
    1. This algorithm uses a modified binary search to find the number of rotations.
    2. The number of rotations is equal to the index of the smallest element in the rotated array.
    3. We compare the middle element with its next and previous elements to check if it's the smallest.
    4. If not, we decide which half of the array to search next based on the sorted half.
    
next = (mid + 1) % n:

    This calculates the index of the element immediately after the middle element.
    The modulo operation % n ensures that if mid + 1 exceeds the array length, it wraps around to the beginning of the array.
    For example, if mid is the last index of the array, next will be 0 (the first index).


prevd = (mid - 1 + n) % n:

    This calculates the index of the element immediately before the middle element.
    We add n before the modulo operation to handle the case when mid is 0.
    If mid is 0, mid - 1 would be -1, but -1 + n ensures we get the last element of the array.
    The modulo operation % n then ensures we stay within the array bounds.

Time Complexity: O(log n), where n is the number of elements in the array.
This is because we're using a binary search approach, halving the search space in each iteration.

Space Complexity: O(1), as we're only using a constant amount of extra space
regardless of the input size.

"""

def count_rotations(arr):
    n = len(arr)
    left, right = 0, n - 1
    
    # If the array is not rotated at all
    if arr[left] <= arr[right]:
        return 0
    
    while left <= right:
        # If the first element is less than the last element,
        # then we have found the smallest element
        if arr[left] <= arr[right]:
            return left
        
        mid = (left + right) // 2
        next = (mid + 1) % n
        prev = (mid - 1 + n) % n
        
        # Check if mid element is the smallest
        if arr[mid] <= arr[next] and arr[mid] <= arr[prev]:
            return mid
        
        # If the right half is sorted, the pivot must be in the left half
        elif arr[mid] <= arr[right]:
            right = mid - 1
        
        # If the left half is sorted, the pivot must be in the right half
        elif arr[left] <= arr[mid]:
            left = mid + 1

    return 0  # This line should never be reached for a valid input

# Example usage:
arr = [4, 5, 6, 7, 0, 1, 2]
rotations = count_rotations(arr)
print(f"The array is rotated {rotations} times.")