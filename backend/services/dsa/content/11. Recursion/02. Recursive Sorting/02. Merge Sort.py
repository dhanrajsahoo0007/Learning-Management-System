"""
The main function merge_sort:
    Base case: If the array has 1 or fewer elements, it's already sorted, so we return it.
    Recursive case:
        We divide the array into two halves.
        We recursively call merge_sort on both halves.
        We merge the sorted halves using the merge function.

Time complexity: O(n log n) in all cases
Space complexity: O(n) for the temporary arrays in the merge step

"""



def merge_sort(arr):
    # Base case: if the array has 1 or fewer elements, it's already sorted
    if len(arr) <= 1:
        return arr
    
    # Divide the array into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # Recursively sort both halves
    left_half = merge_sort(left_half)
    right_half = merge_sort(right_half)
    
    # Merge the sorted halves
    return merge(left_half, right_half)

"""
The merge function:
    This function takes two sorted arrays and merges them into a single sorted array.
    It compares elements from both arrays and adds the smaller one to the result.
    After one array is exhausted, it adds any remaining elements from the other array.
"""

def merge(left, right):
    result = []
    left_index, right_index = 0, 0
    
    # Compare elements from both lists and add the smaller one to the result
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1
    
    # Add any remaining elements
    result.extend(left[left_index:])
    result.extend(right[right_index:])
    
    return result

# Test the function
arr = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", arr)
sorted_arr = merge_sort(arr)
print("Sorted array:", sorted_arr)