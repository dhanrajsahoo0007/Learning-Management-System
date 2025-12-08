"""
Problem Statement:
    Given a maze of size N x N, find all possible paths that a rat can take to reach
    from the source (0, 0) to the destination (N-1, N-1).
    The rat can move only in two directions: forward and down. 
    In the maze matrix, 0 means the cell is a dead and
    end and 1 means the cell can be used in the path from source to destination.


    Visualization of the maze (1 represents open path, 0 represents blocked)

    [1, 0, 0, 0]
    [1, 1, 0, 1]
    [0, 1, 0, 0]
    [1, 1, 1, 1]

    Start: (0, 0)
    End: (3, 3)

Explanation:
    1. We use a backtracking approach to explore all possible paths.
    2. The rat can move only right or down, represented by the 'moves' list.
    3. We keep track of visited cells to avoid loops and ensure we don't revisit cells.
    4. When we reach the destination (bottom-right corner), we add the current path to our list of paths.
    5. After exploring a path, we backtrack by marking the cell as unvisited and removing it from the current path.

Time Complexity: O(2^(n^2))
    In the worst case, we might have to explore every possible path in the maze.
    Each cell has two choices (right or down), and there are n^2 cells.

Space Complexity: O(n^2)
    We use a visited array of size n x n, and the recursion stack can go up to n^2 in the worst case.

Recursion Tree (simplified for a 2x2 maze):

               (0,0)
              /     \
           (0,1)    (1,0)
            |         |
          (1,1)     (1,1)

Note: The actual recursion tree for a 4x4 maze would be much larger.

"""

class Solution:
    def __init__(self):
        self.n = 0  # Size of the maze (n x n)
        self.paths = []  # List to store all valid paths
        self.moves = [(0, 1), (1, 0)]  # Possible moves: right and down

    def is_safe(self, maze, x, y) -> bool:
        # Check if x and y are within bounds and the cell is open (1)
        return 0 <= x < self.n and 0 <= y < self.n and maze[x][y] == 1

    def backtrack(self, maze, visited, current_path, x, y):
        # If we've reached the destination (bottom-right corner)
        if x == self.n - 1 and y == self.n - 1:
            # Add a copy of the current path to the list of valid paths
            self.paths.append(current_path[:])
            return
        
        # Explore possible moves (right and down)
        for dx, dy in self.moves:
            next_x, next_y = x + dx, y + dy

            # Check if the next position is safe and not visited
            if self.is_safe(maze, next_x, next_y) and not visited[next_x][next_y]:
                # Mark the next position as visited
                visited[next_x][next_y] = True
                # Add the next position to the current path
                current_path.append((next_x, next_y))
                
                # Recursively explore from the next position
                self.backtrack(maze, visited, current_path, next_x, next_y)
                
                # Backtrack: unmark the position and remove it from the path
                visited[next_x][next_y] = False
                current_path.pop()

    def findPaths(self, maze):
        # Get the size of the maze
        self.n = len(maze)
        # Reset the list of paths
        self.paths = []
        
        # Start from (0, 0) if it's a valid position
        if maze[0][0] == 1:
            # Initialize visited array
            visited = [[False for _ in range(self.n)] for _ in range(self.n)]
            # Mark the starting position as visited
            visited[0][0] = True
            # Start backtracking from the top-left corner
            self.backtrack(maze, visited, [(0, 0)], 0, 0)
        
        # Return all valid paths found
        return self.paths




# Example usage:
solution = Solution()
maze = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
]
paths = solution.findPaths(maze)
print(f"Number of paths found: {len(paths)}")
for i, path in enumerate(paths, 1):
    print(f"Path {i}: {path}")