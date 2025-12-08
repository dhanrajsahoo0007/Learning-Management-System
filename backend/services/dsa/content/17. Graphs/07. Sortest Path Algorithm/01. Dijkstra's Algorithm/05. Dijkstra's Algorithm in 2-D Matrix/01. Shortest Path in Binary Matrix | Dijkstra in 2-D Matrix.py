"""
Problem Statement:
    Given an n x n binary matrix grid, return the length of the shortest clear path in the matrix. 
    If there is no clear path, return -1.

    A clear path in a binary matrix is a path from the top-left cell (i.e., (0, 0)) to the 
    bottom-right cell (i.e., (n - 1, n - 1)) such that:
        - All the visited cells of the path are 0.
        - All the adjacent cells of the path are 8-directionally connected (i.e., they are different 
          and they share an edge or a corner).

    The length of a clear path is the number of visited cells of this path.

Time Complexity: O(n^2 * log(n^2)), where n is the side length of the matrix. 
                The priority queue operations take log(n^2) time, and we might process each cell.

Space Complexity: O(n^2) for the priority queue and the result matrix.

Constraints:
    - n == grid.length == grid[i].length
    - 1 <= n <= 100
    - grid[i][j] is 0 or 1
"""

from typing import List
import heapq

class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        # Define all 8 directions: right, down, left, up, and 4 diagonals
        directions = [[1,1], [0,1], [1,0], [0,-1], [-1,0], [-1,-1], [1,-1], [-1,1]]
        m, n = len(grid), len(grid[0])
        
        # Check if the start or end cell is blocked
        if m == 0 or n == 0 or grid[0][0] != 0:
            return -1
        
        # Helper function to check if a cell is within the grid boundaries
        def isSafe(x: int, y: int) -> bool:
            return 0 <= x < m and 0 <= y < n
        
        # Initialize the result matrix with infinity
        result = [[float('inf')] * n for _ in range(m)]
        result[0][0] = 0
        
        # Initialize the priority queue with the start cell
        pq = [(0, (0, 0))]  # (distance, (x, y))
        
        while pq:
            # Get the cell with the smallest distance
            d, (x, y) = heapq.heappop(pq)
            
            # Explore all 8 directions
            for dx, dy in directions:
                x_, y_ = x + dx, y + dy
                dist = 1  # Distance to move to adjacent cell
                
                # Check if the new cell is valid, unvisited, and offers a shorter path
                if isSafe(x_, y_) and grid[x_][y_] == 0 and d + dist < result[x_][y_]:
                    # Update the distance and add to priority queue
                    heapq.heappush(pq, (d + dist, (x_, y_)))
                    grid[x_][y_] = 1  # Mark as visited
                    result[x_][y_] = d + dist
        
        # Return the length of the shortest path or -1 if no path exists
        # We add 1 to include the starting cell in the path length
        return result[m-1][n-1] + 1 if result[m-1][n-1] != float('inf') else -1



class Solution:
    def shortestPathBinaryMatrix(self, grid):
        shortest_path = a_star_graph_search(
            start              = (0, 0), 
            goal_function      = get_goal_function(grid),
            successor_function = get_successor_function(grid),
            heuristic          = get_heuristic(grid)
        )
        if shortest_path is None or grid[0][0] == 1:
            return -1
        else:
            return len(shortest_path)






# Example usage
if __name__ == "__main__":
    solution = Solution()
    
    # Example 1
    grid1 = [[0,1],[1,0]]
    print("Example 1 output:", solution.shortestPathBinaryMatrix(grid1))
    
    # Example 2
    grid2 = [[0,0,0],[1,1,0],[1,1,0]]
    print("Example 2 output:", solution.shortestPathBinaryMatrix(grid2))
    
    # Example 3
    grid3 = [[1,0,0],[1,1,0],[1,1,0]]
    print("Example 3 output:", solution.shortestPathBinaryMatrix(grid3))