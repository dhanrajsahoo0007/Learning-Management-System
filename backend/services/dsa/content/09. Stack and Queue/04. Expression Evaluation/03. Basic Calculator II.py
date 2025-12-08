"""
Problem Statement: Basic Calculator II
    Implement a basic calculator to evaluate a simple expression string.
    The expression string may contain open ( and closing parentheses ), the plus + or minus sign -, non-negative integers and empty spaces.

Example 1:
    Input: "1 + 1"
    Output: 2

Example 2:
    Input: " 2-1 + 2 "
    Output: 3

Example 3:
    Input: "(1+(4+5+2)-3)+(6+8)"
    Output: 23

Note: You may assume that the given expression is always valid.

Time Complexity: O(n), where n is the length of the input string.
    - We iterate through each character in the string once.
    
Space Complexity: O(n)
    - In the worst case, we might push all numbers onto the stack (e.g., in a string like "1+2+3+4+5").

Explanation:
    1. Initialization:
        - We initialize variables to keep track of the current number (curr_num), 
          the previous operator (prev_op), and a stack to store intermediate results.

    2. Iteration:
        iterate through each character in the input string.

    3. Number Building:
        - If the character is a digit, we build the current number (curr_num) by 
            multiplying the existing value by 10 and adding the new digit.

    4. Operation Processing:
        - When we encounter a non-digit character (operator or space) or reach the end of the string,
            we process the operation based on the previous operator:
            a. For '+': We push the current number onto the stack.
            b. For '-': We push the negation of the current number onto the stack.
            c. For '*': We pop the last number from the stack, multiply it with the current number,
                        and push the result back.
            d. For '/': We pop the last number from the stack, divide it by the current number
                        (using integer division), and push the result back.

    5. Operator Update:
        - After processing an operation, we update the previous operator (prev_op) to the current character
        and reset the current number (curr_num) to 0.

    6. Final Calculation:
        - After processing all characters, we sum up all the numbers in the stack to get the final result.

Note: This implementation doesn't handle parentheses or unary operators. It assumes all numbers are non-negative and the expression is valid.
"""

class Solution:
    def calculate(self, s: str) -> int:
        n = len(s)
        
        curr_num = 0  # Variable to build the current number
        prev_op = '+'  # Variable to store the previous operator
        stack = []  # Stack to store intermediate results
        
        for i in range(n):
            # Step 3: Number Building
            if s[i].isdigit():
                curr_num = curr_num * 10 + int(s[i])
            
            # Step 4: Operation Processing
            # Process when we hit an operator or the end of the string
            if (not s[i].isdigit() and s[i] != ' ') or i == n - 1:
                if prev_op == '+':
                    stack.append(curr_num)  # Push positive number
                elif prev_op == '-':
                    stack.append(-curr_num)  # Push negated number
                elif prev_op == '/':
                    x = stack.pop()
                    # Use int() for floor division (Python 3 behavior)
                    stack.append(int(x / curr_num))
                elif prev_op == '*':
                    x = stack.pop()
                    stack.append(x * curr_num)
                
                # Step 5: Operator Update
                curr_num = 0  # Reset current number
                prev_op = s[i]  # Update previous operator
        
        # Step 6: Final Calculation
        return sum(stack)  # Sum up all numbers in the stack for the final result

# Test cases
solution = Solution()
print(solution.calculate("3+2*2"))  # Output: 7
print(solution.calculate(" 3/2 "))  # Output: 1
print(solution.calculate(" 3+5 / 2 "))  # Output: 5