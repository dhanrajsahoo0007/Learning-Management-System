"""
Problem Statement: Maximum Score From Removing Substrings
    You are given a string s and two integers x and y. You can perform two types of operations any number of times.
        * Remove substring "ab" and gain x points.
        * Remove substring "ba" and gain y points.
    Return the maximum points you can gain after applying the above operations on s.

Example 1:
    Input: s = "cdbcbbaaabab", x = 4, y = 5
    Output: 19
    Explanation:
    - Remove the "ba" underlined in "cdbcbbaaabab". Now, s = "cdbcbbaaab" and 5 points are added to the score.
    - Remove the "ab" underlined in "cdbcbbaaab". Now, s = "cdbcbbaa" and 4 points are added to the score.
    - Remove the "ba" underlined in "cdbcbbaa". Now, s = "cdbcba" and 5 points are added to the score.
    - Remove the "ba" underlined in "cdbcba". Now, s = "cdbc" and 5 points are added to the score.
    Total score = 5 + 4 + 5 + 5 = 19.

Example 2:
    Input: s = "aabbaaxybbaabb", x = 5, y = 4
    Output: 20

Constraints:
    * 1 <= s.length <= 10^5
    * 1 <= x, y <= 10^4
    * s consists of lowercase English letters.

Approach:
    1. We use a greedy approach, always removing the substring that gives more points first.
    2. We utilize a stack to efficiently process the string and handle overlapping substrings.
    3. We make two passes through the string:
        - First pass: Remove the higher-scoring substring
        - Second pass: Remove the lower-scoring substring
    4. This ensures we maximize our score by prioritizing the more valuable removals.

Time Complexity: O(n), where n is the length of the string
- We make two passes through the string, each taking O(n) time.

Space Complexity: O(n)
- In the worst case, we might need to store the entire string in the stack.

Explanation:

The greedy approach works because:
   - Removing the higher-scoring substring first never decreases our ability to remove the lower-scoring substring later.
   - Any overlapping substrings are handled optimally by always removing from left to right.

"""

class Solution:
    def maximumGain(self, s: str, x: int, y: int) -> int:
        def remove_substring(s: str, first: str, second: str, points: int) -> (str, int):
            stack = []
            score = 0
            for char in s:
                if stack and stack[-1] == first and char == second:
                    stack.pop()
                    score += points
                else:
                    stack.append(char)
            return ''.join(stack), score

        # Determine which substring to remove first based on points
        if x > y:
            first, second = 'a', 'b'
            first_points, second_points = x, y
        else:
            first, second = 'b', 'a'
            first_points, second_points = y, x

        # First pass: remove the substring with higher points
        s, score1 = remove_substring(s, first, second, first_points)

        # Second pass: remove the other substring
        s, score2 = remove_substring(s, second, first, second_points)

        return score1 + score2

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    test_cases = [
        ("cdbcbbaaabab", 4, 5),
        ("aabbaaxybbaabb", 5, 4),
        ("aabbab", 3, 4),
        ("aaaaabbbbb", 4, 5)
    ]

    for i, (s, x, y) in enumerate(test_cases, 1):
        result = solution.maximumGain(s, x, y)
        print(f"Test case {i}:")
        print(f"Input: s = '{s}', x = {x}, y = {y}")
        print(f"Output: {result}")
        print()