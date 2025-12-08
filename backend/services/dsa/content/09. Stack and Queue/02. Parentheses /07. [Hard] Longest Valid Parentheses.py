"""
Problem Statement:
    Given a string containing just the characters '(' and ')', return the length of the longest 
    valid (well-formed) parentheses substring.

Explanation:
    1. First Pass (Left to Right):
        - Initialize an array to store the length of valid substrings ending at each index.
        - Keep track of open parentheses count and the start of potential valid substrings.
        - Update the array when we find matching parentheses.

    2. Second Pass (Right to Left):
        - Initialize another array to store the length of valid substrings starting at each index.
        - Keep track of close parentheses count and the end of potential valid substrings.
        - Update the array when we find matching parentheses.

    3. Result:
        - Find the maximum value in both arrays, which represents the longest valid parentheses substring.

Key Points:
    1. Two-pass approach allows us to handle cases where the longest valid substring is in the middle.
    2. We don't need a stack, which might be more intuitive for some people.
    3. The solution can identify valid substrings that are not necessarily at the start or end of the string.

Time Complexity: O(n), where n is the length of the input string.
                We make two passes through the string.

Space Complexity: O(n), as we use two arrays of length n to store intermediate results.

Examples:
1. Input: s = "(()"
   Output: 2
   Explanation: The longest valid parentheses substring is "()".

2. Input: s = ")()())"
   Output: 4
   Explanation: The longest valid parentheses substring is "()()".

3. Input: s = ""
   Output: 0

Constraints:
    * 0 <= s.length <= 3 * 10^4
    * s[i] is '(' or ')'.
"""

class Solution1:
    def longestValidParentheses(self, s: str) -> int:
        # First pass: left to right
        left_to_right = [0] * len(s)
        open_count = 0
        start = 0
        for i, char in enumerate(s):
            if char == '(':
                open_count += 1
            elif char == ')':
                if open_count > 0:
                    open_count -= 1
                    if open_count == 0:
                        # We have a complete valid substring
                        left_to_right[i] = i - start + 1
                    else:
                        # We're inside a larger valid substring
                        left_to_right[i] = left_to_right[i-1] + 2
                else:
                    # Invalid closing parenthesis, reset the start
                    start = i + 1
        
        # Second pass: right to left
        right_to_left = [0] * len(s)
        close_count = 0
        end = len(s) - 1
        for i in range(len(s) - 1, -1, -1):
            if s[i] == ')':
                close_count += 1
            elif s[i] == '(':
                if close_count > 0:
                    close_count -= 1
                    if close_count == 0:
                        # We have a complete valid substring
                        right_to_left[i] = end - i + 1
                    else:
                        # We're inside a larger valid substring
                        right_to_left[i] = right_to_left[i+1] + 2
                else:
                    # Invalid opening parenthesis, reset the end
                    end = i - 1
        
        # Find the maximum length
        max_length = 0
        for i in range(len(s)):
            max_length = max(max_length, left_to_right[i], right_to_left[i])
        
        return max_length

# Test cases for longest valid parentheses

solution = Solution1()

# Test case 1: Basic valid parentheses
print(solution.longestValidParentheses("(())"))

# Test case 2: Mixed valid and invalid parentheses
print(solution.longestValidParentheses(")()())"))

# Test case 3: Empty string
print(solution.longestValidParentheses(""))

# Test case 4: Complex mixed case
print(solution.longestValidParentheses("())((()))(())("))



"""
Problem Statement:
    Given a string containing just the characters '(' and ')', return the length of the longest 
    valid (well-formed) parentheses substring.

Explanation:
    1. First Pass (Left to Right):
        - Initialize two counters: l_count for '(' and r_count for ')'.
        - Iterate through the string from left to right.
        - Update counters based on the current character.
        - If counters are equal, update max_len.
        - If r_count > l_count, reset both counters.

    2. Second Pass (Right to Left):
        - Reset both counters.
        - Iterate through the string from right to left.
        - Update counters based on the current character.
        - If counters are equal, update max_len.
        - If l_count > r_count, reset both counters.

    3. Result:
        - Return the maximum length found.

Key Points:
    1. Two-pass approach allows us to handle cases where the longest valid substring is in the middle.
    2. We don't need a stack or additional arrays, making it space-efficient.
    3. The solution can identify valid substrings that are not necessarily at the start or end of the string.

Time Complexity: O(n), where n is the length of the input string.
                We make two passes through the string.

Space Complexity: O(1), as we only use a constant amount of extra space.
"""

class Solution2:
    def longestValidParentheses(self, s: str) -> int:
        l_count = r_count = max_len = 0
        
        # Forward pass
        i = 0
        while i < len(s):
            if s[i] == '(':
                l_count += 1
            else:
                r_count += 1
            
            if l_count == r_count:
                max_len = max(max_len, l_count + r_count)
            elif r_count > l_count:
                l_count = r_count = 0
            
            i += 1
        
        # Reset counters
        l_count = r_count = 0
        
        # Backward pass
        i = len(s) - 1
        while i >= 0:
            if s[i] == '(':
                l_count += 1
            else:
                r_count += 1
            
            if l_count == r_count:
                max_len = max(max_len, l_count + r_count)
            elif l_count > r_count:
                l_count = r_count = 0
            
            i -= 1
        
        return max_len

# Test cases
solution = Solution2()

print(solution.longestValidParentheses("(())"))

# Test case 2: Mixed valid and invalid parentheses
print(solution.longestValidParentheses(")()())"))

# Test case 3: Empty string
print(solution.longestValidParentheses(""))

# Test case 4: Complex mixed case
print(solution.longestValidParentheses("())((()))(())("))
