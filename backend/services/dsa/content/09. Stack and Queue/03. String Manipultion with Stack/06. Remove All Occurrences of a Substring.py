"""
Problem Statement: Remove All Occurrences of a Substring
    Given two strings s and part, repeatedly remove all occurrences of part in s until it's not possible to do so. Return s after all such removals.

Example 1:
    Input: s = "daabcbaabcbc", part = "abc"
    Output: "dab"
Example 2:
    Input: s = "axxxxyyyyb", part = "xy"
    Output: "ab"

Constraints:
    * 1 <= s.length <= 1000
    * 1 <= part.length <= 1000
    * s and part consists of lowercase English letters.

Time Complexity: O(n * m), where n is the length of s and m is the length of part.
Space Complexity: O(n), where n is the length of s.


Explanation of the algorithm:
    1. We use a stack-like approach to efficiently remove all occurrences of 'part' from 's'.
    2. We iterate through each character of 's', adding it to result_stack.
    3. After adding each character, we check if the last part_length characters in result_stack match the 'part' string.
    4. If there's a match, we remove the last part_length characters from result_stack.
    5. This process continues until we've processed all characters in 's'.
    6. Finally, we join the remaining characters in result_stack to form the result string.

"""
class Solution:
    def removeOccurrences(self, s: str, part: str) -> str:
        # Initialize a list to act as a stack for building the result string
        result_stack = []
        part_length = len(part)
        
        # Iterate through each character in the input string
        for char in s:
            # Add the current character to the stack
            result_stack.append(char)
            
            # Check if the last part_length characters in the stack match the part string
            if len(result_stack) >= part_length and ''.join(result_stack[-part_length:]) == part:
                # If there's a match, remove the last part_length characters from the stack
                for _ in range(part_length):
                    result_stack.pop()
        
        # Join the remaining characters in the stack to form the final string
        return ''.join(result_stack)



if __name__ == "__main__":
    solution = Solution()
    
    s1, part1 = "daabcbaabcbc", "abc"
    result = solution.removeOccurrences(s1, part1)
    print(f"Input: s = '{s1}', part = '{part1}', Output: '{result}'")
    
    s2, part2 = "axxxxyyyyb", "xy"
    result = solution.removeOccurrences(s2, part2)
    print(f"Input: s = '{s2}', part = '{part2}', Output: '{result}'")
    
    s3, part3 = "aabababa", "aba"
    result = solution.removeOccurrences(s3, part3)
    print(f"Input: s = '{s3}', part = '{part3}', Output: '{result}'")
    
    s4, part4 = "aaa", "aa"
    result = solution.removeOccurrences(s4, part4)
    print(f"Input: s = '{s4}', part = '{part4}', Output: '{result}'")