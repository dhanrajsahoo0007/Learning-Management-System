from typing import List
from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        directions = [[1,1], [0,1], [1,0], [0,-1], [-1,0], [-1,-1], [1,-1], [-1,1]]
        m, n = len(grid), len(grid[0])
        
        if m == 0 or n == 0 or grid[0][0] != 0:
            return -1
        
        queue = deque([(0, 0)])
        grid[0][0] = 1
        
        def isSafe(x: int, y: int) -> bool:
            return 0 <= x < m and 0 <= y < n
        
        steps = 1
        
        while queue:
            for _ in range(len(queue)):
                x, y = queue.popleft()
                
                if x == m - 1 and y == n - 1:
                    return steps
                
                for dx, dy in directions:
                    x_, y_ = x + dx, y + dy
                    if isSafe(x_, y_) and grid[x_][y_] == 0:
                        queue.append((x_, y_))
                        grid[x_][y_] = 1
            
            steps += 1
        
        return -1

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