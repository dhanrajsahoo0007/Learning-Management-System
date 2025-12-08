template.py

def grid_traversal_pattern(grid):
    def backtrack(row, col):
        if invalid(row, col):
            return False
        if is_goal(row, col):
            return True
        
        for direction in directions:
            new_row, new_col = row + direction[0], col + direction[1]
            if backtrack(new_row, new_col):
                return True
        return False

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Right, Down, Left, Up
    return backtrack(0, 0)