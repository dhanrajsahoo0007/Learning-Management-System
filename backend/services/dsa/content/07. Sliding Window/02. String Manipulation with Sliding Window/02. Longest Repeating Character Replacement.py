"""
Problem Statement:
    Given an array of integers arr and an integer k, find the maximum for each and every contiguous subarray of size k.

Explanation:
    1. Initialize two pointers, i and j, both at the start of the array.
    2. Use a variable window_max to keep track of the maximum in the current window.
    3. Slide the window through the array:
        - Expand the window by moving j to the right and updating window_max.
        - If the window size equals k, add window_max to the result and slide the window.
        - If the element leaving the window was the max, recalculate window_max.

Time Complexity: O(n)
Space Complexity: O(n-k+1) for the result list, which is O(n) in the worst case when k is small.

"""


def character_replacement(s, k):
    n = len(s)
    if n < 2:
        return n

    char_count = {}
    max_count = 0
    max_length = 0
    i = j = 0

    while j < n:
        # Update character count for the new character
        char_count[s[j]] = char_count.get(s[j], 0) + 1
        max_count = max(max_count, char_count[s[j]])

        cur_len = j - i + 1
        
        # If window size is less than k + max_count, expand the window
        if cur_len <= k + max_count:
            max_length = max(max_length,cur_len)
            j += 1

        # If window size is greater than k + max_count
        elif cur_len > k + max_count:
            # Shrink the window
            char_count[s[i]] -= 1
            i += 1
            j += 1

    return max_length

# Example usage
s = "ABAB"
k = 2
result = character_replacement(s, k)
print(f"Length of the longest substring after at most {k} replacements: {result}")

s = "AAABBC"
k = 2
result = character_replacement(s, k)
print(f"Length of the longest substring after at most {k} replacements: {result}")