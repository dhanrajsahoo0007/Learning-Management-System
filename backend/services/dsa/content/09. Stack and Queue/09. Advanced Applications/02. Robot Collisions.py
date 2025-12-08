from typing import List

class Solution:
    def process_data(self, positions, healths, directions):
        # Create a list of tuples: (position, health, direction, original_index)
        data = list(zip(positions, healths, directions, range(len(positions))))
        
        # Sort the data based on position (first element of each tuple)
        sorted_data = sorted(data, key=lambda x: x[0])
        
        # Create the final list
        result = []
        for _, health, direction, index in sorted_data:
            if direction == 'R':
                result.append((health, index))
            elif direction == 'L':
                result.append((-health, index))
        
        return result

    def survivedRobotsHealths(self, positions: List[int], healths: List[int], directions: str) -> List[int]:
        processed_data = self.process_data(positions, healths, directions)
        stack = []

        for robot, original_index in processed_data:
            # Keep checking for collisions as long as there are robots in the stack
            while stack and robot < 0 < stack[-1][0]:
                if abs(stack[-1][0]) < abs(robot):
                    # If the robot in the stack has lower health, it gets destroyed
                    stack.pop()
                    continue
                elif abs(stack[-1][0]) == abs(robot):
                    # If both robots have the same health, both get destroyed
                    stack.pop()
                    break
                else:
                    # If the robot in the stack has higher health, it loses 1 health and the current robot is destroyed
                    top_robot, top_index = stack.pop()
                    new_health = abs(top_robot) - 1
                    if new_health > 0:
                        stack.append((new_health if top_robot > 0 else -new_health, top_index))
                    break
            else:
                # If there were no collisions or the current robot survived all collisions,
                # add it to the stack
                stack.append((robot, original_index))

        # Prepare the result
        result = [0] * len(positions)
        for health, index in stack:
            result[index] = abs(health)

        # Return non-zero health values
        return [h for h in result if h > 0]

# Test cases
solution = Solution()
print(solution.survivedRobotsHealths([5,4,3,2,1], [2,17,9,15,10], "RRRRR"))  # Expected: [2,17,9,15,10]
print(solution.survivedRobotsHealths([3,5,2,6], [10,10,15,12], "RLRL"))  # Expected: [14]
print(solution.survivedRobotsHealths([1,2,5,6], [10,10,11,11], "RLRL"))  # Expected: []