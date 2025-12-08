"""
Problem Statement:

    We are given an array 'asteroids' of integers representing asteroids in a row.
    For each asteroid, the absolute value represents its size, and the sign represents its direction 
    (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

    Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one 
    will explode. If both are the same size, both will explode. Two asteroids moving in the same 
    direction will never meet.

Constraints:
    * 2 <= asteroids.length <= 10^4
    * -1000 <= asteroids[i] <= 1000
    * asteroids[i] != 0

Time Complexity: O(n)
    - We iterate through each asteroid once in the outer loop: O(n)
    - Each asteroid can be pushed and popped from the stack at most once: O(n)
    - Therefore, the overall time complexity is O(n)

Space Complexity: O(n)
    - In the worst case, when no collisions occur, we might store all asteroids in the stack
    - Therefore, the space complexity is O(n)

where n is the number of asteroids in the input list.
"""



from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []  # Stack to keep track of surviving asteroids

        for asteroid in asteroids:
            # Keep checking for collisions as long as there are asteroids in the stack,
            # *** as we are checking with a while loop always continue or break
            while stack and asteroid < 0 < stack[-1]:
                if stack[-1] < -asteroid:
                    # If the asteroid in the stack is smaller, it gets destroyed
                    # Remove it and continue checking the next asteroid in the stack
                    stack.pop()
                    continue
                elif stack[-1] == -asteroid:
                    # If both asteroids are the same size, both get destroyed
                    # Remove the one from the stack and stop checking (current one is also destroyed)
                    stack.pop()
                    break
                else:
                    # If the asteroid in the stack is larger, the current asteroid is destroyed
                    # Stop checking and move to the next asteroid in the input list
                    break
            else:
                # This else belongs to the while loop. It executes if the loop condition is false from the start
                # or if the loop completes without breaking.
                # In other words, if there were no collisions or the current asteroid survived all collisions,
                # add it to the stack
                stack.append(asteroid)

        return stack  # The stack now contains all surviving asteroids


# Test cases
def run_tests():
    solution = Solution()
    
    test_cases = [
        [5,10,-5],
        [8,-8],
        [10,2,-5],
        [-2,-1,1,2],
        [1,-2,-2,1],
        [-2,-2,1,-2],
        [1,-1,-2,-2],
        [1,2,3,-3,4,-1],
        [-1,-2,3,4,-5],
    ]
    
    for i, input_asteroids in enumerate(test_cases, 1):
        result = solution.asteroidCollision(input_asteroids)
        print(f"Test case {i}:")
        print(f"  Input:  {input_asteroids}")
        print(f"  Output: {result}")
        print()

if __name__ == "__main__":
    run_tests()