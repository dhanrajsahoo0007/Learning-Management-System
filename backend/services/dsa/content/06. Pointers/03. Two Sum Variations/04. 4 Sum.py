"""
Problem: 4Sum

    Given an array nums of n integers and an integer target, find all unique quadruplets 
    in the array which gives the sum of target.

Note:
    - The solution set must not contain duplicate quadruplets.
    - The order of the quadruplets doesn't matter.

Time Complexity: O(n^3), where n is the number of elements in the array.
Space Complexity: O(1) if we don't count the space required for the output.

This solution uses a nested approach:
    1. The main fourSum method sorts the array and iterates through it to fix the first number.
    2. For each first number, it calls threeSum to find triplets that sum up to the remaining target.
    3. threeSum iterates to fix the second number and calls twoSum for the remaining pair.
    4. twoSum uses two pointers to find pairs that sum up to the target.

The solution handles duplicates at each level to avoid duplicate quadruplets.
"""

class Solution:
    def __init__(self):
        self.result = []
        self.n = 0
        self.num1 = 0
        self.num2 = 0

    def twoSum(self, nums: list[int], idx: int, target: int) -> None:
        l, r = idx, self.n - 1
        
        while l < r:
            if nums[l] + nums[r] < target:
                l += 1
            elif nums[l] + nums[r] > target:
                r -= 1
            else:
                while l < r and nums[r] == nums[r-1]:
                    r -= 1
                while l < r and nums[l] == nums[l+1]:
                    l += 1
                
                self.result.append([self.num1, self.num2, nums[l], nums[r]])
                l += 1
                r -= 1

    def threeSum(self, nums: list[int], idx: int, target: int) -> None:
        for i in range(idx, self.n - 2):
            if i > idx and nums[i] == nums[i-1]:
                continue
            self.num2 = nums[i]
            self.twoSum(nums, i + 1, target - nums[i])

    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:
        nums.sort()
        self.n = len(nums)
        if self.n < 4:
            return []
        self.result = []
        
        for i in range(self.n - 3):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            
            self.num1 = nums[i]
            self.threeSum(nums, i + 1, target - nums[i])
        
        return self.result

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    nums1 = [1, 0, -1, 0, -2, 2]
    target1 = 0
    print(f"Test case 1: {solution.fourSum(nums1, target1)}")
    # Expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]

    # Test case 2
    nums2 = [4, 3, 2, 1, 0]
    target2 = 0
    print(f"Test case 2: {solution.fourSum(nums2, target2)}")
    # Expected: []