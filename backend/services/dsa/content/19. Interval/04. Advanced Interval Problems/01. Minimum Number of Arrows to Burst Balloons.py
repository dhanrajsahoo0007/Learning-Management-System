"""
Problem: Minimum Number of Arrows to Burst Balloons

    There are spherical balloons taped onto a flat wall represented by the XY-plane. The balloons are represented as a 2D integer array
    points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend.
    You can shoot arrows vertically (in the positive y-direction) to burst balloons. A balloon with xstart and xend is burst by an
    arrow shot at x if xstart <= x <= xend. Find the minimum number of arrows that must be shot to burst all balloons.

Approach:
    1. Sort the balloons based on their start points.
    2. Initialize the result with the total number of balloons (assuming one arrow per balloon initially).
    3. Iterate through the balloons, merging overlapping ones and reducing the arrow count for each merge.
    4. Return the final arrow count.

Time Complexity: O(n log n), where n is the number of balloons, due to the sorting operation.
Space Complexity: O(1) if we don't count the space for sorting, as we only use a few variables.
"""

from typing import List

class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        # Sort the balloons based on their start points
        points.sort()

        # Initialize the result with the total number of balloons
        res = len(points)
        
        # If there are no balloons, return 0
        if res == 0:
            return 0
        
        # Initialize prev with the first balloon
        prev = points[0]
        
        # Iterate through the remaining balloons
        for i in range(1, len(points)):
            curr = points[i]
            
            # If current balloon starts before or at the end of previous balloon
            if curr[0] <= prev[1]:
                # Reduce the number of arrows needed
                res -= 1
                # Update prev to be the intersection of current and previous
                prev = [curr[0], min(curr[1], prev[1])]
            else:
                # No overlap, update prev to current balloon
                prev = curr
        
        return res

# Example usage and test cases
solution = Solution()
print(solution.findMinArrowShots([[10,16],[2,8],[1,6],[7,12]]))  # Expected: 2
print(solution.findMinArrowShots([[1,2],[3,4],[5,6],[7,8]]))    # Expected: 4
print(solution.findMinArrowShots([[1,2],[2,3],[3,4],[4,5]]))    # Expected: 2
