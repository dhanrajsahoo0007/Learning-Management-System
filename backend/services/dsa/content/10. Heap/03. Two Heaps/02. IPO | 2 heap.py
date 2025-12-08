"""
Problem Statement:
    LeetCode is preparing for its IPO (Initial Public Offering) and wants to maximize its capital
    before the IPO. The company can choose to work on at most k distinct projects from a list of n projects.

    Each project i has two properties:
        1. Capital requirement: capital[i] - the minimum capital needed to start the project
        2. Pure profit: profits[i] - the profit the project will generate upon completion

    Initially, the company has w capital. When a project is completed, its profit is added to the total capital.

    The goal is to find the maximum capital the company can have after completing at most k projects.

Input:
    - k: maximum number of projects that can be completed (integer)
    - w: initial capital (integer)
    - profits: list of integers representing the profit of each project
    - capital: list of integers representing the capital requirement of each project

Output:
    - The maximum capital after completing at most k projects (integer)

Approach:
    We use two heaps to solve this problem:
        1. Min heap: to store projects based on their capital requirements
        2. Max heap: to store profits of available projects (those we can afford)

    We iterate k times, each time:
        1. Move all affordable projects from the min heap to the max heap
        2. If there are available projects in the max heap, complete the most profitable one
        3. Update the total capital

Time Complexity: O(NlogN)
    - Creating initial min heap: O(NlogN)
    - Each project can be pushed and popped from each heap once: O(2NlogN)
    - We do this for at most k iterations: O(KlogN)
    Total: O(NlogN + 2NlogN + KlogN) = O(NlogN) since K <= N

Space Complexity: O(N)
    - Min heap: O(N)
    - Max heap: O(N) in the worst case
"""

import heapq
from typing import List

class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        n = len(profits)
        
        # Create a min heap of projects based on capital requirements
        min_capital_heap = [(c, p) for c, p in zip(capital, profits)]
        heapq.heapify(min_capital_heap)
        
        # Max heap to store profits of available projects
        max_profit_heap = []
        
        # Perform up to k projects
        for _ in range(k):
            # Move all affordable projects to the max profit heap
            while min_capital_heap and min_capital_heap[0][0] <= w:
                c, p = heapq.heappop(min_capital_heap)
                heapq.heappush(max_profit_heap, -p)  # Use negative for max heap
            
            # If no projects can be started with current capital, end the loop
            if not max_profit_heap:
                break
            
            # Select the project with maximum profit and add its profit to our capital
            w -= heapq.heappop(max_profit_heap)  # Remember, we stored negative values
        
        # Return the final maximized capital
        return w

# Test the solution
solution = Solution()

# Test case 1
k1, w1 = 2, 0
profits1 = [1,2,3]
capital1 = [0,1,1]
print(f"Maximum capital for k={k1}, w={w1}: {solution.findMaximizedCapital(k1, w1, profits1, capital1)}")

# Test case 2
k2, w2 = 3, 0
profits2 = [1,2,3]
capital2 = [0,1,2]
print(f"Maximum capital for k={k2}, w={w2}: {solution.findMaximizedCapital(k2, w2, profits2, capital2)}")