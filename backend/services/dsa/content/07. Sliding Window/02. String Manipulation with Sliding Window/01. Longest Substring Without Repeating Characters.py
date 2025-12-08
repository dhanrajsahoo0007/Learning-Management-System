"""
LeetCode 3. Longest Substring Without Repeating Characters

Given a string s, find the length of the longest substring without duplicate characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Constraints:
0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.
"""

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Hash array to store last seen index of characters
        hash_map = [-1] * 256  
        
        n = len(s)
        l = 0   # left pointer
        r = 0   # right pointer
        max_len = 0
        
        while r < n:
            # If character was seen before
            if hash_map[ord(s[r])] != -1:
                # Check if it is inside current window
                if hash_map[ord(s[r])] >= l:
                    # Move left pointer to one right of previous index
                    l = hash_map[ord(s[r])] + 1
            
            # Calculate current window length
            cur_len = r - l + 1
            max_len = max(cur_len, max_len)
            
            # Update hash with latest index of character
            hash_map[ord(s[r])] = r
            
            # Expand right pointer
            r += 1
        
        return max_len


if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    print(sol.lengthOfLongestSubstring("abcabcbb"))  # Output: 3
    print(sol.lengthOfLongestSubstring("bbbbb"))     # Output: 1
    print(sol.lengthOfLongestSubstring("pwwkew"))    # Output: 3
    print(sol.lengthOfLongestSubstring(""))          # Output: 0
    print(sol.lengthOfLongestSubstring("dvdf"))      # Output: 3


