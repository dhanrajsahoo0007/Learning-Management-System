"""
Problem Statement: 3Sum

    Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] 
    such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

    Notice that the solution set must not contain duplicate triplets.

Time Complexity: O(n^2), where n is the length of the input array.
    - Sorting takes O(n log n)
    - The nested loops (one explicit, one in twoSum) take O(n^2)

Space Complexity: 
    - O(1) if we don't count the space for the output. 
    - O(n) if we include the space needed for sorting.

Examples:
1. Input: nums = [-1,0,1,2,-1,-4]
   Output: [[-1,-1,2],[-1,0,1]]
   Explanation: 
   nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
   nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
   nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.

2. Input: nums = [0,1,1]
   Output: []
   Explanation: The only possible triplet does not sum up to 0.

3. Input: nums = [0,0,0]
   Output: [[0,0,0]]
   Explanation: The only possible triplet sums up to 0.
"""

class Solution:
    def twoSum(self, nums: list[int], k: int, result: list[list[int]], target: int) -> None:
        """
        Helper function to find pairs that sum up to the target.
        Uses two-pointer technique on a sorted array.
        """
        i, j = k, len(nums) - 1
        while i < j:
            current_sum = nums[i] + nums[j]
            if current_sum > target:
                j -= 1  # Sum too large, decrease right pointer
            elif current_sum < target:
                i += 1  # Sum too small, increase left pointer
            else:
                # Found a triplet, add to result
                result.append([-target, nums[i], nums[j]])
                # Skip duplicates for both pointers
                while i < j and nums[i] == nums[i+1]:
                    i += 1
                while i < j and nums[j] == nums[j-1]:
                    j -= 1
                # Move both pointers
                i += 1
                j -= 1

    def threeSum(self, nums: list[int]) -> list[list[int]]:
        """
        Main function to find all unique triplets that sum up to zero.
        """
        if len(nums) < 3:
            return []  # Not enough elements to form a triplet
        
        result = []
        nums.sort()  # Sort the array to handle duplicates and use two-pointer technique
        
        for i in range(len(nums) - 2):  # Iterate up to third last element
            if i > 0 and nums[i] == nums[i-1]:
                continue  # Skip duplicates for the first number
            
            # Use twoSum to find pairs that sum up to -nums[i]
            self.twoSum(nums, i+1, result, -nums[i])
        
        return result

# Test the solution
solution = Solution()

# Test case 1
nums1 = [-1,0,1,2,-1,-4]
print(f"Input: nums = {nums1}")
print(f"Output: {solution.threeSum(nums1)}")
print()

# Test case 2
nums2 = [0,1,1]
print(f"Input: nums = {nums2}")
print(f"Output: {solution.threeSum(nums2)}")
print()

# Test case 3
nums3 = [0,0,0]
print(f"Input: nums = {nums3}")
print(f"Output: {solution.threeSum(nums3)}")