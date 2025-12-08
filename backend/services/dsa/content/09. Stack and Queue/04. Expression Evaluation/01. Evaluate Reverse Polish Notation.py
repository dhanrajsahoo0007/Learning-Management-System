"""
Problem Statement: Evaluate Reverse Polish Notation

    You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation.
    Evaluate the expression and return an integer that represents the value of the expression.

Note:
    - The valid operators are '+', '-', '*', and '/'.
    - Each operand may be an integer or another expression.
    - The division between two integers always truncates toward zero.
    - There will not be any division by zero.
    - The input represents a valid arithmetic expression in a reverse polish notation.
    - The answer and all the intermediate calculations can be represented in a 32-bit integer.

Examples:
1. Input: tokens = ["2","1","+","3","*"]
   Output: 9
   Explanation: ((2 + 1) * 3) = 9

2. Input: tokens = ["4","13","5","/","+"]
   Output: 6
   Explanation: (4 + (13 / 5)) = 6

3. Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
   Output: 22
   Explanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5 = 22

Explanation of the solution:

    1. We define a Solution class with the evalRPN method, which takes a list of tokens as input and returns the evaluated result as an integer.
    2. We use a stack (st) to keep track of operands and intermediate results.
    3. We iterate through each token in the input list:
    - If the token is an operator ('+', '-', '*', '/'):
        * Pop the top two elements from the stack (these are the operands).
        * Perform the operation.
        * Push the result back onto the stack.
    - If the token is a number:
        * Convert it to an integer and push it onto the stack.
    4. After processing all tokens, the final result will be the only element left in the stack.

Time Complexity: O(n), where n is the number of tokens. 
                - We iterate through each token once.

Space Complexity: O(n) in the worst case.
                - In the worst case (e.g., all numbers and no operators), we might store all tokens in the stack.

"""

from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        st = []
        for char in tokens:
            if char == "+":
                second, first = st.pop(), st.pop()
                st.append(first + second)
            elif char == "-":
                second, first = st.pop(), st.pop()
                st.append(first - second)
            elif char == "/":
                second, first = st.pop(), st.pop()
                st.append(int(first / second))  # Using int() for truncation towards zero
            elif char == "*":
                second, first = st.pop(), st.pop()
                st.append(first * second)
            else:
                st.append(int(char))
        return st[0]

# Test cases
solution = Solution()
test_cases = [
    ["2","1","+","3","*"],
    ["4","13","5","/","+"],
    ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
]

for i, case in enumerate(test_cases, 1):
    result = solution.evalRPN(case)
    print(f"Test Case {i}:")
    print(f"Input: {case}")
    print(f"Output: {result}")
    print()