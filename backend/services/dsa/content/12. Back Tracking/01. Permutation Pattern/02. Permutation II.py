"""
Problem Statement:
    Given a collection of numbers, nums, that might contain duplicates, return all possible
    unique permutations in any order.

    Example 1:
    Input: nums = [1,1,2]
    Output: [[1,1,2], [1,2,1], [2,1,1]]

    Example 2:
    Input: nums = [1,2,3]
    Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

    Constraints:
    * 1 <= nums.length <= 8
    * -10 <= nums[i] <= 10

Approach:
    We use a backtracking algorithm with a modification to handle duplicates:
    1. Sort the input array to group duplicates together.
    2. Use a backtracking function that builds permutations incrementally.
    3. For each position, keep track of used numbers to avoid duplicate permutations.
    4. Use a swap method to generate different permutations.
    5. Backtrack by undoing the swaps.

Time Complexity: O(n * n!)
    - In the worst case (no duplicates), we generate n! permutations.
    - Each permutation takes O(n) time to construct.
    - The actual number of permutations will be less if there are duplicates.

Space Complexity: O(n * n!)
    - We store up to n! permutations in the worst case.
    - Each permutation is of length n.
    - The recursion stack can go up to depth n.

Recursive Tree for input [1,1,2]:

                 [1,1,2]
                /   |   \
            [1,1,2] [1,1,2] [2,1,1]
              |       |
            [1,1,2] [1,2,1]

Explanation of the Recursive Tree:
    - Root: The initial sorted array [1,1,2]
    - Level 1: Represents choices for the first position
        - [1,1,2]: First '1' stays in place
        - [1,1,2]: Second '1' is not swapped (skipped to avoid duplication)
        - [2,1,1]: '2' is swapped to first position
    - Level 2: Represents choices for the second position
        - For [1,1,2]: Second '1' stays, then '2' is swapped
        - For [2,1,1]: No more unique permutations (both are '1')
    - Level 3: Final permutations

Key Points:
    1. Sorting groups duplicates together, making it easier to skip duplicates.
    2. The 'used' set in each recursive call prevents duplicate permutations.
    3. Swapping is used to generate permutations efficiently.
    4. Backtracking (undoing swaps) allows exploration of all possibilities.
    5. The number of unique permutations may be less than n! due to duplicates.
"""

class Solution:
    def permuteUnique(self, nums: list[int]) -> list[list[int]]:
        def swap(i, j):
            """Helper method to swap elements at indices i and j in nums"""
            nums[i], nums[j] = nums[j], nums[i]

        def backtrack(start):
            # Base case: if we've reached the end of the array, we have a complete permutation
            if start == len(nums):
                result.append(nums[:])
                return
            
            used = set()  # To keep track of used numbers at this position
            for i in range(start, len(nums)):
                # Skip if we've already used this number at this position
                if nums[i] in used:
                    continue
                used.add(nums[i])
                
                # Swap the current number into the 'start' position
                swap(start, i)
                # Recurse on the next position
                backtrack(start + 1)
                # Backtrack: undo the swap
                swap(start, i)
        
        nums.sort()  # Sort to group duplicates together
        result = []
        backtrack(0)
        return result

# Test cases
solution = Solution()
print(solution.permuteUnique([1,1,2]))  # Output: [[1,1,2], [1,2,1], [2,1,1]]
print(solution.permuteUnique([1,2,3]))  # Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]