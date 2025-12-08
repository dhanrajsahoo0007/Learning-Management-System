"""
Problem Statement: Combination Sum III
    Find all valid combinations of k numbers that sum up to n such that:
        1. Only numbers 1 through 9 are used.
        2. Each number is used at most once.
    Return a list of all possible valid combinations.

Time Complexity: O(C(9,k)), where C(9,k) is the binomial coefficient.
    In the worst case, we explore all possible combinations of k numbers from 9 choices.

Space Complexity: O(k), where k is the number of elements in each combination.
    This accounts for the recursion stack and the space to store each combination.

Example 1:
    Input: k = 3, n = 7
    Output: [[1,2,4]]
    Explanation: 1 + 2 + 4 = 7
    There are no other valid combinations.

Example 2:
    Input: k = 3, n = 9
    Output: [[1,2,6],[1,3,5],[2,3,4]]
    Explanation:
    1 + 2 + 6 = 9
    1 + 3 + 5 = 9
    2 + 3 + 4 = 9
    There are no other valid combinations.

Visualization of the backtracking process for k=3, n=7:

                 []
        /        |        \
      [1]       [2]       [3]
    /     \    /   \     /   \
 [1,2]  [1,3] [2,3] [2,4] [3,4] [3,5]
  /  \    |     |     |     x     x
[1,2,3] [1,2,4] [1,3,4] [2,3,4]
   x      *       x       x

Legend:
    * - Valid solution
    x - Pruned (sum > n or combination size > k)
    
This tree shows how:
    1. The algorithm explores combinations in ascending order.
    2. Branches are pruned when the sum exceeds 7 or when more than 3 numbers are selected.
    3. [1,2,4] is identified as the only valid solution.

Optimization:
    1. Early termination when the combination size exceeds k or the sum exceeds n.
    2. Starting from 'start' in each recursive call prevents duplicate considerations.
"""

class Solution:
    def __init__(self):
        self.result = []  # list to store all valid combinations

    def solve(self, start: int, k: int, n: int, temp: list[int]) -> None:
        # Base case: if we have k numbers and their sum is n
        if len(temp) == k and n == 0:
            self.result.append(temp[:])  # Add a copy of the current combination
            return
        
        # Pruning: stop if we have more than k numbers or if n becomes negative
        if len(temp) > k or n < 0:
            return
        
        # Try all possible numbers from start to 9
        for i in range(start, 10):
            temp.append(i)  # Add current number to the combination
            # Recurse with next number and reduced n
            self.solve(i + 1, k, n - i, temp)
            temp.pop()  # Backtrack: remove the last added number

    def combinationSum3(self, k: int, n: int) -> list[list[int]]:
        temp = []  # Temporary list to build combinations
        self.result = []  # Reset result list
        self.solve(1, k, n, temp)  # Start solving from 1
        return self.result

# Example usage:
solution = Solution()
k, n = 3, 7
result = solution.combinationSum3(k, n)
print(f"k = {k}, n = {n}")
print(f"Output: {result}")  # Output: [[1,2,4]]

k, n = 3, 9
result = solution.combinationSum3(k, n)
print(f"\nk = {k}, n = {n}")
print(f"Output: {result}")  # Output: [[1,2,6],[1,3,5],[2,3,4]]