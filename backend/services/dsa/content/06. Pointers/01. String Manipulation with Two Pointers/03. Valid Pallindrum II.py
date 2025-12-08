"""
Problem: Valid Palindrome II

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

Solution Explanation:
The idea is to use two pointers, one at the start and one at the end of the string, and move them towards the center. 
    If we encounter a mismatch, we have two choices:
        1. Skip the character at the left pointer
        2. Skip the character at the right pointer

We try both these options and if either of them results in a palindrome, we return true.


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
    
    def validPalindrome(self, s: str) -> bool:
        i, j = 0, len(s) - 1
        
        while i < j:
            if s[i] == s[j]:
                i += 1
                j -= 1
            else:
                # If characters don't match, try skipping one character
                # from either left or right and check if the remaining is palindrome
                return self.validPalindromeUtil(s, i + 1, j) or self.validPalindromeUtil(s, i, j - 1)
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

    # Test case 3
    s3 = "abc"
    print(f"Test case 3: {solution.validPalindrome(s3)}")
    # Expected: False

    # Test case 4
    s4 = "deeee"
    print(f"Test case 4: {solution.validPalindrome(s4)}")
    # Expected: True