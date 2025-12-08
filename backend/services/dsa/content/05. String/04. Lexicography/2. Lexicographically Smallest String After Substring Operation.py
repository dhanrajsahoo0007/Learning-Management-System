"""
Lexicographically Smallest String After Substring Operation

    Given a string s consisting of lowercase English letters. Perform the following operation:
    
    * Select any non-empty substring, then replace every letter of the substring with the preceding 
    letter of the English alphabet. For example, 'b' is converted to 'a', and 'a' is converted to 'z'.
    
    Return the lexicographically smallest string after performing the operation.

Example 1:
    Input: s = "cbabc"
    Output: "baabc"
    Explanation: Perform the operation on the substring starting at index 0, and ending at index 1 inclusive.

Example 2:
    Input: s = "aa"
    Output: "az"
    Explanation: Perform the operation on the last letter.

Example 3:
    Input: s = "acbbc"
    Output: "abaab"
    Explanation: Perform the operation on the substring starting at index 1, and ending at index 4 inclusive.

Example 4:
    Input: s = "leetcode"
    Output: "kddsbncd"
    Explanation: Perform the operation on the entire string.

Constraints:
    * 1 <= s.length <= 3 * 10^5
    * s consists of lowercase English letters

Time Complexity: O(n), where n is the length of the string
Space Complexity: O(n) to create a list from the string
"""

class Solution:
    def smallestString(self, s: str) -> str:
        s = list(s)
        n = len(s)
        i = 0
        
        # Skip leading 'a's
        while i < n and s[i] == 'a':
            i += 1
        
        # If the entire string is 'a's, change the last character to 'z'
        if i == n:
            s[-1] = 'z'
        else:
            # Replace characters with their preceding letter until we hit an 'a' or end of string
            while i < n and s[i] != 'a':
                s[i] = chr(ord(s[i]) - 1)
                i += 1
        
        return ''.join(s)

# Test cases
def test_smallestString():
    solution = Solution()
    
    # Test case 1
    s1 = "cbabc"
    print("Test case 1:")
    print("Input:", s1)
    print("Output:", solution.smallestString(s1))
    print()
    
    # Test case 2
    s2 = "aa"
    print("Test case 2:")
    print("Input:", s2)
    print("Output:", solution.smallestString(s2))
    print()
    
    # Test case 3
    s3 = "acbbc"
    print("Test case 3:")
    print("Input:", s3)
    print("Output:", solution.smallestString(s3))
    print()
    
    # Test case 4
    s4 = "leetcode"
    print("Test case 4:")
    print("Input:", s4)
    print("Output:", solution.smallestString(s4))
    print()

# Run the tests
test_smallestString()