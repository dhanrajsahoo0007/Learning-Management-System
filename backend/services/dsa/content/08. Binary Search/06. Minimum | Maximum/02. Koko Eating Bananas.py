"""
Problem Statement: Koko Eating Bananas
    *  Find the Smallest Divisor Given a Threshold
    
    Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.
    Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.
    Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.
    
    Return the minimum integer k such that she can eat all the bananas within h hours.

Example 1:
    Input: piles = [3,6,7,11], h = 8
    Output: 4

Example 2:
    Input: piles = [30,11,23,4,20], h = 5
    Output: 30

Example 3:
    Input: piles = [30,11,23,4,20], h = 6
    Output: 23

Constraints:
    * 1 <= piles.length <= 10^4
    * piles.length <= h <= 10^9
    * 1 <= piles[i] <= 10^9

Solution Explanation:
    The solution uses a binary search approach to find the minimum eating speed:

    1. We define a helper function 'can_eat_all' that checks if Koko can eat all bananas within h hours at a given eating speed.
    2. In the main function 'min_eating_speed', we perform a binary search on the possible eating speeds:
        - The minimum possible speed is 1.
        - The maximum possible speed is the maximum number of bananas in any pile.
    3. We keep narrowing down our search range until we find the minimum speed that allows Koko to eat all bananas within h hours.

Time Complexity: O(n * log(max(piles))), where n is the length of the piles array.
    - The binary search takes O(log(max(piles))) iterations.
    - In each iteration, we call the 'can_eat_all' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

"""

from typing import List
import math

class Solution:
    def can_eat_all(self, piles: List[int], given_speed: int, totalTrips: int) -> bool:
        # Initialize the variable to store the total hours needed
        actual_hours = 0
        
        # Iterate through each pile of bananas
        for pile in piles:
            # Calculate the hours needed for the current pile and add to total
            # math.ceil() is used because Koko needs a full hour even if she
            # doesn't use the entire hour (e.g., 3.2 hours becomes 4 hours)
            actual_hours += math.ceil(pile / given_speed)
        
        # Check if Koko can eat all bananas within the given time limit
        # Return True if she can, False otherwise
        return actual_hours <= totalTrips

    def min_eating_speed(self, piles: List[int], totalTrips: int) -> int:
        # Initialize the binary search range
        left = 1  # Minimum possible speed
        right = max(piles)  # Maximum possible speed

        while left < right:
            # Calculate the middle speed
            mid_speed = left + (right - left) // 2

            # Check if Koko can eat all bananas at mid_speed
            if self.can_eat_all(piles, mid_speed, totalTrips):
                # If possible, try to minimize the speed further
                right = mid_speed
            else:
                # If not possible, increase the lower bound
                left = mid_speed + 1

        # Return the minimum eating speed required
        return left

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    piles1 = [3, 6, 7, 11]
    h1 = 8
    result1 = solution.min_eating_speed(piles1, h1)
    print(f"Example 1 - Input: piles = {piles1}, h = {h1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    piles2 = [30, 11, 23, 4, 20]
    h2 = 5
    result2 = solution.min_eating_speed(piles2, h2)
    print(f"Example 2 - Input: piles = {piles2}, h = {h2}")
    print(f"Output: {result2}")
    print()

    # Example 3
    piles3 = [30, 11, 23, 4, 20]
    h3 = 6
    result3 = solution.min_eating_speed(piles3, h3)
    print(f"Example 3 - Input: piles = {piles3}, h = {h3}")
    print(f"Output: {result3}")