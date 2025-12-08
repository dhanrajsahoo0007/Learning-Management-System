"""
Problem Statement:
    Given an integer array arr of size N, sorted in ascending order (may contain duplicate values)
    and a target value k. Now the array is rotated at some pivot point unknown to you. 
    Return True if k is present and otherwise, return False.

Example:
    Input: arr = [3, 3, 1, 2, 3, 3], k = 1
    Output: True

Explanation:
    The array is rotated, and the target value 1 is present in the array.

    Approach:
        1. We can't directly apply binary search due to the presence of duplicates.
        2. We'll use a modified binary search that handles duplicates and rotation.
        3. At each step, we'll compare the middle element with the target and the ends of the current subarray.
        4. If we can't determine which half to search, we'll reduce the search space by one element.


Explanation of the algorithm:

    1. We use two pointers, 'left' and 'right', to define the current search range.

    2. In each iteration:
        a. We calculate the middle index 'mid'.
        b. If arr[mid] is the target, we return True.
        c. We then handle three cases:

            Case 1: If arr[left] == arr[mid] == arr[right], we can't determine which half to search.
                In this case, we simply reduce our search space by moving left pointer right and right pointer left.

            Case 2: If the left half is sorted (arr[left] <= arr[mid]):
                - If the target is in the range [arr[left], arr[mid]), we search the left half.
                - Otherwise, we search the right half.

            Case 3: If the right half is sorted:
                - If the target is in the range (arr[mid], arr[right]], we search the right half.
                - Otherwise, we search the left half.

    3. If we exit the while loop without finding the target, we return False.

Time Complexity: O(N) in the worst case (when all elements are the same), O(log N) in the average case.
Space Complexity: O(1) as we're using constant extra space.
"""

def search_rotated_array_duplicates(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return True

        # If we can't determine which half to search, reduce the search space
        if arr[left] == arr[mid] == arr[right]:
            left += 1
            right -= 1

        # If the left half is sorted
        elif arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
                
        # If the right half is sorted
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1

    return False

arr = [1, 2, 3, 4, 5]
target = 6
result = search_rotated_array_duplicates(arr, target)
print(f"Result: {result}\n")

