"""
Problem Statement: Daily Temperatures

    Given an array of integers temperatures represents the daily temperatures, 
    return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. 
    If there is no future day for which this is possible, keep answer[i] == 0 instead.

Example 1:
    Input: temperatures = [73,74,75,71,69,72,76,73]
    Output: [1,1,4,2,1,1,0,0]

Example 2:
    Input: temperatures = [30,40,50,60]
    Output: [1,1,1,0]

Example 3:
    Input: temperatures = [30,60,90]
    Output: [1,1,0]

Constraints:
    * 1 <= temperatures.length <= 10^5
    * 30 <= temperatures[i] <= 100

Answer Explanation:
This solution provides two approaches to solve the problem:

1. Reverse Iteration (dailyTemperatures_reverse):
   - We iterate through the array from right to left.
   - We use a stack to keep track of indices of temperatures.
   - For each temperature, we pop indices from the stack while their temperatures are not greater.
   - If the stack is not empty after popping, the top of the stack is the next warmer day.
   - We push the current index onto the stack for future comparisons.

2. Forward Iteration (dailyTemperatures_forward):
   - We iterate through the array from left to right.
   - We use a stack to keep track of indices of temperatures.
   - For each temperature, we compare it with the temperatures at the indices in the stack.
   - If the current temperature is higher, we've found a warmer day for those indices.
   - We calculate the number of days and update the answer array.
   - We push the current index onto the stack for future comparisons.

Both approaches use a monotonic stack to efficiently find the next warmer day.

Time Complexity: O(n) for both approaches, where n is the length of the temperatures list.
    - Each element is pushed and popped at most once from the stack.

Space Complexity: O(n) for both approaches.
    - In the worst case (temperatures in descending order), we might need to store all indices in the stack.
    - We also use an additional array of size n to store the result.
"""

from typing import List

class Solution:
    def dailyTemperatures_reverse(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        result = [0] * n  # Initialize result array with zeros
        stack = []  # Stack to store indices
        
        # Traverse the array from right to left
        for i in range(n - 1, -1, -1):
            while stack and temperatures[stack[-1]] <= temperatures[i]:
                stack.pop()
            
            if stack:
                # If stack is not empty, top of stack is the next warmer day
                result[i] = stack[-1] - i

            # If stack is empty, result[i] remains 0 (no warmer day found)
            # Push current index to stack for future comparisons
            stack.append(i)
        
        return result

    def dailyTemperatures_forward(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        result = [0] * n 
        stack = []  
        
        for i in range(n):
            # While stack is not empty and current temperature is higher than temperature at top of stack
            while stack and temperatures[i] > temperatures[stack[-1]]:
                prev_index = stack.pop()
                result[prev_index] = i - prev_index
            
            stack.append(i)
        
        return result

# Test cases
solution = Solution()

test_cases = [
    [73,74,75,71,69,72,76,73],
    [30,40,50,60],
    [30,60,90]
]

for i, temperatures in enumerate(test_cases, 1):
    print(f"Example {i}:")
    print("Input:", temperatures)
    print("Output (Reverse):", solution.dailyTemperatures_reverse(temperatures))
    print("Output (Forward):", solution.dailyTemperatures_forward(temperatures))
    print()