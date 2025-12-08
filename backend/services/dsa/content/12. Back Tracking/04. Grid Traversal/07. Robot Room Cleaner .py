"""
Problem: Robot Room Cleaner

    You are controlling a robot that is located somewhere in a room. 
    The room is modeled as an m x n binary grid where 0 represents a wall and 1 represents an empty slot.

    The robot starts at an unknown location in the room that is guaranteed to be empty, 
    and you do not have access to the grid, but you can move the robot using the given API Robot.

You task is to clean the entire room (i.e., clean every empty cell in the room). 

    The robot with the following API is given to you:
        - move(): Returns true if the cell in front is open and robot moves into the cell; false otherwise.
        - turnLeft(): Robot will stay in the same cell but rotate 90 degrees counterclockwise.
        - turnRight(): Robot will stay in the same cell but rotate 90 degrees clockwise.
        - clean(): Clean the current cell.

Time Complexity: O(N - M), where N is the number of cells in the room and M is the number of obstacles.
Space Complexity: O(N - M) for the visited set and recursion stack.

Explanation:
    This solution uses a backtracking approach with DFS (Depth-First Search) to explore and clean the room.
    The robot moves in four directions (up, right, down, left) and uses a visited set to keep track of cleaned cells.
    When the robot can't move forward, it backtracks and tries other directions.

Example:
Consider a 5x5 room with some obstacles:
    1 1 1 1 0
    1 1 0 1 0
    1 1 1 1 1
    0 1 0 0 1
    0 1 1 1 1

Where 1 represents an empty cell and 0 represents an obstacle.
The robot starts at position (1, 3), facing up.

Step-by-step cleaning process:
    1. Clean (1, 3)
    2. Move up to (0, 3), clean
    3. Try to move up (blocked), turn right
    4. Move right to (0, 4), clean
    5. Try all directions (blocked), go back to (0, 3)
    6. Move down to (1, 3), already cleaned
    7. Move left to (1, 2), clean

"""

class Solution:
    def __init__(self):
        # Define the four directions: up, right, down, left
        self.directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
        
        # Set to keep track of visited (cleaned) cells
        self.visited = set()

    def cleanRoom(self, robot):
        def go_back():
            # Helper function to move the robot back to the previous cell
            robot.turnRight()
            robot.turnRight()
            robot.move()
            robot.turnRight()
            robot.turnRight()
        
        def backtrack(x, y, direction):
            # Recursive function to explore and clean the room

            # Mark current cell as visited and clean it
            self.visited.add((x, y))
            robot.clean()
            
            # Explore all four directions
            for i in range(4):
                # Calculate new direction and coordinates
                new_direction = (direction + i) % 4
                new_x = x + self.directions[new_direction][0]
                new_y = y + self.directions[new_direction][1]
                
                # If the new cell is not visited and the robot can move there
                if (new_x, new_y) not in self.visited and robot.move():
                    # Recursively clean from the new cell
                    backtrack(new_x, new_y, new_direction)
                    # Move back to the previous cell
                    go_back()
                
                # Turn right to explore the next direction
                robot.turnRight()
        
        # Start the cleaning process from (0, 0) facing up
        backtrack(0, 0, 0)