"""
Problem Statement: Combination Sum II
    Given an array of integers candidates (which may contain duplicates) and a target integer target,
    find all unique combinations in candidates where the candidate numbers sum to target.
    Each number in candidates may only be used once in the combination.

    Note: The solution set must not contain duplicate combinations.

Time Complexity: O(2^n), where n is the number of candidates.
    In the worst case, we might need to explore all possible subsets.

Space Complexity: O(n), where n is the number of candidates.
    This accounts for the recursion stack and the space to store combinations.

Example 1:
    Input: candidates = [10,1,2,7,6,1,5], target = 8
    Output: 
    [
    [1,1,6],
    [1,2,5],
    [1,7],
    [2,6]
    ]

Example 2:
    Input: candidates = [2,5,2,1,2], target = 5
    Output: 
    [
    [1,2,2],
    [5]
    ]

Visual Representation of the Decision Tree:
For candidates [1,1,2,2,5] and target 5, the decision tree would look like this:

               []
        /    /    \    \
      [1]  [1]   [2]  [5]
     /  \    |    |
 [1,1] [1,2] [1,2] [2,2]
   |     |     |    |
[1,1,2] [1,2,2] [1,2,2] [2,2,1]

Valid combinations: [1,2,2] and [5]

This tree shows how:
    1. The algorithm explores combinations, handling duplicates.
    2. Branches are pruned when the sum exceeds the target.
    3. Duplicate combinations are avoided by skipping duplicates at the same level.
"""

class Solution:
    def __init__(self):
        self.result = []  # list to store all valid combinations

    def solve(self, start: int, candidates: list[int], target: int, temp: list[int]) -> None:
        # Base case: if we have reached the target sum
        if target == 0:
            self.result.append(temp[:])  # Add a copy of the current combination
            return
        
        # Try all possible numbers from start to end of candidates
        for i in range(start, len(candidates)):
            # Skip duplicates at the same level to avoid duplicate combinations
            if i > start and candidates[i] == candidates[i-1]:
                continue
            
            # If the current candidate is greater than the target, we can stop
            # (since the array is sorted, all subsequent numbers will be larger)
            if candidates[i] > target:
                break
            
            temp.append(candidates[i])  # Add current number to the combination
            # Recurse with next index (to use each number once) and reduced target
            self.solve(i + 1, candidates, target - candidates[i], temp)
            temp.pop()  # Backtrack: remove the last added number

    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        temp = []  # Temporary list to build combinations
        self.result = []  # Reset result list
        candidates.sort()  # Sort candidates for handling duplicates and enabling pruning
        self.solve(0, candidates, target, temp)  # Start solving from index 0
        return self.result

# Example usage:
solution = Solution()
candidates = [10,1,2,7,6,1,5]
target = 8
result = solution.combinationSum2(candidates, target)
print(f"Input: candidates = {candidates}, target = {target}")
print(f"Output: {result}")  # Output: [[1,1,6],[1,2,5],[1,7],[2,6]]

candidates = [2,5,2,1,2]
target = 5
result = solution.combinationSum2(candidates, target)
print(f"\nInput: candidates = {candidates}, target = {target}")
print(f"Output: {result}")  # Output: [[1,2,2],[5]]