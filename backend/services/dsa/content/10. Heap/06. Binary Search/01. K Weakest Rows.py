"""

Problem Statement: 1337. The K Weakest Rows in a Matrix

    You are given an m x n binary matrix mat of 1's (representing soldiers) and 0's (representing civilians). 
    The soldiers are positioned in front of the civilians. That is, all the 1's will appear to the left of all the 0's in each row.

    A row i is weaker than a row j if one of the following is true:
    - The number of soldiers in row i is less than the number of soldiers in row j.
    - Both rows have the same number of soldiers and i < j.

    Return the indices of the k weakest rows in the matrix ordered from weakest to strongest.

Constraints:
    - m == mat.length
    - n == mat[i].length
    - 2 <= n, m <= 100
    - 1 <= k <= m
    - matrix[i][j] is either 0 or 1.
"""

from typing import List
import heapq

class Solution:
    def kWeakestRows(self, mat: List[List[int]], k: int) -> List[int]:
        """
        Approach 1: Using a min-heap to maintain the k weakest rows

        Time Complexity: O(mlogk), where m is the number of rows
        Space Complexity: O(k)

        Logic:
        - Utilize a min-heap to maintain the k weakest rows while iterating through the matrix.
        - For each row, calculate its strength (the sum of its elements, representing the number of soldiers) 
          and push this value into the heap.
        - Whenever the heap size grows beyond k, remove the strongest row from the heap.
        - At the end of the traversal, the heap will contain the k weakest rows, which can then be extracted and returned.

        Pros:
        - Efficient for large matrices, especially when k is small relative to the number of rows.
        - Makes optimal use of Python's heapq library for efficient heap operations.

        Cons:
        - Adds more complexity compared to a straightforward sorting method.
        """
        soldier_positions = []
        for row_index, row in enumerate(mat):
            soldier_count = sum(row)
            heapq.heappush(soldier_positions, (-soldier_count, -row_index))
            if len(soldier_positions) > k:
                heapq.heappop(soldier_positions)
        return [-row_index for soldier_count, row_index in sorted(soldier_positions, reverse=True)]
    
    def kWeakestRowsbs(self, mat: List[List[int]], k: int) -> List[int]:
        """
        Approach 2: Using binary search to count soldiers and a heap to maintain k weakest rows

        Time Complexity: O(mlogn + mlogm), where m is the number of rows and n is the number of columns
        Space Complexity: O(m)

        Logic:
        - Use binary search on each row to efficiently count the number of soldiers (1's).
        - Create a min-heap of tuples (soldier_count, row_index) for all rows.
        - Extract the k smallest elements from the heap to get the k weakest rows.

        Pros:
        - More efficient for counting soldiers in each row, especially for large n.
        - Still maintains good efficiency for selecting the k weakest rows.

        Cons:
        - Slightly more complex implementation due to the combination of binary search and heap operations.
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

        queue = [(binarySearch(row), idx) for idx, row in enumerate(mat)]
        heapq.heapify(queue)

        return [idx for _, idx in heapq.nsmallest(k, queue)]

# Test cases
solution = Solution()

mat1 = [
    [1,1,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,1,0,0,0],
    [1,1,1,1,1]
]
k1 = 3
print(solution.kWeakestRows(mat1, k1))  # Expected: [2,0,3]
print(solution.kWeakestRowsbs(mat1, k1))  # Expected: [2,0,3]

mat2 = [
    [1,0,0,0],
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0]
]
k2 = 2
print(solution.kWeakestRows(mat2, k2))  # Expected: [0,2]
print(solution.kWeakestRowsbs(mat2, k2))  # Expected: [0,2]