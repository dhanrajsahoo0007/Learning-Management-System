"""
Problem Statement:
    Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).
    The solution set must not contain duplicate subsets. Return the solution in any order.

    Example 1:
        Input: nums = [1,2,2]
        Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]

    Example 2:
        Input: nums = [0]
        Output: [[],[0]]

    Time Complexity: O(2^n), where n is the number of elements in nums.
    In the worst case, we generate all possible subsets.

    Space Complexity: O(2^n) to store all the subsets in the result list.
    The recursion stack also uses space, but it's limited to O(n) in the worst case.

Explanation:
    This problem is solved using a backtracking approach. The key challenges are:
    1. Generating all possible subsets
    2. Handling duplicates to avoid duplicate subsets

    The solution sorts the input array first, which allows us to easily skip duplicates.
    We use a recursive backtracking function to generate subsets, adding each valid subset to our result.



The backtracking algorithm works as follows:

    1. We start with an empty subset and progressively build larger subsets.
    2. At each step, we have two choices for each element: include it or not.
    3. We use the start parameter to keep track of which elements we've considered.
    4. To handle duplicates, we skip elements that are the same as the previous one (when they're not the first element we're considering in a particular recursive call).
    5. We add each valid subset to our result list.
    6. After exploring with an element included, we backtrack by removing it, allowing us to explore options without it.

    Recursion Tree (for input [1,2,2]):
                            []
                    /          \
                    [1]            []
                /    \         /    \
            [1,2]    [1]     [2]     []
            /    \                   /
        [1,2,2]  [1,2]              [2,2]

    Note: The second [2] is skipped in the actual execution to avoid duplicates.
"""

class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        def backtrack(start, current_subset):
            # Add the current subset to the result
            result.append(current_subset[:])
            
            for i in range(start, len(nums)):
                # Skip duplicates to avoid duplicate subsets
                if i > start and nums[i] == nums[i-1]:
                    continue
                # Include the current element and recurse
                current_subset.append(nums[i])
                backtrack(i + 1, current_subset)
                # Backtrack: remove the last element to try the next one
                current_subset.pop()
        
        nums.sort()  # Sort the array to handle duplicates
        result = []
        backtrack(0, [])
        return result

# Test the solution
sol = Solution()
print(sol.subsetsWithDup([1,2,2]))  # Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
print(sol.subsetsWithDup([0]))      # Output: [[],[0]]