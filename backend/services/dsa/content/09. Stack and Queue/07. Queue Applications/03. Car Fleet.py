"""
Car Fleet Problem

    There are n cars traveling to a target destination. Each car has a starting position and speed.
    A car can catch up to another car but cannot pass it. When cars catch up, they form a fleet
    moving at the speed of the slowest car in the fleet.

    Task: Determine the number of car fleets that will arrive at the destination.

Input:
    - target: int, the destination mile
    - position: List[int], starting positions of cars
    - speed: List[int], speeds of cars

Output:
    - int: Number of car fleets arriving at the destination

Time Complexity: O(n log n), where n is the number of cars
Space Complexity: O(n) for storing the cars and the stack

Approach:
    1. Sort cars by position in descending order
    2. Calculate time to reach target for each car
    3. Use a stack to keep track of fleets
    4. Compare each car's time with the fleet in front
    5. Count the number of fleets in the stack

Detailed Explanation:
    1. Sorting:
        - We sort the cars by their positions in descending order.
        - This allows us to process cars from right to left (closest to the target first).

    2. Time Calculation:
        - For each car, we calculate the time it will take to reach the target.
        - Time = (target - position) / speed

    3. Stack Usage:
        - We use a stack to keep track of the time each car or fleet will take to reach the target.
        - The stack represents separate fleets.

    4. Fleet Formation:
        - If a car takes longer to reach the target than the car/fleet in front (top of stack),
            it forms a new fleet (push to stack).
        - If it takes less or equal time, it will catch up and join the fleet in front (don't push).

    5. Result:
        - The number of elements in the stack at the end represents the number of separate fleets.

    This approach efficiently solves the problem without needing to simulate the actual movement of cars.
    It works because we only need to know if cars will form fleets, not the exact positions where they meet.
"""


from typing import List 
class Solution:
    
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        # Combine position and speed into tuples and sort by position in descending order
        cars = sorted(zip(position, speed), reverse=True)
        
        stack = []
        for pos, spd in cars:
            # Calculate time to reach target for current car
            time = (target - pos) / spd
            
            # If stack is empty or current car takes longer than the car in front,
            # it forms a new fleet
            if not stack or time > stack[-1]:
                stack.append(time)
        
        # The number of elements in the stack is the number of fleets
        return len(stack)

# Test the solution
solution = Solution()

# Example 1
target1 = 12
position1 = [10,8,0,5,3]
speed1 = [2,4,1,1,3]
result1 = solution.carFleet(target1, position1, speed1)
print(f"Example 1: Input: target = {target1}, position = {position1}, speed = {speed1}")
print(f"Output: {result1}")

# Example 2
target2 = 10
position2 = [3]
speed2 = [3]
result2 = solution.carFleet(target2, position2, speed2)
print(f"\nExample 2: Input: target = {target2}, position = {position2}, speed = {speed2}")
print(f"Output: {result2}")

# Example 3
target3 = 100
position3 = [0,2,4]
speed3 = [4,2,1]
result3 = solution.carFleet(target3, position3, speed3)
print(f"\nExample 3: Input: target = {target3}, position = {position3}, speed = {speed3}")
print(f"Output: {result3}")
