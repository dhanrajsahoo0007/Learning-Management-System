"""
Problem: Decode String

Given an encoded string, return its decoded string.
The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times.
Note that k is guaranteed to be a positive integer.

Example 1:
Input: s = "3[a]2[bc]"
Output: "aaabcbc"

Example 2:
Input: s = "3[a2[c]]"
Output: "accaccacc"

Example 3:
Input: s = "2[abc]3[cd]ef"
Output: "abcabccdcdcdef"

Constraints:
* 1 <= s.length <= 30
* s consists of lowercase English letters, digits, and square brackets '[]'.
* s is guaranteed to be a valid input.
* All the integers in s are in the range [1, 300].

Approach:
1. We use a single stack to handle both numbers and strings.
2. We iterate through the string character by character:
   - If the character is not ']', we push it onto the stack.
   - If we encounter ']', we start decoding:
     a. We pop characters until we find '[', building the substring to be repeated.
     b. We pop digits to build the multiplier.
     c. We multiply the substring and push it back onto the stack.
3. At the end, we join all elements in the stack to get the final decoded string.

Time Complexity: O(n), where n is the length of the decoded string.
Space Complexity: O(m), where m is the length of the encoded string (for the stack).
"""

class Solution:
    def decodeString(self, s: str) -> str:
        # Initialize the stack to store characters, numbers, and partially decoded strings
        stack = []

        # Iterate through each character in the input string
        for char in s:
            if char != "]":
                # If the character is not ']', push it onto the stack
                stack.append(char)
            else:
                # If we encounter ']', start decoding the most recent encoded part
                sub_str = ""
                while stack[-1] != "[":
                    # Pop characters from the stack and prepend to sub_str until we find '['
                    sub_str = stack.pop() + sub_str
                # Remove the '[' from the stack
                stack.pop()

                # Extract the multiplier (number before '[')
                multiplier = ""
                ## Running a while loop in case the string has multiple numbers example 54[ab]
                while stack and stack[-1].isdigit():
                    # Pop digits and prepend to multiplier
                    multiplier = stack.pop() + multiplier

                # Multiply the sub_str by the multiplier and push back onto the stack
                ## 2[[ab]3[b]] - > 2[abbbb] - > abbbbabbbb
                # as it is an recursive operation we need to keep on appending into the stack 
                stack.append(int(multiplier) * sub_str)

        # Join all elements in the stack to get the final decoded string
        return "".join(stack)

# Test the solution
if __name__ == "__main__":
    solution = Solution()
    
    test_cases = [
        "3[a]2[bc]",
        "3[a2[c]]",
        "2[abc]3[cd]ef",
        "abc3[cd]xyz",
        "10[a]",
        "2[3[a]b]"
    ]
    
    for i, s in enumerate(test_cases, 1):
        result = solution.decodeString(s)
        print(f"Test case {i}:")
        print(f"Input: s = '{s}'")
        print(f"Output: '{result}'")
        print()