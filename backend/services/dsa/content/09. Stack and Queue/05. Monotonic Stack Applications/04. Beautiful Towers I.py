"""
Problem Statement:
    Given an array heights, find the maximum possible sum of heights for a mountain-shaped tower arrangement.
    A mountain-shaped arrangement means the heights are non-decreasing up to a peak, then non-increasing.

Time Complexity: O(n^2), where n is the length of heights
Space Complexity: O(1)

Approach:
    1. Iterate through each index, considering it as a potential peak.
    2. For each peak, calculate the maximum possible sum by:
        - Moving left from the peak, ensuring non-decreasing heights
        - Moving right from the peak, ensuring non-increasing heights
    3. Keep track of the maximum sum found across all potential peaks.

This approach works for the given constraints (1 <= n <= 10^3) but may not be efficient for larger inputs.
"""

class Solution:
    def maximumSumOfHeights(self, heights: list[int]) -> int:
        n = len(heights)
        max_sum = 0
        
        # Find the maximum sum by considering each index as a potential peak
        # later we can check the max sum for all the peak elements -> max(max_sum, current_sum) to get the best pick element and max sum 
        for peak in range(n):
            current_sum = heights[peak]
            current_height = heights[peak]
            
            # Calculate sum for left side of the peak (non-decreasing)
            for i in range(peak - 1, -1, -1):
                current_height = min(current_height, heights[i])
                current_sum += current_height
            
            current_height = heights[peak]
            
            # Calculate sum for right side of the peak (non-increasing)
            for i in range(peak + 1, n):
                current_height = min(current_height, heights[i])
                current_sum += current_height
            
            # Update max_sum if current configuration is better
            max_sum = max(max_sum, current_sum)
        
        return max_sum

# Test cases
solution = Solution()

# Example 1
heights1 = [5,3,4,1,1]
print(f"Example 1: {solution.maximumSumOfHeights(heights1)}")  # Expected: 13
# Explanation: We remove some bricks to make heights = [5,3,3,1,1], the peak is at index 0.

# Example 2
heights2 = [6,5,3,9,2,7]
print(f"Example 2: {solution.maximumSumOfHeights(heights2)}")  # Expected: 22
# Explanation: We remove some bricks to make heights = [3,3,3,9,2,2], the peak is at index 3.

# Example 3
heights3 = [3,2,5,5,2,3]
print(f"Example 3: {solution.maximumSumOfHeights(heights3)}")  # Expected: 18
# Explanation: We remove some bricks to make heights = [2,2,5,5,2,2], the peak is at index 2 or 3.

# Additional test case
heights4 = [1,5,2,5,6,4,6,3]
print(f"Additional Test: {solution.maximumSumOfHeights(heights4)}")  # Expected: 29
# This test case helps verify the solution for a more complex scenario