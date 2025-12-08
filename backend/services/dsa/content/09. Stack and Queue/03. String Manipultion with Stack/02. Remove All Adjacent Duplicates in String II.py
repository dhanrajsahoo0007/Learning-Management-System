"""
Problem Statement: Remove All Adjacent Duplicates in String II

    You are given a string s and an integer k. A k duplicate removal consists of choosing k adjacent and equal letters from s and removing them, 
    causing the left and the right side of the deleted substring to concatenate together.
    We repeatedly make k duplicate removals on s until we no longer can.

    Return the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique.

Example 1:
    Input: s = "abcd", k = 2
    Output: "abcd"
    Explanation: There's nothing to delete.

Example 2:
    Input: s = "deeedbbcccbdaa", k = 3
    Output: "aa"
    Explanation: 
    First delete "eee" and "ccc", get "ddbbbdaa"
    Then delete "bbb", get "dddaa"
    Finally delete "ddd", get "aa"

Example 3:
    Input: s = "pbbcggttciiippooaais", k = 2
    Output: "ps"

Constraints:
    * 1 <= s.length <= 10^5
    * 2 <= k <= 10^4
    * s only contains lowercase English letters.

Time Complexity: O(n), where n is the length of the input string.
    - We iterate through each character in the string once.
    
Space Complexity: O(n)
    - In the worst case, when no duplicates are removed, we store all characters in the stack.
    
Explanation of the solution:

    1. We use a stack to keep track of characters and their consecutive counts.
       Each element in the stack is a list [char, count].

    2. We iterate through each character in the input string:
        - If the stack is not empty and the current character is the same as the 
            character at the top of the stack, we increment its count.
        - If the count reaches k, we remove the top element from the stack.
        - If the current character is different from the top of the stack 
            (or the stack is empty), we push a new element [char, 1] onto the stack.

    3. After processing all characters, we build the final string by multiplying 
        each character in the stack by its count and joining them together.
"""

class Solution:
    def removeDuplicates(self, s: str, k: int) -> str:
        # Stack to store characters and their counts
        stack = []
        
        # Iterate through each character in the string
        for char in s:
            # If stack is not empty and current char is same as the top of the stack
            if stack and stack[-1][0] == char:
                # Increment the count of the char at the top of the stack
                stack[-1][1] += 1
                # If count reaches k, remove the top element
                if stack[-1][1] == k:
                    stack.pop()
            else:
                # Push new character with count 1
                stack.append([char, 1])
        
        # Build the final string
        result = []
        for char, count in stack:
            result.append(char * count)
        
        # Join all characters to form the final string
        return ''.join(result)

# Test cases
solution = Solution()

# Test case 1: No duplicates to remove
print(solution.removeDuplicates("abcd", 2))  # Output: "abcd"

# Test case 2: Multiple rounds of removal
print(solution.removeDuplicates("deeedbbcccbdaa", 3))  # Output: "aa"

# Test case 3: Various pairs to remove
print(solution.removeDuplicates("pbbcggttciiippooaais", 2))  # Output: "ps"

# Additional test cases
# Test case 4: All characters form a single group to be removed
print(solution.removeDuplicates("aaaaaa", 3))  # Output: ""

# Test case 5: Mixed scenarios with single and double character removals
print(solution.removeDuplicates("aaabbbcccddd", 3))  # Output: "abcd"
