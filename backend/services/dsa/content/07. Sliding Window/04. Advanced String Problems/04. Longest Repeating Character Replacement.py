"""
You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

Example 1:

    Input: s = "ABAB", k = 2
    Output: 4
    Explanation: Replace the two 'A's with two 'B's or vice versa.


Time complexity: O(n)
The string is traversed once by the right pointer, and in the worst case, the left pointer also traverses the entire string. Dictionary operations like updating counts and finding the maximum frequency take constant time (since there are only 26 possible characters).

Space complexity: O(1)
The dictionary count can hold at most 26 characters (since there are only uppercase English letters), so its size does not grow with the length of the input string.
"""
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        # First find the largest window with the distinct characters less than equal to k
        # Then in that window replace the distinct characters with that of the remaining characters.
        max_freq_of_character = 0
        ans = 0
        window_start = 0
        feq_counter = {}

        for window_end in range(len(s)):
            current_char = s[window_end]
            feq_counter[current_char] = feq_counter.get(current_char, 0) + 1
            # This now indicates the maximum frequency of a character in the window
            max_freq_of_character = max(max_freq_of_character, feq_counter[current_char])

            # If i have a window - max_freq_character is  larger than k
            # i.e. if the window size - most frequent word is greater than k, indicates more replacements, hence reduce window size
            if (window_end - window_start + 1) - max_freq_of_character > k:
                feq_counter[s[window_start]] -= 1
                window_start += 1
            ans = max(ans, window_end-window_start+1)
        return ans
