"""
Problem Statement:
    Given an array of distinct positive integers (candidates) and a target integer,
    find all unique combinations of candidates where the chosen numbers sum to the target.
    Each number in candidates may be used an unlimited number of times.

Time Complexity: O(N^(T/M)), where N is the number of candidates,
    T is the target value, and M is the minimum value among the candidates.
    - In the worst case, we explore all possible combinations.
    - The maximum depth of recursion is T/M (using the smallest candidate repeatedly).
    - At each level, we have up to N choices.

Space Complexity: O(T/M)
    - The main space usage comes from the recursion stack.
    - The maximum depth of recursion is T/M.
    - Each recursive call stores a constant amount of data.

Example:
    Input: candidates = [2,3,6,7], target = 7
    Output: [[2,2,3],[7]]
    Explanation:
        2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
        7 is a candidate, and 7 = 7.
        These are the only two combinations.

Visual Representation of the Decision Tree:
For candidates [2,3,6,7] and target 7, the decision tree would look like this:

                       []
              /     /     \     \
            [2]    [3]    [6]   [7]
           /  \     |
        [2,2] [2,3] [3,3]
        /     |
    [2,2,2] [2,3,2]
      |       |
  [2,2,2,2] [2,3,2]  (stop here as sum > 7)

    Valid combinations: [2,2,3] and [7]
"""


class Solution1:
    def __init__(self):
        self.result = []  # list to store all valid combinations

    def solve(self, start, candidates, target, temp) -> None:
        # Base case: if we have reached the target sum
        if target == 0:
            # self.result.append(temp.copy()) 
            self.result.append(temp[:])  # Add a copy of the current combination
            return
        
        # If target becomes negative, we've exceeded the sum, so return
        if target < 0:
            return
        
        # Try all possible numbers from start to end of candidates
        for i in range(start, len(candidates)):
            temp.append(candidates[i])  # Add current number to the combination
            # Recurse with same start index (to allow reuse) and reduced target
            self.solve(i, candidates, target - candidates[i], temp)
            temp.pop()  # Backtrack: remove the last added number

    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        temp = []  # Temporary list to build combinations
        self.result = []  # Reset result list
        candidates.sort()  # Sort candidates for optimization
        self.solve(0, candidates, target, temp)  # Start solving from index 0
        return self.result

# Example usage:
solution = Solution1()
candidates = [2, 3, 6, 7]
target = 7
result = solution.combinationSum(candidates, target)
print(result)  # Output: [[2, 2, 3], [7]]


class Solution2:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        """
        Time Complexity: O(n^(target/min(candidates))). In the worst case, the state-space tree 
        has n branches and the depth of the tree is at most target divided by the smallest number in candidates.
        """
        results: list[list[int]] = []
        n = len(candidates)
        
        def dfs(starting_index: int, curr_sum: int, target: int, path: list):
            if curr_sum == target:
                results.append(path[:])  # Add a copy of the current path
                return
            for index in range(starting_index, n):
                num = candidates[index]
                new_sum = curr_sum + num
                if new_sum > target:
                    continue
                dfs(index, new_sum, target, path + [num])
            return
        
        candidates.sort()  # Sort candidates for optimization
        dfs(starting_index=0, curr_sum=0, target=target, path=[])
        return results

# Example usage for Solution2:
solution2 = Solution2()
candidates = [2, 3, 6, 7]
target = 7
result2 = solution2.combinationSum(candidates, target)
print(result2)  # Output: [[2, 2, 3], [7]]