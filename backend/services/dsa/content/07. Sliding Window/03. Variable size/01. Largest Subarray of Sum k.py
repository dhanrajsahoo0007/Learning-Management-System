"""
Problem Statement:
    Given an array of integers and a target sum K, find the length of the largest subarray.
    with sum of the elements equal to the given value K.

Explanation:
We use a modified sliding window technique with an initial check before shrinking:
    1. Initialize two pointers, i and j, both at the start of the array.
    2. Maintain a running sum (window_sum) of the elements in the current window.
    3. Expand the window by moving j to the right and adding elements to window_sum.
    4. If window_sum exceeds K, first check if i <= j, then enter a loop to shrink the window.
    5. If window_sum equals K, update the max_length.

Note: This approach works for arrays with positive numbers. For arrays with negative 
numbers, a more complex approach using a hash map would be more efficient.

Time Complexity: O(n)
Space Complexity: O(1),
"""

def largest_subarray_sum_k(arr, k):
    n = len(arr)
    max_length = 0
    window_sum = 0
    i = 0
    j = 0

    while j < n:
        # Expand the window
        window_sum += arr[j]

        # If window_sum exceeds k, first check if i <= j, then shrink the window
        if window_sum > k and i <= j:
            while window_sum > k and i <= j:
                window_sum -= arr[i]
                i += 1

        # If window_sum equals k, update max_length
        if window_sum == k:
            max_length = max(max_length, j - i + 1)

        # Move to the next element
        j += 1

    return max_length

# Example usage
arr = [10, 5, 2,-8, 8, 7,-2 , 9]
k = 7
result = largest_subarray_sum_k(arr, k)
print(f"Length of the largest subarray with sum {k}: {result}")


"""
Problem Statement:
    Given an array of integers (including negative numbers) and a target sum K, 
    find the length of the largest subarray with sum of the elements equal to the given value K.

Explanation:
We use a prefix sum approach with a hash map:
    1. Initialize a variable to keep track of the cumulative sum.
    2. Use a hash map to store the first occurrence of each cumulative sum.
    3. Iterate through the array:
    - Update the cumulative sum.
    - If the current sum equals K, update the max length.
    - If (current sum - K) exists in the hash map, update the max length.
    - Store the current sum in the hash map if it's not already there.

Time Complexity: O(n), where n is the length of the array.
Space Complexity: O(n) in the worst case
"""

def largest_subarray_sum_k(arr, k):
    n = len(arr)
    prefix_sum = 0
    max_length = 0
    sum_index = {0: -1}  # Initialize with 0 sum at index -1

    for i in range(n):
        prefix_sum += arr[i]

        # If the current prefix sum equals k, update max_length
        if prefix_sum == k:
            max_length = i + 1

        # If (prefix_sum - k) exists in sum_index, update max_length
        if prefix_sum - k in sum_index:
            max_length = max(max_length, i - sum_index[prefix_sum - k])

        # Store the current prefix sum in the hash map if it's not already there
        if prefix_sum not in sum_index:
            sum_index[prefix_sum] = i

    return max_length


arr = [10, 5, 2,-8, 8, 7,-2, 9]
k = 7
result = largest_subarray_sum_k(arr, k)
print(f"Length of the largest subarray with sum {k}: {result}")