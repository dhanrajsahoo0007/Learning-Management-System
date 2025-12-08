"""
The Celebrity Problem

    A celebrity is a person who is known to all but does not know anyone at a party.
    Given a square matrix mat where mat[i][j] = 1 if person i knows person j, and 0 otherwise,
    find the celebrity in the party. If there is no celebrity, return -1.

Example 1:
    Input: mat =    [[0, 1, 0],
                    [0, 0, 0], 
                    [0, 1, 0]]
    Output: 1
    Explanation: Person 1 is known by 0 and 2, but doesn't know anyone. Thus, 1 is the celebrity.

Example 2:
    Input: mat =    [[0, 1],
                    [1, 0]]
    Output: -1
    Explanation: Both people know each other. There's no celebrity.

Constraints:
    1 <= mat.size() <= 3000
    0 <= mat[i][j] <= 1

Time Complexity: O(n), where n is the number of people
Space Complexity: O(1)
"""


class Solution:
    def celebrity(self, mat):
        n = len(mat)
        
        # Step 1: Find a row with all 0s (potential celebrity)
        # Explanation: A celebrity doesn't know anyone, so their row in the matrix should be all 0s.
        potential_celeb = -1
        for person in range(n):
            if sum(mat[person]) == 0:
                potential_celeb = person
                break
        
        # Step 2: If no potential celebrity found, return -1
        # Explanation: If we didn't find a row of all 0s, there can't be a celebrity.
        if potential_celeb == -1:
            return -1
        
        # Step 3: Check if everyone knows the potential celebrity
        # Explanation: For a person to be a celebrity, everyone else must know them.
        # This means that in the potential celebrity's column, all values should be 1, except for the diagonal element(it self).
        for person in range(n):
            if person != potential_celeb and mat[person][potential_celeb] != 1:
                return -1
            
        return potential_celeb

# Test the solution
solution = Solution()

# Example 1
mat1 = [[0, 1, 0],
        [0, 0, 0], 
        [0, 1, 0]]
result1 = solution.celebrity(mat1)
print(f"Example 1: Input: {mat1}")
print(f"Output: {result1}")

# Example 2
mat2 = [[0, 1],
        [1, 0]]
result2 = solution.celebrity(mat2)
print(f"\nExample 2: Input: {mat2}")
print(f"Output: {result2}")