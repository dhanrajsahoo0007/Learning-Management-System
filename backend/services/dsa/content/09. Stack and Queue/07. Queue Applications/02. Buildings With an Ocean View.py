"""
Problem: Buildings With an Ocean View

    There are n buildings in a line. You are given an integer array heights of size n that represents the heights of the buildings in the line.
    The ocean is to the right of the buildings. A building has an ocean view if the building can see the ocean without obstructions. 
    Formally, a building has an ocean view if all the buildings to its right have a smaller height.
    Return a list of indices (0-indexed) of buildings that have an ocean view, sorted in increasing order.

Example 1:
    Input: heights = [4,2,3,1]
    Output: [0,2,3]
    Explanation: Building 1 (0-indexed) does not have an ocean view because building 2 is taller.

Example 2:
    Input: heights = [4,3,2,1]
    Output: [0,1,2,3]
    Explanation: All the buildings have an ocean view.

Example 3:
    Input: heights = [1,3,2,4]
    Output: [3]
    Explanation: Only building 3 has an ocean view.

Constraints:
    1 <= heights.length <= 10^5
    1 <= heights[i] <= 10^9

Explanation:
    1. Algorithm Overview:
        - Iterate through the buildings from right to left.
        - Keep track of the maximum height seen so far.
        - If a building is taller than the maximum height, it has an ocean view.

    2. Key Steps:
        a) Initialize an empty deque to store the indices of buildings with ocean view.
        b) Initialize max_height to 0.
        c) Iterate through the heights array from right to left:
            - If the current building is taller than max_height, add its index to the deque.
            - Update max_height if necessary.
        d) Return the deque as a list.

    3. Implementation Details:
        - Use a deque for O(1) append operations and easy conversion to a list.
        - Iterate in reverse to avoid reversing the result at the end.

    4. Final Step:
        - Convert the deque to a list, which will be in the correct order.

Time Complexity: O(n), where n is the number of buildings.
Space Complexity: O(n) in the worst case, where all buildings have an ocean view.
"""


from typing import List
from collections import deque

class Solution:

    def findBuildings(self, heights: List[int]) -> List[int]:
        if not heights:
            return []
        
        max_height = 0
        ## using deque as it can add element in the left else return the reverse list 
        res = deque()
        #res = [] 
        
        for i in range(len(heights) - 1, -1, -1):
            curr_height = heights[i]
            if curr_height > max_height:
                res.appendleft(i)
                # res.append(i)
            max_height = max(max_height, curr_height)
        
        return res
        #return return res[::-1]

# Example usage
solution = Solution()

# Example 1
heights1 = [4,2,3,1]
result1 = solution.findBuildings(heights1)
print(f"Example 1: Input: heights = {heights1}")
print(f"Output: {result1}")

# Example 2
heights2 = [4,3,2,1]
result2 = solution.findBuildings(heights2)
print(f"\nExample 2: Input: heights = {heights2}")
print(f"Output: {result2}")

# Example 3
heights3 = [1,3,2,4]
result3 = solution.findBuildings(heights3)
print(f"\nExample 3: Input: heights = {heights3}")
print(f"Output: {result3}")