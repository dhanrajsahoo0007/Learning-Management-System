"""
1642. Furthest Building You Can Reach
Medium
You are given an integer array heights representing the heights of buildings, some bricks, and some ladders.

You start your journey from building 0 and move to the next building by possibly using bricks or ladders.

While moving from building i to building i+1 (0-indexed),

    If the current building's height is greater than or equal to the next building's height, you do not need a ladder or bricks.
    If the current building's height is less than the next building's height, you can either use one ladder or (h[i+1] - h[i]) bricks.

Return the furthest building index (0-indexed) you can reach if you use the given ladders and bricks optimally.
"""

class Solution:
    def furthestBuilding(self, heights: List[int], bricks: int, ladders: int) -> int:
        """
        First assign the ladders where possible till they get exhausted
        then put that climb in a min heap
        go on till no more ladders there
        then check if the minimum climb on the top of the heap
        """
        import heapq
        
        climb_heights = []

        for i in range(len(heights)-1):
            current_height = heights[i]
            next_height = heights[i+1]
            if current_height >= next_height:
                continue
            climb = next_height - current_height
            heapq.heappush(climb_heights, climb)

            if len(climb_heights) > ladders:
                smallest_climb = heapq.heappop(climb_heights)
                if bricks < smallest_climb:
                    return i
                bricks -= smallest_climb
    
        return len(heights) - 1