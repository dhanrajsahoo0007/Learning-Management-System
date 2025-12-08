"""
Problem Statement:  Minimum Time to Complete Trips
                    * similar to the Koko Eating Bananas problem 

    You are given an array 'time' where time[i] denotes the time taken by the ith bus to complete one trip.
    Each bus can make multiple trips successively; that is, the next trip can start immediately after completing the current trip. 
    
    Also, each bus operates independently; that is, the trips of one bus do not influence the trips of any other bus.
    You are also given an integer 'totalTrips', which denotes the number of trips all buses should make in total. 
    
    Return the minimum time required for all buses to complete at least 'totalTrips' trips.

Example 1:
    Input: time = [1,2,3], totalTrips = 5
    Output: 3
    Explanation:
        - At time t = 1, the number of trips completed by each bus are [1,0,0]. 
            The total number of trips completed is 1 + 0 + 0 = 1.
        - At time t = 2, the number of trips completed by each bus are [2,1,0]. 
            The total number of trips completed is 2 + 1 + 0 = 3.
        - At time t = 3, the number of trips completed by each bus are [3,1,1]. 
            The total number of trips completed is 3 + 1 + 1 = 5.
            So the minimum time needed for all buses to complete at least 5 trips is 3.

Example 2:
    Input: time = [2], totalTrips = 1
    Output: 2
    Explanation:
        There is only one bus, and it will complete its first trip at t = 2.
        So the minimum time needed to complete 1 trip is 2.

Constraints:
    * 1 <= time.length <= 10^5
    * 1 <= time[i], totalTrips <= 10^7

Solution Explanation:
The solution uses a binary search approach to find the minimum time required:

    1. We define a helper function 'possible' that checks if it's possible to complete the required number of trips in a given time.
    2. In the main function 'minimumTime', we perform a binary search on the time range:
        - The minimum possible time is 1.
        - The maximum possible time is the minimum time of any bus multiplied by the total trips required.
    3. We keep narrowing down our search range until we find the minimum time that satisfies the condition.

Time Complexity: O(n * log(min(time) * totalTrips)), where n is the length of the time array.
- The binary search takes O(log(min(time) * totalTrips)) iterations.
- In each iteration, we call the 'possible' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.


"""

from typing import List

class Solution:
    def possible(self, time: List[int], given_time: int, total_trips: int) -> bool:
        # Calculate the total number of trips that can be completed in the given time
        actual_trips = 0
        for t in time:
            actual_trips += given_time // t
        
        # Check if the actual trips are greater than or equal to the required total trips
        return actual_trips >= total_trips

    def minimumTime(self, time: List[int], totalTrips: int) -> int:
        # Initialize the binary search range
        left = 1  # Minimum possible time
        right = min(time) * totalTrips  # Maximum possible time

        while left < right:
            # Calculate the middle point
            mid_time = left + (right - left) // 2

            # Check if it's possible to complete the required trips in mid_time
            if self.possible(time, mid_time, totalTrips):
                # If possible, try to minimize the time further
                right = mid_time
            else:
                # If not possible, increase the lower bound
                left = mid_time + 1

        # Return the minimum time required
        return left

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    time1 = [1, 2, 3]
    totalTrips1 = 5
    result1 = solution.minimumTime(time1, totalTrips1)
    print(f"Example 1 - Input: time = {time1}, totalTrips = {totalTrips1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    time2 = [2]
    totalTrips2 = 1
    result2 = solution.minimumTime(time2, totalTrips2)
    print(f"Example 2 - Input: time = {time2}, totalTrips = {totalTrips2}")
    print(f"Output: {result2}")
    print()

    # Additional example
    time3 = [5, 10, 15]
    totalTrips3 = 9
    result3 = solution.minimumTime(time3, totalTrips3)
    print(f"Additional Example - Input: time = {time3}, totalTrips = {totalTrips3}")
    print(f"Output: {result3}")