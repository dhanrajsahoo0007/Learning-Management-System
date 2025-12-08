"""
Problem: Minimum Add to Make Parentheses Valid

    A parentheses string is valid if and only if:
        - It is the empty string,
        - It can be written as AB (A concatenated with B), where A and B are valid strings, or
        - It can be written as (A), where A is a valid string.

    You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.
    For example, if s = "()))", you can insert an opening parenthesis to be "(()))" or a closing parenthesis to be "())))".

    Return the minimum number of moves required to make s valid.

Example 1:
    Input: s = "())"
    Output: 1

Example 2:
    Input: s = "((("
    Output: 3

Constraints:
    1 <= s.length <= 1000
    s[i] is either '(' or ')'.

Explanation of the solution:

    1. We use two counters:
        - open_count: keeps track of unmatched opening parentheses
        - additions: counts the number of parentheses we need to add

    2. We iterate through the string once:
        - For each '(', we increment open_count
        - For each ')', we check:
            - If there's an unmatched '(' (open_count > 0), we decrement open_count
            - Otherwise, we need to add a '(', so we increment additions

    3. After the iteration:
        - additions represents the number of '(' we needed to add
        - open_count represents the number of ')' we need to add to close all parentheses

    4. The total minimum additions is the sum of additions and open_count


Time Complexity: O(n), where n is the length of the input string.
Space Complexity: O(1), as we only use a constant amount of extra space.
"""

class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        # Initialize counters
        open_count = 0  # Count of unmatched opening parentheses
        additions = 0   # Count of necessary additions

        # Iterate through the string
        for char in s:
            if char == '(':
                # Increment open_count for each opening parenthesis
                open_count += 1
            elif char == ')':
                if open_count > 0:
                    # Match a closing parenthesis with an open one
                    open_count -= 1
                else:
                    # No matching open parenthesis, need to add one
                    additions += 1

        # Any remaining unmatched open parentheses need closing
        return additions + open_count

# Test cases
solution = Solution()

# Test case 1
print(solution.minAddToMakeValid("())"))  # Expected: 1

# Test case 2
print(solution.minAddToMakeValid("((("))  # Expected: 3

# Test case 3
print(solution.minAddToMakeValid("()"))   # Expected: 0

"""
Problem: Minimum Add to Make Parentheses Valid (Return Valid String)

    A parentheses string is valid if and only if:
        - It is the empty string,
        - It can be written as AB (A concatenated with B), where A and B are valid strings, or
        - It can be written as (A), where A is a valid string.

    You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.
    For example, if s = "()))", you can insert an opening parenthesis to be "(()))" or a closing parenthesis to be "())))".

    Your task is to add the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid. 
    Return the resulting valid string.

Example 1:
    Input: s = "())"
    Output: "(())"

Example 2:
    Input: s = "((("
    Output: "((()))"

Constraints:
    1 <= s.length <= 1000
    s[i] is either '(' or ')'.

Explanation of the solution:

    1. We use a list 'result' to build our valid string and a counter 'open_count' to keep track of unmatched opening parentheses.

    2. First pass through the string:
        - For each '(', we increment open_count and add it to the result.
        - For each ')', we check:
            - If there's an unmatched '(' (open_count > 0), we decrement open_count and add the ')' to the result.
            - Otherwise, we need to add a '(' before this ')', so we add both to the result.

    3. After the first pass:
        - We've added all necessary opening parentheses.
        - open_count represents the number of closing parentheses we need to add.

    4. We add the remaining closing parentheses to the end of the result.

    5. Finally, we join the result list into a string and return it.

Time Complexity: O(n), where n is the length of the input string.
Space Complexity: O(n) to store the result string.
"""

class Solution:
    def minAddToMakeValid(self, s: str) -> str:
        result = []
        open_count = 0

        # First pass: add opening parentheses where needed and keep track of extras
        for char in s:
            if char == '(':
                open_count += 1
                result.append(char)
            elif char == ')':
                if open_count > 0:
                    open_count -= 1
                    result.append(char)
                else:
                    result.append('(')  # Add missing opening parenthesis
                    result.append(char)

        # Second pass: add closing parentheses for any remaining open ones
        result.extend(')' * open_count)

        return ''.join(result)

# Test cases
solution = Solution()

# Test case 1
print(solution.minAddToMakeValid("())"))  # Expected: "(())"

# Test case 2
print(solution.minAddToMakeValid("((("))  # Expected: "((()))"

# Test case 3
print(solution.minAddToMakeValid("()"))   # Expected: "()"

# Test case 4
print(solution.minAddToMakeValid("()))(("))  # Expected: "(())(())"

# Test case 5
print(solution.minAddToMakeValid("))"))   # Expected: "(())"


"""
Problem: Minimum Add to Make Parentheses Valid (With Mixed Characters)

    Given a string s which contains parentheses '(' and ')' along with other characters, add the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses in the string are valid.

    A string is valid if:
        - Every opening parenthesis '(' has a corresponding closing parenthesis ')'.
        - Every closing parenthesis ')' has a corresponding opening parenthesis '('.
        - The corresponding parentheses are also ordered correctly.

    Return the resulting valid string after adding the minimum number of parentheses.

Note: Do not modify any characters other than adding new parentheses.

Example 1:
    Input: s = "lee(t(c)o)de)"
    Output: "lee(t(c)o)de()"

Example 2:
    Input: s = "a)b(c)d"
    Output: "(a)b(c)d"

Example 3:
    Input: s = "))(("
    Output: "(())(())"

Constraints:
    1 <= s.length <= 1000
    s can contain any printable ASCII character.

Explanation of the solution:

    1. We use a list 'result' to build our valid string and a counter 'open_count' to keep track of unmatched opening parentheses.

    2. First pass through the string:
        - For each '(', we increment open_count and add it to the result.
        - For each ')', we check:
            - If there's an unmatched '(' (open_count > 0), we decrement open_count and add the ')' to the result.
            - Otherwise, we need to add a '(' before this ')', so we add both to the result.
        - For any other character, we simply append it to the result without modifying it.

    3. After the first pass:
        - We've added all necessary opening parentheses.
        - open_count represents the number of closing parentheses we need to add.

    4. We add the remaining closing parentheses to the end of the result.

    5. Finally, we join the result list into a string and return it.

Time Complexity: O(n), where n is the length of the input string.
Space Complexity: O(n) to store the result string.
"""

class Solution:
    def minAddToMakeValid(self, s: str) -> str:
        result = []
        open_count = 0
        
        # First pass: add opening parentheses where needed and keep track of extras
        for char in s:
            if char == '(':
                open_count += 1
                result.append(char)
            elif char == ')':
                if open_count > 0:
                    open_count -= 1
                    result.append(char)
                else:
                    result.append('(')  # Add missing opening parenthesis
                    result.append(char)
            else:
                result.append(char)  # Append non-parenthesis characters as is
        
        # Second pass: add closing parentheses for any remaining open ones
        result.extend(')' * open_count)
        
        return ''.join(result)

# Test cases
solution = Solution()

# Test case 1
print(solution.minAddToMakeValid("lee(t(c)o)de)"))  # Expected: "lee(t(c)o)de()"

# Test case 2
print(solution.minAddToMakeValid("a)b(c)d"))        # Expected: "(a)b(c)d"

# Test case 3
print(solution.minAddToMakeValid("))(("))           # Expected: "(())(())"


