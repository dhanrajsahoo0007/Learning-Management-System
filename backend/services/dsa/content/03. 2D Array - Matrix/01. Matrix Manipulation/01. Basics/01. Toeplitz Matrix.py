"""
Problem Statement:
    Given an m x n matrix, return true if the matrix is Toeplitz. Otherwise, return false.
    A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same elements.

Time Complexity: O(m * n), where m is the number of rows and n is the number of columns in the matrix.
    We iterate through each element of the matrix once, except for the first row and first column.

Space Complexity: O(1), as we only use a constant amount of extra space regardless of the input size.

Explanation:
    A Toeplitz matrix has the property that each diagonal from top-left to bottom-right contains the same element.
    To check this, we compare each element with the one above and to the left of it.
    If all such pairs are equal, the matrix is Toeplitz.

Examples:
1. Input: matrix = [[1,2,3,4],
                    [5,1,2,3],
                    [9,5,1,2]]
   Output: true
   Explanation: The diagonals are:
   "[9]", "[5,5]", "[1,1,1]", "[2,2,2]", "[3,3]", "[4]"
   All elements in each diagonal are the same, so the matrix is Toeplitz.

2. Input: matrix = [[1,2],
                    [2,2]]
   Output: false
   Explanation: The diagonal "[1,2]" has different elements, so the matrix is not Toeplitz.
"""

class Solution:
    def isToeplitzMatrix(self, matrix: list[list[int]]) -> bool:
        # Get the dimensions of the matrix
        m = len(matrix)
        n = len(matrix[0])
        
        # Iterate through the matrix, ignore the 1th row and 1th column as it don't have any previous diagonal 
        # starting from the second row and second column
        for i in range(1, m):
            for j in range(1, n):
                # Check if the current element is equal to the element diagonally up and to the left
                if matrix[i][j] != matrix[i-1][j-1]:
                    # If not equal, it's not a Toeplitz matrix
                    return False
        
        # If we've made it through all checks, it is a Toeplitz matrix
        return True

# Example usage and testing
if __name__ == "__main__":
    solution = Solution()

    # Test case 1: Toeplitz matrix
    matrix1 = [
        [1,2,3,4],
        [5,1,2,3],
        [9,5,1,2]
    ]
    result1 = solution.isToeplitzMatrix(matrix1)
    print("Test case 1:")
    print("Matrix:")
    for row in matrix1:
        print(row)
    print("Is Toeplitz?", result1)
    print()

    # Test case 2: Not a Toeplitz matrix
    matrix2 = [
        [1,2],
        [2,2]
    ]
    result2 = solution.isToeplitzMatrix(matrix2)
    print("Test case 2:")
    print("Matrix:")
    for row in matrix2:
        print(row)
    print("Is Toeplitz?", result2)
    print()
