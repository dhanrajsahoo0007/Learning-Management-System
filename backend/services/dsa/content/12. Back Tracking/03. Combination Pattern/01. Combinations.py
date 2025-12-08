"""
Generate all possible combinations of k numbers chosen from the range [1, n].

Problem Statement:
    Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].
    You may return the answer in any order.

Args:
    n (int): The upper bound of the range of numbers (1 to n)
    k (int): The number of elements in each combination

Returns:
    list[list[int]]: A list of all possible combinations

Time Complexity: O(k * C(n,k)), where C(n,k) is the binomial coefficient
    - We generate C(n,k) combinations, and for each, we perform O(k) work to copy the combination

Space Complexity: O(k * C(n,k))
    - We store all C(n,k) combinations, each of size k
    - The recursion stack can go up to depth k

Example:
    Input: n = 4, k = 2
    Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
    Explanation: There are 6 possible combinations of 2 numbers from the range [1, 4].
"""

class Solution:
    def __init__(self):
        self.result = []  # list to store all valid combinations

    def solve(self, start, n, k, temp) -> None:
        # Base case: if we have selected k elements
        if k == 0:
            self.result.append(temp[:])  # Add a copy of the current combination
            return
        
        # Try all possible numbers from start to n
        for i in range(start, n + 1):
            temp.append(i)  # Add current number to the combination
            self.solve(i + 1, n, k - 1, temp)  # Recurse with next number and k-1
            temp.pop()  # Backtrack: remove the last added number

    def combine(self, n: int, k: int) -> list[list[int]]:
        
        temp = []  # Temporary list to build combinations
        self.result = []  # Reset result list
        self.solve(1, n, k, temp)  # Start solving from 1
        return self.result

# Example usage:
solution = Solution()
n, k = 4, 2
result = solution.combine(n, k)
print(result)  # Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]