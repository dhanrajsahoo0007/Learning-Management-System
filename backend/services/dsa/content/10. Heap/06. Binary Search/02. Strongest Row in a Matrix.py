"""1337. The K Weakest Rows in a Matrix
Easy

You are given an m x n binary matrix mat of 1's (representing soldiers) and 0's (representing civilians). The soldiers are positioned in front of the civilians. That is, all the 1's will appear to the left of all the 0's in each row.

A row i is weaker than a row j if one of the following is true:

The number of soldiers in row i is less than the number of soldiers in row j.
Both rows have the same number of soldiers and i < j.
Return the indices of the k weakest rows in the matrix ordered from weakest to strongest.

 Example 1:

Input: mat = 
[[1,1,0,0,0],
 [1,1,1,1,0],
 [1,0,0,0,0],
 [1,1,0,0,0],
 [1,1,1,1,1]], 
k = 3
Output: [2,0,3]
Explanation: 
The number of soldiers in each row is: 
- Row 0: 2 
- Row 1: 4 
- Row 2: 1 
- Row 3: 2 
- Row 4: 5 
The rows ordered from weakest to strongest are [2,0,3,1,4].
Example 2:

Input: mat = 
[[1,0,0,0],
 [1,1,1,1],
 [1,0,0,0],
 [1,0,0,0]], 
k = 2
Output: [0,2]
Explanation: 
The number of soldiers in each row is: 
- Row 0: 1 
- Row 1: 4 
- Row 2: 1 
- Row 3: 1 
The rows ordered from weakest to strongest are [0,2,3,1].
 

Constraints:

m == mat.length
n == mat[i].length
2 <= n, m <= 100
1 <= k <= m
matrix[i][j] is either 0 or 1.
"""

class Solution:
    def kWeakestRows(self, mat: List[List[int]], k: int) -> List[int]:
        """
        Logic:

        Utilize a min-heap to maintain the k weakest rows while iterating through the matrix.
        For each row, calculate its strength (the sum of its elements, representing the number of soldiers) and push this value into the heap.
        Whenever the heap size grows beyond k, remove the strongest row from the heap.
        At the end of the traversal, the heap will contain the k weakest rows, which can then be extracted and returned.
        Pros:

        This approach is particularly efficient when dealing with large matrices, especially when k is small relative to the number of rows.
        Makes optimal use of Python's heapq library for efficient heap operations, ensuring that both heap.push() and heap.pop() operations are fast.
        Cons:

        The heap-based approach adds a bit more complexity to the code compared to a straightforward sorting method, but it generally offers better performance for this problem.
        Time Complexity: O(mlogk)
            Pushing an element into a heap of size k takes O(logk) time. We do this m times, so the total time is O(mlogk).
            Space Complexity: O(k)
            The heap will store k elements at most, so the space complexity is O(k).
        """
        import heapq
        
        soldier_positions = []
        for row_index, row in enumerate(mat):
            soldier_count = sum(row)
            heapq.heappush( soldier_positions, (-soldier_count, -row_index ))
            if len(soldier_positions) >  k:
                 heapq.heappop( soldier_positions )
        return [-row_index for soldier_count, row_index in sorted(soldier_positions, reverse=True)]
    
    def kWeakestRowsbs(self, mat: List[List[int]], k: int) -> List[int]:
        """
        Time Complexity: O(mlogn+mlogm)
        Binary search on each row to find the number of soldiers will take O(logn) time for each row, resulting in O(mlogn) for all rows. Building and manipulating the heap will take O(mlogm) time.
        Space Complexity: O(m)
        We need additional space for the heap to store the strengths and indices, which will be of length m.

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
