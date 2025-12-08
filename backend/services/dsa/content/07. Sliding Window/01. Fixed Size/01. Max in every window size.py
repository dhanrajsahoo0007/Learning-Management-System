"""
Problem Statement:
    Given an array of integers and a positive integer K, find the maximum sum of any contiguous subarray of size K.

Explanation:
This solution uses the Sliding Window technique with two pointers, i and j.
    1. Initialize window_sum and max_sum.
    2. Move j to the right, adding elements to window_sum.
    3. If window size < k, keep expanding by moving j.
    4. When window size == k:
        - Update max_sum if necessary.
        - Remove the leftmost element from window_sum.
        - Slide the window by incrementing both i and j.
    5. Repeat until j reaches the end of the array.

Time Complexity: O(n), where n is the length of the input arrayWe traverse the array once with the two pointers.
Space Complexity: O(1), as we only use a constant amount of extra space,regardless of the input size.
"""

def max_sum_subarray(arr, k):
    n = len(arr)
    if n < k:
        return None

    max_sum = float('-inf')
    window_sum = 0
    i = 0
    j = 0

    while j < n:
        # Expand the window
        window_sum += arr[j]

        # If window size is less than k, expand the window
        if j - i + 1 < k:
            j += 1
        # If window size equals k
        elif j - i + 1 == k:
            # Update max_sum
            max_sum = max(max_sum, window_sum)
            # Remove the first element of the window
            window_sum -= arr[i]
            # Slide the window
            i += 1
            j += 1

    return max_sum

# Example usage
arr = [1, 4, 2, 10, 23, 3, 1, 0, 20]
k = 4
result = max_sum_subarray(arr, k)
print(f"Maximum sum of subarray of size {k}: {result}")