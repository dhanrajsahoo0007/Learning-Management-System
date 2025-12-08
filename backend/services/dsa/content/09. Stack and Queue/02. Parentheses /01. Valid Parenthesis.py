"""
Problem Statement:
    Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
    determine if the input string is valid.

"""

class Solution:
    def isValid(self, s: str) -> bool:
        pair = {"{": "}",
                "[": "]",
                "(": ")"}

        stack = []
        for char in s:
            ## check for the open parenthesis and add in to the stack 
            if char in "{[(":
                stack.append(char)
            else:
            ## check fot the close parenthesis 
                # If stack is empty then the open parenthesis doesn't exist so return False            
                if not stack:
                    return False 
                # if the stack top in the open parenthesis pair then pop that 
                ## By this time all the other parenthesis will be closed 
                if char in "}])" and pair[stack[-1]] == char:
                    stack.pop()
                else:
                # else open parenthesis not found then return False 
                    return False 
        return len(stack) == 0 

# Example usage
solution = Solution()
print(solution.isValid("()"))        # True
print(solution.isValid("()[]{}"))    # True
print(solution.isValid("(]"))        # False
print(solution.isValid("([])"))      # True
print(solution.isValid("{[]}"))      # True
print(solution.isValid(""))          # True
print(solution.isValid("]"))         # False