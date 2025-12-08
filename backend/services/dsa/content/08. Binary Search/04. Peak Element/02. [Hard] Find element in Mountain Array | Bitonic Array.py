"""
Problem Statement:
    Given a Bitonic array and a target element, find the index of the target element in the array.
    A Bitonic array is an array that is first strictly increasing and then strictly decreasing. If the element is not present, return -1.

Algorithm:
    1. Find the peak element (maximum) in the Bitonic array using the previous findPeakElement function.
    2. If the target is equal to the peak element, return its index.
    3. If the target is greater than the peak element, it's not in the array, return -1.
    4. Perform binary search on the left (ascending) part of the array.
    5. If not found, perform binary search on the right (descending) part of the array.
    6. If still not found, return -1.

Time Complexity: O(log n), where n is the length of the array
Space Complexity: O(1), as we only use a constant amount of extra space

Note: This algorithm assumes that the input array is indeed Bitonic.
"""

def findPeakElement(arr: [int]) -> int:
    n = len(arr)
    if n == 1:
        return 0
    if arr[0] > arr[1]:
        return 0
    if arr[n - 1] > arr[n - 2]:
        return n - 1

    low, high = 1, n - 2
    while low <= high:
        mid = (low + high) // 2
        if arr[mid - 1] < arr[mid] and arr[mid] > arr[mid + 1]:
            return mid
        if arr[mid] > arr[mid - 1]:
            low = mid + 1
        else:
            high = mid - 1
    return -1  # This should never be reached for a valid Bitonic array

def binarySearchAscending(arr: [int], low: int, high: int, target: int) -> int:
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def binarySearchDescending(arr: [int], low: int, high: int, target: int) -> int:
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def searchBitonicArray(arr: [int], target: int) -> int:
    peak = findPeakElement(arr)
    
    # Check if the peak is the target
    if arr[peak] == target:
        return peak
    
    # If target is greater than peak, it's not in the array
    if target > arr[peak]:
        return -1
    
    # Search in the left (ascending) part
    left_result = binarySearchAscending(arr, 0, peak - 1, target)
    if left_result != -1:
        return left_result
    
    # Search in the right (descending) part
    right_result = binarySearchDescending(arr, peak + 1, len(arr) - 1, target)
    return right_result

# Example usage
if __name__ == "__main__":
    test_cases = [
        ([1, 3, 8, 12, 4, 2], 4),
        ([1, 3, 8, 12, 9, 5, 2], 9),
        ([1, 3, 8, 12, 9, 5, 2], 7),
        ([5, 6, 7, 8, 9, 10, 3, 2, 1], 30),
        ([1, 2, 3, 4, 5, 4, 3, 2, 1], 5)
    ]

    for i, (arr, target) in enumerate(test_cases, 1):
        result = searchBitonicArray(arr, target)
        print(f"Test case {i}:")
        print(f"Bitonic array: {arr}")
        print(f"Target: {target}")
        if result != -1:
            print(f"Element found at index: {result}")
        else:
            print("Element not found in the array")
        print()