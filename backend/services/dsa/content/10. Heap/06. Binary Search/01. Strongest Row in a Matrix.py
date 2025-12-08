"""
Problem Statement: Strongest Row in a Matrix
    Given an m x n binary matrix mat of 1's (representing soldiers) and 0's (representing civilians), 
    where soldiers are positioned in front of civilians (all 1's appear to the left of all 0's in each row),
    find the strongest row in the matrix.

    A row i is stronger than a row j if one of the following is true:
        - The number of soldiers in row i is greater than the number of soldiers in row j.
        - Both rows have the same number of soldiers and i < j.

    Return the index of the strongest row in the matrix.

Constraints:
    - m == mat.length
    - n == mat[i].length
    - 2 <= n, m <= 100
    - matrix[i][j] is either 0 or 1.

mat1 = [
    [1,1,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,1,0,0,0],
    [1,1,1,1,1]
]
output : 4
mat2 = [
    [1,0,0,0],
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0]
]
output: 1
"""

from typing import List
import heapq

class Solution:
    def strongestRow(self, mat: List[List[int]]) -> int:
        """
        Approach 1: Using a max-heap to find the strongest row

        Time Complexity: O(mlogm), where m is the number of rows
        Space Complexity: O(m)

        Logic:
            - Use a max-heap to maintain the rows ordered by their strength.
            - For each row, calculate its strength (the sum of its elements, representing the number of soldiers) 
            and push this value into the heap along with the row index.
            - The top of the heap will contain the strongest row.

        Pros:
            - Simple and straightforward implementation.
            - Efficiently handles the case where multiple rows have the same strength.

        Cons:
            - May be less efficient for very large matrices compared to the binary search approach.
        """
        soldier_positions = []
        for row_index, row in enumerate(mat):
            soldier_count = sum(row)
            heapq.heappush(soldier_positions, (-soldier_count, -row_index))
        
        # The top of the heap is the strongest row
        return -soldier_positions[0][1]
    
    def strongestRowBS(self, mat: List[List[int]]) -> int:
        """
        Approach 2: Using binary search to count soldiers and find the strongest row

        Time Complexity: O(mlogn), where m is the number of rows and n is the number of columns
        Space Complexity: O(1)

        Logic:
            - Use binary search on each row to efficiently count the number of soldiers (1's).
            - Keep track of the strongest row seen so far.
            - Return the index of the strongest row.

        Pros:
            - More efficient for counting soldiers in each row, especially for large n.
            - Uses constant extra space.

        Cons:
        - Slightly more complex implementation due to the binary search logic.
        """
        def binarySearch(arr):
            left, right = 0, len(arr) - 1
            while left <= right:
                mid = (left + right) // 2
                if arr[mid] == 1:
                    left = mid + 1
                else:
                    right = mid - 1
            return left

        max_soldiers = -1
        strongest_row = -1
        for idx, row in enumerate(mat):
            soldiers = binarySearch(row)
            if soldiers > max_soldiers or (soldiers == max_soldiers and idx < strongest_row):
                max_soldiers = soldiers
                strongest_row = idx

        return strongest_row

# Test cases
solution = Solution()

mat1 = [
    [1,1,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,1,0,0,0],
    [1,1,1,1,1]
]
print(solution.strongestRow(mat1))  # Expected: 4
print(solution.strongestRowBS(mat1))  # Expected: 4

mat2 = [
    [1,0,0,0],
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0]
]
print(solution.strongestRow(mat2))  # Expected: 1
print(solution.strongestRowBS(mat2))  # Expected: 1

mat3 = [
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,0],
    [1,1,1,1,0],
    [1,1,1,1,1]
]
print(solution.strongestRow(mat3))  # Expected: 0
print(solution.strongestRowBS(mat3))  # Expected: 0