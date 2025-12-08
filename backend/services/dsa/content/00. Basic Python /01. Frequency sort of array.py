
"""
Problem Statement: Sort Array by Decreasing Frequency
    Given an array of integers, sort the array according to frequency of elements. 
    That is, elements that have higher frequency come first. If frequencies of two elements are same, then smaller number comes first.

Example 1:
    Input: arr = [2, 5, 2, 8, 5, 6, 8, 8]
    Output: [8, 8, 8, 2, 2, 5, 5, 6]

Example 2:
    Input: arr = [2, 5, 2, 6, -1, 9999999, 5, 8, 8, 8]
    Output: [8, 8, 8, 2, 2, 5, 5, 6, -1, 9999999]

Constraints:
    1 <= arr.length <= 10^5
    -10^9 <= arr[i] <= 10^9
"""
from typing import List
from collections import Counter

def frequency_sort_using_map(arr: List[int]) -> List[int]:
    # Count the frequency of each number
    freq_count = Counter(arr)
    
    # Sort the unique elements based on their frequency and value
    sorted_elements = sorted(freq_count.keys(), key=lambda x: (-freq_count[x], x))
    
    # Construct the result array
    result = []
    for num in sorted_elements:
        result.extend([num] * freq_count[num])
    
    return result

"""
Time Complexity for frequency_sort_using_map:
O(n log k), where n is the number of elements in the input array and k is the number of unique elements.
    - Counting frequencies: O(n)
    - Sorting unique elements: O(k log k)
    - Constructing result array: O(n)
Overall: O(n + k log k), which simplifies to O(n log k) since k <= n.

Space Complexity for frequency_sort_using_map:O(n)
    - Counter object: O(k)
    - Sorted unique elements list: O(k)
    - Result array: O(n)
Overall: O(n) since k <= n.
"""

def frequency_sort(arr: List[int]) -> List[int]:
    # Count the frequency of each number
    freq_count = Counter(arr)
    
    # Define a key function for sorting
    def sort_key(x):
        return (-freq_count[x], x)
    
    # Sort the array using the key function
    return sorted(arr, key=sort_key)

"""
Time Complexity for frequency_sort: O(n log n), where n is the number of elements in the input array.
    - Counting frequencies: O(n)
    - Sorting the entire array: O(n log n)
Overall: O(n log n)

Space Complexity for frequency_sort: O(n)
    - Counter object: O(n)
    - Sorted array: O(n) (Python's Timsort uses O(n) auxiliary space in the worst case)
Overall: O(n)
"""

# Example usage
arr1 = [2, 5, 2, 8, 5, 6, 8, 8]
print(f"Using map - Example 1: {frequency_sort_using_map(arr1)}")
print(f"Direct sort - Example 1: {frequency_sort(arr1)}")

arr2 = [2, 5, 2, 6, -1, 9999999, 5, 8, 8, 8]
print(f"Using map - Example 2: {frequency_sort_using_map(arr2)}")
print(f"Direct sort - Example 2: {frequency_sort(arr2)}")