"""
Problem Statement:
    Given an array maxHeights, find the maximum possible sum of heights for a beautiful configuration of towers.
    A beautiful configuration must satisfy:
        1. 1 <= heights[i] <= maxHeights[i]
        2. heights is a mountain array (increasing then decreasing)

Time Complexity: O(n), where n is the length of maxHeights
Space Complexity: O(n) for the stack

Approach:
    1. We use two passes: left-to-right and right-to-left.
    2. In each pass, we maintain a monotonic stack to keep track of the indices of potential peaks.
    3. We calculate the sum of heights for each possible peak and keep track of the maximum sum.

The key idea is that for each element, we want to find the maximum height it can have while still
maintaining the mountain property with all elements to its left (in the left-to-right pass) or
to its right (in the right-to-left pass).
"""

class Solution:
    def maximumSumOfHeights(self, maxHeights: list[int]) -> int:
        n = len(maxHeights)
        left = [0] * n  # Store max sum of heights from left to current
        right = [0] * n  # Store max sum of heights from right to current
        stack = []  # Monotonic stack to keep track of indices
        
        # Left to right pass
        for i in range(n):
            # Remove heights from stack that are greater than current height
            while stack and maxHeights[stack[-1]] > maxHeights[i]:
                stack.pop()
            
            if not stack:
                # If stack is empty, all previous heights can be current height
                left[i] = (i + 1) * maxHeights[i]
            else:
                # Calculate sum: previous sum + (current - previous) * current height
                j = stack[-1]
                left[i] = left[j] + (i - j) * maxHeights[i]
            
            stack.append(i)
        
        stack.clear()  # Clear stack for right to left pass
        
        # Right to left pass
        for i in range(n - 1, -1, -1):
            # Remove heights from stack that are greater than current height
            while stack and maxHeights[stack[-1]] > maxHeights[i]:
                stack.pop()
            
            if not stack:
                # If stack is empty, all following heights can be current height
                right[i] = (n - i) * maxHeights[i]
            else:
                # Calculate sum: following sum + (following - current) * current height
                j = stack[-1]
                right[i] = right[j] + (j - i) * maxHeights[i]
            
            stack.append(i)
        
        # Calculate the maximum sum
        # For each potential peak, sum left and right contributions
        # Subtract maxHeights[i] once as it's counted in both left and right
        return max(left[i] + right[i] - maxHeights[i] for i in range(n))
# Test cases
solution = Solution()

# Example 1
maxHeights1 = [5,3,4,1,1]
max_sum1 = solution.maximumSumOfHeights(maxHeights1)
print(f"Example 1: Sum = {max_sum1}")  # Expected: Sum = 13

# Example 2
maxHeights2 = [6,5,3,9,2,7]
max_sum2 = solution.maximumSumOfHeights(maxHeights2)
print(f"Example 2: Sum = {max_sum2}")  # Expected: Sum = 22

# Example 3
maxHeights3 = [3,2,5,5,2,3]
max_sum3 = solution.maximumSumOfHeights(maxHeights3)
print(f"Example 3: Sum = {max_sum3}")  # Expected: Sum = 18

# Additional test case
maxHeights4 = [1,5,2,5,6,4,6,3]
max_sum4 = solution.maximumSumOfHeights(maxHeights4)
print(f"Additional Test: Sum = {max_sum4}")