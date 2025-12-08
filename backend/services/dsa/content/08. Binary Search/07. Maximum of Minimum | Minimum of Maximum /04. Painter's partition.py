
"""
The Painter's Partition Problem
# similar to M bouquets

Problem Statement:
    Given are N boards with lengths given in an array, and K painters, such that each painter takes 1 unit of time to paint 1 unit of the board. 
    The task is to find the minimum time to paint all boards under the constraints that any painter will only paint continuous sections of boards.

Examples:
    Input: N = 4, boards = [10, 10, 10, 10], K = 2
    Output: 20
    Explanation: Divide the boards into 2 equal sized partitions. Each painter gets 20 units of board and the total time taken is 20.

    Input: N = 4, boards = [10, 20, 30, 40], K = 2
    Output: 60
    Explanation: Divide first 3 boards to painter 1 (60 time units), and last board to painter 2 (40 time units). Total time = max(60, 40) = 60.

Constraints:
    * 1 <= N <= 10^5
    * 1 <= boards[i] <= 10^5
    * 1 <= K <= N

Solution Explanation:
    The solution uses a binary search approach to find the minimum time:

    1. We define a helper function 'is_feasible' that checks if it's possible to paint all boards within a given maximum time using K painters.
    2. In the main function 'min_time', we perform a binary search on the possible time ranges:
       - The minimum possible time is the maximum length of any board.
       - The maximum possible time is the sum of all board lengths.
    3. We keep narrowing down our search range until we find the minimum time that allows painting all boards with K painters.

Time Complexity: O(N * log(sum(boards))), where N is the number of boards.
    - The binary search takes O(log(sum(boards))) iterations.
    - In each iteration, we call the 'is_feasible' function which takes O(N) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

"""
from typing import List

class Solution:
    def is_feasible(self, boards: List[int], k: int, max_time: int) -> bool:
        painters_required = 1
        current_sum = 0
        
        for board in boards:
            if board > max_time:
                return False
            if current_sum + board > max_time:
                painters_required += 1
                current_sum = board
                if painters_required > k:
                    return False
            else:
                current_sum += board
        
        return True

    def min_time(self, boards: List[int], k: int) -> int:
        if k > len(boards):
            return max(boards)
        
        low = max(boards)
        high = sum(boards)
        
        while low < high:
            mid = low + (high - low) // 2
            if self.is_feasible(boards, k, mid):
                high = mid
            else:
                low = mid + 1
        
        return low



# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    boards1 = [10, 10, 10, 10]
    k1 = 2
    result1 = solution.min_time(boards1, k1)
    print(f"Example 1 - Input: boards = {boards1}, K = {k1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    boards2 = [10, 20, 30, 40]
    k2 = 2
    result2 = solution.min_time(boards2, k2)
    print(f"Example 2 - Input: boards = {boards2}, K = {k2}")
    print(f"Output: {result2}")