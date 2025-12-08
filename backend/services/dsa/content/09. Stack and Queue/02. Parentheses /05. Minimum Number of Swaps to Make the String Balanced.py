"""
Problem: Minimum Number of Swaps to Make the String Balanced

You are given a 0-indexed string s of even length n. The string consists of exactly n / 2 opening brackets '[' and n / 2 closing brackets ']'.

A string is called balanced if and only if:
    * It is the empty string, or
    * It can be written as AB, where both A and B are balanced strings, or
    * It can be written as [C], where C is a balanced string.

You may swap the brackets at any two indices any number of times.

Return the minimum number of swaps to make s balanced.

Example 1:
    Input: s = "][]["
    Output: 1
    Explanation: You can make the string balanced by swapping index 0 with index 3.
        The resulting string is "[[]]".

Example 2:
    Input: s = "]]][[["
    Output: 2
    Explanation: You can do the following to make the string balanced:
        - Swap index 0 with index 4. s = "[]][][".
        - Swap index 1 with index 5. s = "[[][]]".
    The resulting string is "[[][]]".

Example 3:
    Input: s = "[]"
    Output: 0
    Explanation: The string is already balanced.

Constraints:
    * n == s.length
    * 2 <= n <= 10^6
    * n is even.
    * s[i] is either '[' or ']'.
    * The number of opening brackets '[' equals n / 2, and the number of closing brackets ']' equals n / 2.

Time Complexity: O(n), where n is the length of the input string.
Space Complexity: O(1), as we only use a constant amount of extra space.

Explanation of the solution:

    1. We iterate through the string once, keeping track of two variables:
        - unbalanced: the current count of unbalanced brackets (positive for excess ']', negative for excess '[')
        - max_unbalanced: the maximum number of unbalanced closing brackets at any point

    2. For each bracket in the string:
        - If it's a closing bracket ']', we increment unbalanced and update max_unbalanced if necessary.
        - If it's an opening bracket '[', we decrement unbalanced.

    3. The key insight is that we need to swap ceil(max_unbalanced / 2) pairs of brackets to balance the string.
        - This is because each swap can fix two unbalanced brackets.

    4. We return (max_unbalanced + 1) // 2, which is equivalent to ceil(max_unbalanced / 2) in integer division.

Why this works:
    - The max_unbalanced value represents the maximum depth of nested unbalanced closing brackets.
    - Each swap can potentially fix two unbalanced brackets (one '[' and one ']').
    - Therefore, we need to perform swaps for half of the max_unbalanced value (rounded up).

Note: This solution works because we're guaranteed that the number of '[' and ']' are equal and the string length is even. 
These constraints ensure that it's always possible to balance the string with swaps.

"""

class Solution:
    def minSwaps(self, s: str) -> int:
        unbalanced = 0
        max_unbalanced = 0
        
        for bracket in s:
            if bracket == ']':
                unbalanced += 1
                max_unbalanced = max(max_unbalanced, unbalanced)
            else:  # bracket == '['
                unbalanced -= 1
        
        # The minimum number of swaps is ceil(max_unbalanced / 2)
        return (max_unbalanced + 1) // 2

# Test cases
solution = Solution()

# Test case 1
print(solution.minSwaps("][[]"))  # Expected: 1

# Test case 3
print(solution.minSwaps("[]"))  # Expected: 0

# Test case 4
print(solution.minSwaps("[[[]]]][]["))  # Expected: 2

# Test case 5
print(solution.minSwaps("][[][]]["))  # Expected: 2
