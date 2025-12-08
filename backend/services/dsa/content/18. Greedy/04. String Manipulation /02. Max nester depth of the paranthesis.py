"""
Problem Statement:
    Maximum Nesting Depth of the Parentheses
        Given a valid parentheses string s, return the nesting depth of s.
        The nesting depth is the maximum number of nested parentheses.
        
        Example 1:
        Input: s = "(1+(2*3)+((8)/4))+1"
        Output: 3
        Explanation: Digit 8 is inside of 3 nested parentheses in the string.

        Example 2:
        Input: s = "(1)+((2))+(((3)))"
        Output: 3
        Explanation: Digit 3 is inside of 3 nested parentheses in the string.

        Example 3:
        Input: s = "()(())((()()))"
        Output: 3

Explanation:
    1. Initialize a variable to keep track of the current depth and another for the maximum depth.
    2. Iterate through each character in the string:
       - If we encounter an opening parenthesis '(', increment the current depth.
       - If we encounter a closing parenthesis ')', decrement the current depth.
       - After each step, update the maximum depth if the current depth is greater.
    3. Return the maximum depth encountered.

Time Complexity: O(n), where n is the length of the input string.
We iterate through the string once.

Space Complexity: O(1)
We only use two variables regardless of the input size.
"""

class Solution:
    def maxDepth(self, s: str) -> int:
        curr = 0
        max_curr = 0
        
        for char in s:
            if char == '(':
                curr += 1
                max_curr = max(max_curr, curr)
            elif char == ')':
                curr -= 1
        
        return max_curr

# Test the solution
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    s1 = "(1+(2*3)+((8)/4))+1"
    print(f"Input: {s1}")
    print(f"Output: {solution.maxDepth(s1)}")
    
    # Test case 2
    s2 = "(1)+((2))+(((3)))"
    print(f"Input: {s2}")
    print(f"Output: {solution.maxDepth(s2)}")
    
    # Test case 3
    s3 = "()(())((()()))"
    print(f"Input: {s3}")
    print(f"Output: {solution.maxDepth(s3)}")