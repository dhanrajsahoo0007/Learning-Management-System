"""
Problem Statement: Minimum Speed to Arrive on Time

        You are given a floating-point number 'hour', representing the amount of time you have to reach the office. 
        To commute to the office, you must take 'n' trains in sequential order. 
        You are also given an integer array 'dist' of length 'n', where dist[i] describes the distance (in kilometers) of the ith train ride.
        Each train can only depart at an integer hour, so you may need to wait in between each train ride. 
        For example, if the 1st train ride takes 1.5 hours, you must wait for an additional 0.5 hours before you can depart on the 2nd train ride at the 2 hour mark.

        Return the minimum positive integer speed (in kilometers per hour) that all the trains must travel at for you to reach the office on time, or -1 if it is impossible to be on time.

Time Complexity: O(n * log(10^7)), where n is the length of the dist array.
        - The binary search takes O(log(10^7)) iterations.
        - In each iteration, we call the can_reach_on_time function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

Solution Explanation:
    1. We use a binary search approach to find the minimum speed required.
    2. We define a helper function 'can_reach_on_time' that checks if we can reach the destination on time at a given speed.
    3. In the main function 'minSpeedOnTime', we perform binary search on possible speeds:
        - The minimum possible speed is 1.
        - The maximum possible speed is 10^7 (as per the problem constraints).
    4. We keep narrowing down our search range until we find the minimum speed that allows us to reach on time.
    5. We return -1 if it's impossible to reach on time (when the available time is less than or equal to the number of train rides minus 1).

Constraints:

    n == dist.length
    1 <= n <= 105
    1 <= dist[i] <= 105
    1 <= hour <= 109
    There will be at most two digits after the decimal point in hour.

"""

from typing import List
import math

class Solution:
    def can_reach_on_time(self, dist: List[int], hour: float, speed: int) -> bool:
        total_time = 0
        for i in range(len(dist) - 1):
            total_time += math.ceil(dist[i] / speed)
        total_time += dist[-1] / speed
        return total_time <= hour

    def minSpeedOnTime(self, dist: List[int], hour: float) -> int:
        if hour <= len(dist) - 1:
            return -1

        left, right = 1, 10**7

        while left < right:
            mid = left + (right - left) // 2
            if self.can_reach_on_time(dist, hour, mid):
                right = mid
            else:
                left = mid + 1

        return left

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    dist1 = [1, 3, 2]
    hour1 = 6
    result1 = solution.minSpeedOnTime(dist1, hour1)
    print(f"Example 1 - Input: dist = {dist1}, hour = {hour1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    dist2 = [1, 3, 2]
    hour2 = 2.7
    result2 = solution.minSpeedOnTime(dist2, hour2)
    print(f"Example 2 - Input: dist = {dist2}, hour = {hour2}")
    print(f"Output: {result2}")
    print()

    # Example 3
    dist3 = [1, 3, 2]
    hour3 = 1.9
    result3 = solution.minSpeedOnTime(dist3, hour3)
    print(f"Example 3 - Input: dist = {dist3}, hour = {hour3}")
    print(f"Output: {result3}")