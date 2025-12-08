"""
Problem: Jump Game
    Given an integer array nums where each element represents the maximum jump length
    at that position, determine if you can reach the last index starting from the first index.

Explanation:
    1. We use a greedy approach, starting from the end of the array.
    2. Initialize 'goal' as the last index.
    3. Iterate through the array from right to left:
    - If we can reach the current 'goal' from index i (i + nums[i] >= goal),
        update 'goal' to i.
    4. If 'goal' becomes 0, it means we can reach the end from the start.

Time Complexity: O(n), where n is the length of nums.
We iterate through the array once.

Space Complexity: O(1)
We only use a constant amount of extra space.

"""


from typing import List
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        goal = len(nums) - 1
        
        for i in range(len(nums) - 1, -1, -1):
            #  nums[i] -> jump lenght x
            if i + nums[i] >= goal:
                ## when we reach the goal then update the goal to be i 
                goal = i
        
        return goal == 0

# Test cases
def run_test_case(nums, case_number):
    solution = Solution()
    result = solution.canJump(nums)
    print(f"Test case {case_number}: {nums}")
    print(f"Output: {result}\n")

# Test cases

if __name__ == "__main__":
    # Test case 1: Can reach the end
    run_test_case([2,3,1,1,4], 1)

    # Test case 2: Cannot reach the end due to zero
    run_test_case([3,2,1,0,4], 2)

    # Test case 3: Single element array
    run_test_case([0], 3)

    # Test case 4: Exactly enough jumps to reach the end
    run_test_case([2,0,0], 4)

    # Test case 5: Cannot reach the end (all zeros except last)
    run_test_case([0,0,0,0,1], 5)

    # Test case 6: Can reach the end (alternating pattern)
    run_test_case([1,0,1,0,1], 6)

    # Test case 7: Cannot reach the end (not enough jumps)
    run_test_case([1,1,0,1], 7)

