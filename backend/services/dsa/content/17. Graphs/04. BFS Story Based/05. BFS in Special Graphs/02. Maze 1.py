"""
Problem Statement:
    There is a ball in a maze with empty spaces and walls. The ball can go through empty spaces by rolling up,
    down, left or right, but it won't stop rolling until hitting a wall. When the ball stops, it could choose the next direction.
    Given the ball's start position, the destination and the maze, determine whether the ball could stop at the destination.

    The maze is represented by a binary 2D array. 1 means the wall and 0 means the empty space. You may assume that the borders
    of the maze are all walls. The start and destination coordinates are represented by row and column indexes.

Constraints:
    1. There is only one ball and one destination in the maze.
    2. Both the ball and the destination exist on an empty space, and they will not be at the same position initially.
    3. The given maze does not contain border (like the red rectangle in the example pictures), but you could assume the border of the maze are all walls.
    4. The maze contains at least 2 empty spaces, and both the width and height of the maze won't exceed 100.

Time Complexity: 
- DFS  where m and n are the dimensions of the maze. We might visit each cell once.

Space Complexity: 
- BFS: O(mn) for the visited array and the queue in the worst case.

"""

from typing import List
from collections import deque

class Solution:
    def __init__(self):
        self.directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        self.end_x = 0
        self.end_y = 0
        self.visited = None

    def BFS(self, maze: List[List[int]], x: int, y: int) -> bool:
        queue = deque([(x, y)])
        self.visited[x][y] = True

        while queue:
            curr_x, curr_y = queue.popleft()

            if curr_x == self.end_x and curr_y == self.end_y:
                return True

            for dx, dy in self.directions:
                x_, y_ = curr_x + dx, curr_y + dy

                # Continue moving in the same direction until hitting a wall
                while 0 <= x_ < len(maze) and 0 <= y_ < len(maze[0]) and maze[x_][y_] == 0:
                    x_ += dx
                    y_ += dy

                # Move back one step as we've hit a wall
                x_ -= dx
                y_ -= dy

                if not self.visited[x_][y_]:
                    queue.append((x_, y_))
                    self.visited[x_][y_] = True

        return False

    def hasPath(self, maze: List[List[int]], start: List[int], destination: List[int]) -> bool:
        x, y = start
        self.end_x, self.end_y = destination
        self.visited = []
        # self.visited = [[False for  in range(len(maze[0]))] for  in range(len(maze))]
        rows = len(maze)
        cols = len(maze[0])
        for _ in range(rows):
            row = []
            for _ in range(cols):
                row.append(False)
            self.visited.append(row)

        return self.BFS(maze, x, y)

# Test cases
solution = Solution()
maze1 = [
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,1,0],
    [1,1,0,1,1],
    [0,0,0,0,0]
]
start1 = [0,4]
end1 = [3,2]
print(solution.hasPath(maze1, start1, end1))  # Should return False

maze2 = [
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,1,0],
    [1,1,0,1,1],
    [0,0,0,0,0]
]
start2 = [0,4]
end2 = [4,4]
print(solution.hasPath(maze2, start2, end2))  # Should return True