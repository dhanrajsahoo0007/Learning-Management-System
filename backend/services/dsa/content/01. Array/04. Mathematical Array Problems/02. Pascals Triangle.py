"""
Generate the first numRows of Pascal's Triangle.

Visual representation of Pascal's Triangle (first 5 rows):

                1
               1 1
              1 2 1
             1 3 3 1
            1 4 6 4 1

Each number is the sum of the two numbers directly above it. For example:
   3 (in row 4) = 1 + 2 (the two numbers above it in row 3)
   4 (in row 5) = 1 + 3 (the two numbers above it in row 4)
   6 (in row 5) = 3 + 3 (the two numbers above it in row 4)

Example:
>>> solution = Solution()
>>> solution.generate(5)
[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]

Explanation of the solution:

    1. We start by initializing the triangle with the first row, which is always [1].
    2. We then iterate numRows - 1 times to generate the remaining rows:
        - Each row starts and ends with 1.
        - For the middle elements, we sum the two numbers directly above it from the previous row.
    3. The key observation is that the jth element in the ith row (0-indexed) is the sum of the (j-1)th and jth elements from the (i-1)th row.
    4. We use this property to calculate each element: triangle[i-1][j-1] + triangle[i-1][j]
    5. After generating each row, we append it to our triangle list.
    6. Finally, we return the completed triangle.

Time Complexity: O(numRows^2)
    - We have two nested loops: the outer loop runs numRows times, and the inner loop runs up to numRows times.
    - In total, we're doing 1 + 2 + 3 + ... + numRows operations, which sums to numRows * (numRows + 1) / 2.

Space Complexity: O(numRows^2)
    ng all elements of the triangle, which total to the same sum as above.

This visual representation helps to understand the structure and properties of Pascal's Triangle,
which our code implements programmatically.
"""

from typing import List
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
       
        # Initialize the triangle with the first row
        triangle = [[1]]
        
        # Generate each row starting from the second row
        for i in range(1, numRows):
            # Start and end each row with 1
            row = [1]
            
            # Calculate the middle elements of the row
            for j in range(1, i):
                # Each element is the sum of the two elements above it
                row.append(triangle[i-1][j-1] + triangle[i-1][j])
            
            # End the row with 1
            row.append(1)
            
            # Add the completed row to the triangle
            triangle.append(row)
        
        return triangle

# Test cases
solution = Solution()
print(solution.generate(5))  # Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
print(solution.generate(1))  # Output: [[1]]

