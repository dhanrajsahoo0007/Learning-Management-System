"""
Problem Statement: Basic Calculator
    Implement a basic calculator to evaluate a simple expression string.
    The expression string may contain open ( and closing parentheses ), the plus + or minus sign -, non-negative integers and empty spaces.

Time Complexity: O(n), where n is the length of the input string.
    - We iterate through each character in the string once.
    
Space Complexity: O(n)
    - In the worst case, we might push all numbers onto the stack for deeply nested parentheses.

Explanation:
    1. Initialization:
        - Initialize variables for current number, result, sign, and a stack for handling parentheses.

    2. Iteration:
        - Iterate through each character in the input string.

    3. Number Building:
        - If the character is a digit, build the current number.

    4. Operation Processing:
        - For '+': Update result with the current number and reset for the next number.
        - For '-': Update result with the negative of the current number and reset.
        - For '(': Push current result and sign to stack, reset result and sign.
        - For ')': Compute result within parentheses and combine with previous result.

    5. Final Calculation:
        - After processing all characters, add the last number to the result.

Note: This implementation handles parentheses and unary minus operations.
"""

class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        curr_num = 0
        result = 0
        sign = 1  # 1 represents '+', -1 represents '-'
        
        for char in s:
            if char.isdigit():
                # Step 3: Number Building
                curr_num = curr_num * 10 + int(char)
            elif char in ['+', '-']:
                # Step 4: Operation Processing for '+' and '-'
                result += sign * curr_num
                curr_num = 0
                sign = 1 if char == '+' else -1
            elif char == '(':
                # Step 4: Operation Processing for '('
                stack.append(result)
                stack.append(sign)
                result = 0
                sign = 1
            elif char == ')':
                # Step 4: Operation Processing for ')'
                result += sign * curr_num
                result *= stack.pop()  # Pop the sign before the parenthesis
                result += stack.pop()  # Pop the result before the parenthesis
                curr_num = 0
        
        # Step 5: Final Calculation
        result += sign * curr_num
        return result

# Test cases
solution = Solution()
print(solution.calculate("1 + 1"))  # Output: 2
print(solution.calculate(" 2-1 + 2 "))  # Output: 3
print(solution.calculate("(1+(4+5+2)-3)+(6+8)"))  # Output: 23
print(solution.calculate("2-(5-6)"))  # Output: 3
print(solution.calculate("- (3 + (4 + 5))"))  # Output: -12