"""
Problem: Reverse Substrings Between Each Pair of Parentheses

        We need to reverse the substrings within each pair of parentheses, starting from the innermost pair.
        The final result should not contain any parentheses.

Approach:
    1. Use a stack to keep track of the indices of opening parentheses.
    2. When we encounter an opening parenthesis '(', push its index onto the stack.
    3. When we encounter a closing parenthesis ')', pop the last opening parenthesis index from the stack.
    4. Reverse the substring between these two indices.
    5. Repeat until all parentheses are processed.
    6. Remove all parentheses from the final string.

Time Complexity: O(n^2), where n is the length of the string.
                 In the worst case, we might need to reverse the entire string multiple times.
Space Complexity: O(n) for the stack and the result string.
"""

class BruteForceSolution:
    def reverseParentheses(self, s: str) -> str:
        # Convert the input string to a list for easier in-place modifications
        result = list(s)
        
        # Stack to store indices of opening parentheses
        stack = []
        
        for i, char in enumerate(s):
            if char == '(':
                # If we encounter an opening parenthesis, push its index to the stack
                stack.append(i)
            elif char == ')':
                if stack:
                    # If we encounter a closing parenthesis and the stack is not empty,
                    # pop the last opening parenthesis index
                    start = stack.pop()
                    # Reverse the substring between the opening and closing parentheses
                    result[start:i+1] = result[start:i+1][::-1]
        
        # Remove all parentheses and join the characters to form the final string
        return ''.join(char for char in result if char not in '()')

# Test cases
solution = BruteForceSolution()

# Example 1: Nested parentheses
print(solution.reverseParentheses("(u(love)i)"))  # Expected: "iloveu"

# Example 2: Multiple nested parentheses
print(solution.reverseParentheses("(ed(et(oc))el)"))  # Expected: "leetcode"


"""
Problem: Reverse Substrings Between Each Pair of Parentheses

Approach-2 (Linear Approach):
1. First pass: Pair up parentheses using a stack and an array.
2. Second pass: Build the result string by traversing the original string,
   changing direction when encountering parentheses.

Detailed Explanation (Linear Approach):
1. First pass: Pair up parentheses using a stack and an array.
   - Use a stack to keep track of indices of opening parentheses.
   - Use an array 'door' to store paired parentheses indices.
   - When we find an opening parenthesis '(', push its index onto the stack.
   - When we find a closing parenthesis ')', pop the last opening parenthesis index.
   - Create a "door" between the paired parentheses in the 'door' array.

2. Second pass: Build the result string by traversing the original string,
   changing direction when encountering parentheses.
   - Use a 'direction' variable (1 for forward, -1 for backward) to track traversal direction.
   - Start from the beginning of the string and move forward.
   - When we encounter a parenthesis:
     a. Jump to its paired parenthesis using the 'door' array.
     b. Reverse the direction of traversal.
   - When we encounter a regular character, add it to the result.
   - After each step, move to the next (or previous) character based on current direction.

Key Insights:
    - We don't actually reverse any substrings. Instead, we simulate the reversal by
        changing our traversal direction when we encounter parentheses.
    - The use of the 'door' array allows us to quickly jump between paired parentheses,
        effectively "teleporting" through the nested structure of the parentheses.

Time Complexity: O(n), where n is the length of the string.
                 We make two passes through the string, each taking linear time.

Space Complexity: O(n) for the stack and the door array.
                  In the worst case, the stack could hold half of the string's characters.

"""

class OptimizedSolution:
    def reverseParentheses(self, s: str) -> str:
        n = len(s)
        open_bracket_stack = []
        door = [0] * n  # Array to store paired parentheses indices
        
        # First pass: Pair up parentheses
        for i in range(n):
            if s[i] == '(':
                open_bracket_stack.append(i)
            elif s[i] == ')':
                j = open_bracket_stack.pop()
                # Two way mapping
                door[i] = j
                door[j] = i
        
        # Second pass: Build the result string
        result = []
        direction = 1  # 1 for left to right, -1 for right to left
        i = 0
        
        while i < n:
            if s[i] == '(' or s[i] == ')':
                # When we encounter a parenthesis, jump to its pair and reverse direction
                i = door[i]
                direction = -direction
            else:
                # Add the current character to the result
                result.append(s[i])
            i += direction
        
        return ''.join(result)

# Test cases
solution = OptimizedSolution()

# Example 1
print(solution.reverseParentheses("(u(love)i)"))  # Expected: "iloveu"

# Example 2
print(solution.reverseParentheses("(ed(et(oc))el)"))  # Expected: "leetcode"

