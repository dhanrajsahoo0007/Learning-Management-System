"""
        It is the shortest substring of s that includes all of the characters present in t.
        It must contain at least the same frequency of each character as in t.
        The order of the characters does not matter here.
        Time complexity O(nm)
        """
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        
        from collections import Counter

        def valid_window(freq_counter: Counter, req_freq: Counter) -> bool:
            for char in req_freq:
                if req_freq[char] > freq_counter.get(char, 0):
                    return False
            return True

        def adjust_valid_window(s, window_start, window_end, freq_counter, req_freq):
            while window_start < window_end:
                char_to_remove = s[window_start]
                freq_counter[char_to_remove] -= 1
                if valid_window(freq_counter, req_freq):
                    window_start += 1
                else:
                    freq_counter[char_to_remove] += 1
                    break
            return window_start

        minimum_window = [0, 0]
        minimum_window_len = float('inf')
        window_start = 0
        window_end = 0
        freq_counter = Counter()
        req_freq = Counter(t)

        while window_end < len(s):
            current_char = s[window_end]
            freq_counter[current_char] += 1
            # Check if the current frequency in the window matches the freq of the required_freq
            if valid_window(freq_counter, req_freq):
                new_start = adjust_valid_window(s, window_start, window_end, freq_counter, req_freq)
                window_start = new_start
                new_window_size = window_end - new_start + 1
                if new_window_size < minimum_window_len:
                    minimum_window = [window_start, window_end+1]
                    minimum_window_len = new_window_size
            window_end += 1
        return s[minimum_window[0]: minimum_window[1]]

    def minWindow(self, s: str, t: str) -> str:
        """
        Time complexity of (O(n))
        Space Complexity of (O(1))
        """

        from collections import Counter
        if not t or not s:
            return ""
        
        # Step 1: Create a frequency counter for the characters in t
        req_freq = Counter(t)
        required_unique_chars = len(req_freq)
        
        # Step 2: Initialize the sliding window
        window_start = 0
        matched_count = 0  # Keeps track of how many unique characters have been satisfied
        freq_counter = Counter()
        
        minimum_window = [0, 0]
        minimum_window_len = float('inf')
        
        for window_end in range(len(s)):
            current_char = s[window_end]
            freq_counter[current_char] += 1
            
            # If current_char is in t and its frequency matches the required frequency, increment matched_count
            if current_char in req_freq and freq_counter[current_char] == req_freq[current_char]:
                matched_count += 1
            
            # Once all characters have been matched, try shrinking the window
            while matched_count == required_unique_chars:
                new_window_size = window_end - window_start + 1
                if new_window_size < minimum_window_len:
                    minimum_window = [window_start, window_end + 1]
                    minimum_window_len = new_window_size
                
                # Now try to shrink the window from the left
                left_char = s[window_start]
                freq_counter[left_char] -= 1
                
                # If left_char was part of t and is now underrepresented, decrement matched_count
                if left_char in req_freq and freq_counter[left_char] < req_freq[left_char]:
                    matched_count -= 1
                
                window_start += 1
        
        # If no valid window is found, return an empty string
        if minimum_window_len == float('inf'):
            return ""
        
        return s[minimum_window[0]: minimum_window[1]]

# Driver code
def main():
    s = ["PATTERN", "LIFE", "ABRACADABRA", "STRIKER", "DFFDFDFVD"]
    t = ["TN", "I", "ABC", "RK", "VDD"]
    for i in range(len(s)):
        print(i + 1, ".\ts: ", s[i], "\n\tt: ", t[i], "\n\tThe minimum substring containing ", \
              t[i], " is: ", Solution().minWindow(s[i], t[i]), sep="")
        print("-" * 100)

if __name__ == '__main__':
    main()
