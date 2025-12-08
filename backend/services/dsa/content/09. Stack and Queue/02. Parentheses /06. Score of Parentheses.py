"""
Problem: Score of Parentheses

Given a balanced parentheses string s, return the score of the string.

The score of a balanced parentheses string is based on the following rule:
    * "()" has score 1.
    * AB has score A + B, where A and B are balanced parentheses strings.
    * (A) has score 2 * A, where A is a balanced parentheses string.

Example 1:
    Input: s = "()"
    Output: 1

Example 2:
    Input: s = "(())"
    Output: 2

Example 3:
    Input: s = "()()"
    Output: 2

Constraints:
    * 2 <= s.length <= 50
    * s consists of only '(' and ')'.
    * s is a balanced parentheses string.
    
Explanation of the solution:

    1. We use a stack to keep track of the scores at different levels of nesting.

    2. We iterate through the string:
        - When we encounter an opening parenthesis '(', we push a 0 onto the stack to represent a new level of nesting.
        - When we encounter a closing parenthesis ')', we pop the top score from the stack:
            * If the popped score is 0, it means we've encountered a "()" pair, so we add 1 to the score of the current level.
            * If the popped score is non-zero, it means we're closing a nested structure, so we double the score and add it to the current level.

    3. At the end, the score at the base of the stack (stack[0]) is our final result.

Why this works:
    - The stack helps us manage nested structures efficiently.
    - We're effectively building the score from the innermost parentheses outward.
    - The doubling of scores when we close a nested structure (2 * score) handles the "(A)" rule.
    - Adding scores at the same level handles the "AB" rule.

Time Complexity: O(n), where n is the length of the input string, as we process each character once.
Space Complexity: O(n) in the worst case, where we might need to store all opening parentheses in the stack (e.g., for a string like "((((....))))").

"""

class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        stack = [0]  # Start with a base score of 0
        
        for char in s:
            if char == '(':
                stack.append(0)  # New depth level, start with score 0
            else:  # char == ')'
                score = stack.pop()
                if score == 0:
                    stack[-1] += 1  # Case of "()"
                else:
                    stack[-1] += 2 * score  # Case of "(A)"
        
        return stack[0]  # The final score will be at the base of the stack

# Test cases
solution = Solution()

# Test case 1
print(solution.scoreOfParentheses("()"))  # Expected: 1

# Test case 4
print(solution.scoreOfParentheses("(()(()))"))  # Expected: 6

# Test case 5
print(solution.scoreOfParentheses("(()())()"))  # Expected: 5
