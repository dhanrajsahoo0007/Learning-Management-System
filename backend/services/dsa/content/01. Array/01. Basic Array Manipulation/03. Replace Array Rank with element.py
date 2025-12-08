"""
Problem Statement:
    Given an array of integers, replace each element with its rank. 
    The rank represents the relative position of the element in the sorted array of unique elements,
    where the smallest element has rank 1.

Explanation:
    This solution follows these steps:
    1. Create a sorted array of unique elements from the input array.
    2. Create a dictionary mapping each unique element to its rank.
    3. Replace each element in the original array with its corresponding rank.

Time Complexity: O(n log n + m)
    - Sorting the unique elements: O(n log n), where n is the number of unique elements.
    - Creating the rank dictionary: O(n)
    - Replacing elements with ranks: O(m), where m is the length of the original array.

Space Complexity: O(n + m)
    - O(n) for the sorted array and the rank dictionary, where n is the number of unique elements.
    - O(m) for the result array, where m is the length of the original array.

Examples:
1. Input: [100, 2, 70, 2, 8, 70, 100]
   Output: [4, 1, 3, 1, 2, 3, 4]

2. Input: [5, 5, 5, 5]
   Output: [1, 1, 1, 1]

3. Input: [10, 20, 30, 40, 50]
   Output: [1, 2, 3, 4, 5]
"""


def replace_with_rank(arr):
    # Create a sorted copy of the array with unique elements
    sorted_arr = sorted(set(arr))
    
    # Create a dictionary to store the rank of each element
    rank_dict = {}
    for rank, val in enumerate(sorted_arr):
        rank_dict[val] = rank + 1
    
    # Replace each element with its rank
    result = []
    for val in arr:
        result.append(rank_dict[val])
    
    return result

# Example usage
arr = [100, 2, 70, 2, 8, 70, 100]
result = replace_with_rank(arr)
print(result)  # Output: [4, 1, 3, 1, 2, 3, 4]