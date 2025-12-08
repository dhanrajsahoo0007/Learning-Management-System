"""

Problem Statement: Magnetic Force Between Two Balls

    In the universe Earth C-137, Rick discovered a special form of magnetic force between two balls if they are put in his new invented basket. 
    Rick has n empty baskets, the ith basket is at position[i], Morty has m balls and needs to distribute the balls into the baskets 
    such that the minimum magnetic force between any two balls is maximum.
    Rick stated that magnetic force between two different balls at positions x and y is |x - y|.
    
    Given the integer array position and the integer m, return the required force.

Examples:
    Example 1:
    Input: position = [1,2,3,4,7], m = 3
    Output: 3
    Explanation: Distributing the 3 balls into baskets 1, 4 and 7 will make the magnetic force between ball pairs [3, 3, 6]. 
                 The minimum magnetic force is 3. We cannot achieve a larger minimum magnetic force than 3.

    Example 2:
    Input: position = [5,4,3,2,1,1000000000], m = 2
    Output: 999999999
    Explanation: We can use baskets 1 and 1000000000.

Constraints:
    * n == position.length
    * 2 <= n <= 10^5
    * 1 <= position[i] <= 10^9
    * All integers in position are distinct.
    * 2 <= m <= position.length

Solution Explanation:
    The solution uses a binary search approach to find the maximum minimum force:

    1. We define a helper function 'possible_to_place' that checks if it's possible to place m balls with a given minimum force.
    2. In the main function 'maxDistance', we perform a binary search on the possible range of forces:
       - The minimum possible force is 1.
       - The maximum possible force is the difference between the largest and smallest positions.
    3. We keep narrowing down our search range until we find the maximum valid force.

Time Complexity: O(n * log(max_position)), where n is the number of positions.
    - Sorting the positions takes O(n log n) time.
    - The binary search takes O(log(max_position)) iterations.
    - In each iteration, we call the 'possible_to_place' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space (not counting the input array).
"""

from typing import List

class Solution:
    def possible_to_place(self, force: int, position: List[int], m: int) -> bool:
        prev = position[0]
        count_balls = 1
        for i in range(1, len(position)):
            curr = position[i]
            if curr - prev >= force:
                count_balls += 1
                prev = curr
            if count_balls == m:
                break
        return count_balls == m

    def maxDistance(self, position: List[int], m: int) -> int:
        n = len(position)
        position.sort()
        min_force = 1
        max_force = position[-1] - position[0]  # Maximum possible force
        result = 0
        
        while min_force <= max_force:
            mid_force = min_force + (max_force - min_force) // 2
            if self.possible_to_place(mid_force, position, m):
                result = mid_force
                min_force = mid_force + 1
            else:
                max_force = mid_force - 1
        
        return result



# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    position1 = [1,2,3,4,7]
    m1 = 3
    result1 = solution.maxDistance(position1, m1)
    print(f"Example 1 - Input: position = {position1}, m = {m1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    position2 = [5,4,3,2,1,1000000000]
    m2 = 2
    result2 = solution.maxDistance(position2, m2)
    print(f"Example 2 - Input: position = {position2}, m = {m2}")
    print(f"Output: {result2}")