"""
Problem Statement:
Given an array of integers and a positive integer k, find the maximum element in every contiguous subarray of size k.

Explanation:
We use a simple sliding window technique:
1. Initialize two pointers, i and j, both at the start of the array.
2. Maintain a variable to store the maximum element in the current window.
3. Slide the window through the array:
   - Expand the window by moving j to the right.
   - When the window size reaches k, add the current maximum to the result.
   - Slide the window by moving i to the right and updating the maximum if necessary.

Time Complexity: O(n), where n is the length of the array.
We traverse the array once with the sliding window.

Space Complexity: O(n-k+1) for the result array, O(1) for additional variables.
"""

def max_of_subarrays(arr, k):
    n = len(arr)
    if n < k:
        return []

    result = []
    window_max = float('-inf')
    i = j = 0

    while j < n:
        # Update window_max with the new element
        window_max = max(window_max, arr[j])

        # If window size is less than k, expand the window
        if j - i + 1 < k:
            j += 1
        # If window size equals k
        elif j - i + 1 == k:
            # Add current window_max to result
            result.append(window_max)
            # If the element leaving was the max, find the new max
            if arr[i] == window_max:
                window_max = max(arr[i+1:j+1])
            # Slide the window
            i += 1
            j += 1

    return result

# Example usage
arr = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
result = max_of_subarrays(arr, k)
print(f"Maximum of all subarrays of size {k}: {result}")