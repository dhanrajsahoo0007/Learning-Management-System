"""
Problem Statement:
    Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.
    A mapping of digits to letters (just like on the telephone buttons) is given below.
    Note that 1 does not map to any letters.

    2 -> abc
    3 -> def
    4 -> ghi
    5 -> jkl
    6 -> mno
    7 -> pqrs
    8 -> tuv
    9 -> wxyz

Time Complexity: O(4^n * n), where n is the number of digits in the input.
    - In the worst case (when the input consists of 7s and 9s), each digit can map to 4 letters.
    - The depth of the recursion tree is n.
    - At each step, we're doing O(1) work and potentially adding a combination of length n to our result.

Space Complexity: O(n), where n is the number of digits in the input.
    - The space used by the output array doesn't count towards space complexity.
    - The recursion stack can go up to n levels deep.
    - We're also using a path array of at most length n.

Explanation:
    1. We start with an empty path and recursively build up the combinations by adding
    2. one letter at a time for each digit. When we've processed all digits, we add the
    3. current combination to our result. Then we backtrack by removing the last letter
       and try the next possibility.

Examples:
    Input: digits = "23"
    Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Input: digits = ""
    Output: []

Input: digits = "2"
    Output: ["a","b","c"]
"""

from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        # If the input is empty, immediately return an empty answer array
        if len(digits) == 0:
            return []
        
        # Map all the digits to their corresponding letters
        letters = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "pqrs",
            "8": "tuv",
            "9": "wxyz",
        }
        
        def backtrack(index, path):
            # If the path is the same length as digits, we have a complete combination
            if len(path) == len(digits):
                combinations.append("".join(path))
                return  # Backtrack
            
            # Get the letters that the current digit maps to, and loop through them
            possible_letters = letters[digits[index]]
            for letter in possible_letters:
                # Add the letter to our current path
                path.append(letter)
                # Move on to the next digit
                backtrack(index + 1, path)
                # Backtrack by removing the letter before moving onto the next
                path.pop()
        
        # Initialize the output array
        combinations = []
        # Start the backtracking with an empty path and index 0
        backtrack(0, [])
        return combinations

# Example usage
solution = Solution()

# Test cases
print(solution.letterCombinations("23"))  # ["ad","ae","af","bd","be","bf","cd","ce","cf"]
print(solution.letterCombinations(""))    # []
print(solution.letterCombinations("2"))   # ["a","b","c"]
