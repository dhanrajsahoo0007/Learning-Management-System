"""
Two Sum II - Input Array Is Sorted

    Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, 
    find two numbers such that they add up to a specific target number. Let these two numbers 
    be numbers[index1] and numbers[index2] where 1 <= index1 < index2 <= numbers.length.

    Return the indices of the two numbers, index1 and index2, added by one as an integer array 
    [index1, index2] of length 2.

Examples:
1. Input: numbers = [2,7,11,15], target = 9
   Output: [1,2]
   Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].

2. Input: numbers = [2,3,4], target = 6
   Output: [1,3]
   Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].

Time Complexity: O(n), where n is the length of the input array.
Space Complexity: O(1), as we only use a constant amount of extra space.
"""
from typing import List 
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        i = 0  # Pointer for the start of the array
        j = len(numbers) - 1  # Pointer for the end of the array
        
        while i < j:
            current_sum = numbers[i] + numbers[j]
            
            if current_sum == target:
                # Found the pair, return indices (1-indexed)
                return [i + 1, j + 1]
            elif current_sum < target:
                # Sum is too small, move left pointer to the right
                i += 1
            else:
                # Sum is too large, move right pointer to the left
                j -= 1
        
        # If no solution is found (should not happen given the problem constraints)
        return []

# Test the solution
solution = Solution()

# Test case 1
numbers1 = [2, 7, 11, 15]
target1 = 9
print(f"Input: numbers = {numbers1}, target = {target1}")
print(f"Output: {solution.twoSum(numbers1, target1)}")
print()

# Test case 2
numbers2 = [2, 3, 4]
target2 = 6
print(f"Input: numbers = {numbers2}, target = {target2}")
print(f"Output: {solution.twoSum(numbers2, target2)}")
print()
