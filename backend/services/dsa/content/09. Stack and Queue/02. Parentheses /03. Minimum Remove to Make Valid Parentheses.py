"""
Problem Statement:
Given a string s of '(' , ')' and lowercase English characters.

Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:
- It is the empty string, contains only lowercase characters, or
- It can be written as AB (A concatenated with B), where A and B are valid strings, or
- It can be written as (A), where A is a valid string.

Time Complexity: O(n) for all approaches, where n is the length of the input string.
Space Complexity: O(n) for all approaches, as we use additional data structures to store intermediate results.

Example Test Cases:
1. Input: s = "lee(t(c)o)de)"
   Output: "lee(t(c)o)de"
   Explanation: "lee(t(co)de)" , "lee(t(c)ode)" would also be accepted.

2. Input: s = "a)b(c)d"
   Output: "ab(c)d"

3. Input: s = "))(("
   Output: ""
   Explanation: An empty string is also valid.
"""

"""
Explanation:

1. Approach 1: Using Stack and Set
   - We use a stack to keep track of the indices of open parentheses and a set to store indices of characters to be removed.
   - We iterate through the string once, pushing indices of '(' onto the stack and popping when we encounter ')'. If we encounter ')' with an empty stack, we mark it for removal.
   - After the iteration, any remaining indices in the stack (unmatched open parentheses) are also marked for removal.
   - Finally, we build the result string by including only the characters whose indices are not in the removal set.

- Time Complexity: O(n), 
- Space Complexity: O(n),

"""
# Approach 1: Using Stack and Set
class Solution1:
    def minRemoveToMakeValid(self, s: str) -> str:
        n = len(s)
        
        to_remove = set()
        stack = []
        
        # First pass: identify indices to remove
        for i, char in enumerate(s):
            if char == '(':
                stack.append(i)
            elif char == ')':
                if not stack:
                    to_remove.add(i)
                else:
                    stack.pop()
        
        # Add remaining open parentheses indices to remove set
        to_remove.update(stack)
        
        # Second pass: build the result string
        # return ''.join(char for i, char in enumerate(s) if i not in to_remove)
        result = []
        for i, char in enumerate(s):
            if i not in to_remove:
                result.append(char)
        
        return ''.join(result)
        
    
"""
2. Approach 2: Two-pass Solution
   - In the first pass (left to right), we remove invalid closing parentheses by keeping track of the count of open parentheses.
   - In the second pass (right to left), we remove invalid opening parentheses by keeping track of the count of closing parentheses.
   - This approach ensures that we keep all valid parentheses and remove the minimum number of invalid ones.

- Time Complexity: O(n), 
- Space Complexity: O(n),

"""

# Approach 2: Two-pass Solution (Front to Back, then Back to Front)
class Solution2:
    def minRemoveToMakeValid(self, s: str) -> str:
        # First pass: remove invalid ')'
        first_pass = []
        open_count = 0
        for char in s:
            if char.isalpha():
                first_pass.append(char)
            elif char == '(':
                first_pass.append(char)
                open_count += 1
            elif open_count > 0:
                first_pass.append(char)
                open_count -= 1
        
        # Second pass: remove invalid '('
        result = []
        close_count = 0
        for char in reversed(first_pass):
            if char.isalpha():
                result.append(char)
            elif char == ')':
                result.append(char)
                close_count += 1
            elif close_count > 0:
                result.append(char)
                close_count -= 1
        
        return ''.join(reversed(result))

"""
3. Approach 3: Simplified One-pass Solution
   - We make a single pass through the string, removing invalid closing parentheses.
   - We keep track of the count of open parentheses.
   - In a second pass through the temporary result, we remove any extra opening parentheses from right to left.
   - This approach combines the ideas from the previous two approaches into a more streamlined solution.

All three approaches have the same time and space complexity:
- Time Complexity: O(n), where n is the length of the input string. We traverse the string a constant number of times.
- Space Complexity: O(n), as in the worst case, we might need to store the entire string in our temporary data structures.
"""
# Approach 3: Simplified One-pass Solution
class Solution3:
    def minRemoveToMakeValid(self, s: str) -> str:
        open_count = 0
        temp = []
        
        # First pass: remove invalid ')'
        for char in s:
            if char == '(':
                open_count += 1
                temp.append(char)
            elif char == ')':
                if open_count > 0:
                    open_count -= 1
                    temp.append(char)
            else:
                temp.append(char)
        
        # Second pass: remove extra '('
        result = []
        for char in reversed(temp):
            if char == '(' and open_count > 0:
                open_count -= 1
            else:
                result.append(char)
        
        return ''.join(reversed(result))


# Test cases for Solution 1
print("Test cases for Solution 1 (Stack and Set):")
solution1 = Solution1()

print(solution1.minRemoveToMakeValid("lee(t(c)o)de)"))  # Expected: "lee(t(c)o)de"
print(solution1.minRemoveToMakeValid("a)b(c)d"))        # Expected: "ab(c)d"

# Test cases for Solution 2
print("\nTest cases for Solution 2 (Two-pass):")
solution2 = Solution2()

print(solution2.minRemoveToMakeValid("lee(t(c)o)de)"))  # Expected: "lee(t(c)o)de"
print(solution2.minRemoveToMakeValid("a)b(c)d"))        # Expected: "ab(c)d"

# Test cases for Solution 3
print("\nTest cases for Solution 3 (Simplified One-pass):")
solution3 = Solution3()

print(solution3.minRemoveToMakeValid("lee(t(c)o)de)"))  # Expected: "lee(t(c)o)de"
print(solution3.minRemoveToMakeValid("a)b(c)d"))        # Expected: "ab(c)d"
