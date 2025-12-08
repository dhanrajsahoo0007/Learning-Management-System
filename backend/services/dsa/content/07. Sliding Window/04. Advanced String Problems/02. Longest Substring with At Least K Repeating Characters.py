"""
Problem Statement:
    Given a string and an integer K, find the length of the longest substring that contains exactly K unique characters.

Explanation:
We use a variable size sliding window technique with a dictionary to keep track of character frequencies:
    1. Use two pointers, i and j, to define the window.
    2. Use a dictionary to store the frequency of characters in the current window.
    3. Maintain a count of unique characters in the current window.
    4. Expand the window by moving j to the right, updating the character count and unique character count.
    5. If unique character count exceeds K, shrink the window from the left until we again have K unique characters.
    6. Update the maximum length whenever we have exactly K unique characters.

Time Complexity: O(n), where n is the length of the string.
Space Complexity: O(K), where K is the number of unique characters we're looking for.
"""

def longest_substring_k_repeating(s, k):
    if k == 1:
        return len(s)
    
    max_length = 0
    for unique in range(1, 27):  # maximum 26 unique characters
        char_freq = {}
        i = j = 0
        unique_count = 0
        k_count = 0
        n = len(s)

        while j < n:
            # Update character frequency
            if s[j] not in char_freq:
                char_freq[s[j]] = 1
                unique_count += 1
            else:
                char_freq[s[j]] += 1

            if char_freq[s[j]] == k:
                k_count += 1

            # If we have more unique characters than allowed, shrink the window
            while unique_count > unique:
                char_freq[s[i]] -= 1
                if char_freq[s[i]] == 0:
                    unique_count -= 1
                if char_freq[s[i]] == k - 1:
                    k_count -= 1
                i += 1

            # If all characters in the current window are k-repeating
            if unique_count == k_count == unique:
                max_length = max(max_length, j - i + 1)

            j += 1

    return max_length

# Test cases
def run_test_case(s, k):
    result = longest_substring_k_repeating(s, k)
    print(f"String: {s}")
    print(f"K: {k}")
    print(f"Output: {result}")
    print()

# Test cases
run_test_case("aabacbebebe", 3)
run_test_case("abcdefg", 3)
run_test_case("aaabbb", 3)
run_test_case("aabbcc", 3)
run_test_case("", 2)
run_test_case("aaabbbccc", 1)
run_test_case("abcbdbdbbdcdabd", 2)