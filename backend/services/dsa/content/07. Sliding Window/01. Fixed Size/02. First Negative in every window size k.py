"""
Problem Statement:
    Given an array of integers and a positive integer K, find the first negative integer in every contiguous subarray of size K. 
    If a subarray does not contain a negative integer, output 0 for that subarray.

Explanation:
    We use the sliding window technique with two pointers, l and r:
        1. Initialize two pointers, l and r, both at the start of the array.
        2. Use temp_store to keep track of negative numbers in the current window.
        3. Move r to the right, adding negative numbers to temp_store.
        4. When the window size (r - l + 1) reaches K:
            - Add the first negative number (or 0) to final_ans.
            - Move l to the right, removing the first negative number from temp_store if necessary.
        5. Repeat steps 3-4 until r reaches the end of the array.

Time Complexity: O(n), where n is the length of the input array.We traverse the array once with the two pointers.
Space Complexity: O(k) in the worst case, where k is the window size.temp_store might store up to k elements if all elements in a window are negative.
"""

def return_ans(arr, k):
    l = 0
    r = 0
    temp_store = []
    final_ans = []

    while r < len(arr):
        # If current element is negative, add to temp_store
        if arr[r] < 0:
            temp_store.append(arr[r])

        # If window size is less than k, expand window
        if r - l + 1 < k:
            r += 1
        # If window size equals k
        elif r - l + 1 == k:
            # If no negative numbers in current window, append 0
            if len(temp_store) == 0:
                final_ans.append(0)
            else:
                # Append first negative number in current window
                final_ans.append(temp_store[0])

            # If element leaving the window is negative, remove it from temp_store
            if arr[l] < 0:
                temp_store.pop(0)

            # Slide the window
            r += 1
            l += 1

    return final_ans

# Example usage
arr = [12, -1, -7, 8, -15, 30, 16, 28]
k = 3
result = return_ans(arr, k)
print(f"First negative number in every window of size {k}: {result}")