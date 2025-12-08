"""
Problem: Valid Palindrome 

    Given a string s, return true if the s can be palindrome after deleting at most one character from it.

    A palindrome is a word, phrase, number, or other sequence of characters that reads the same backward as forward.

Example 1:
Input: s = "aba"
Output: true

Example 2:
Input: s = "abca"
Output: true
Explanation: You could delete the character 'c'.


Time Complexity: O(n), where n is the length of the string.
Space Complexity: O(1), as we're using constant extra space.


"""

class Solution:
    
    
    def validPalindromeUtil(self, s, i, j):
        while i < j:
            if s[i] == s[j]:
                i += 1
                j -= 1
            else:
                return False
        
        return True

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    s1 = "aba"
    print(f"Test case 1: {solution.validPalindrome(s1)}")
    # Expected: True

    # Test case 2
    s2 = "abca"
    print(f"Test case 2: {solution.validPalindrome(s2)}")
    # Expected: True
