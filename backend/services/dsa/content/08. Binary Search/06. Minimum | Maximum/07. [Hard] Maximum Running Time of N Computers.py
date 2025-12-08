"""
Problem Statement: Maximum Running Time of N Computers

    You have n computers. You are given the integer n and a 0-indexed integer array batteries where the ith battery can run a computer for batteries[i] minutes. 
    You are interested in running all n computers simultaneously using the given batteries.
    Initially, you can insert at most one battery into each computer. After that and at any integer time moment, 
    you can remove a battery from a computer and insert another battery any number of times. 
    The inserted battery can be a totally new battery or a battery from another computer.
    You may assume that the removing and inserting processes take no time.

    Note that the batteries cannot be recharged.

    Return the maximum number of minutes you can run all the n computers simultaneously.

Time Complexity: O(n log(sum(batteries))), where n is the length of the batteries array.
    - The binary search takes O(log(sum(batteries))) iterations.
    - In each iteration, we iterate through the batteries array once, which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

This solution uses a binary search approach combined with a greedy algorithm to efficiently find the maximum running time.

Constraints:
    * 1 <= n <= batteries.length <= 10^5
    * 1 <= batteries[i] <= 10^9

"""

from typing import List

def can_run_for_time(n: int, batteries: List[int], time: int) -> bool:
    total_power = 0
    for battery in batteries:
        if battery < time:
            # If battery capacity is less than time, use all of it
            total_power += battery
        else:
            # If battery capacity is more than time, we only need 'time' amount from it
            total_power += time
        if total_power >= n * time:
            # If we have enough power to run all computers for 'time', return True
            return True
    # If we don't have enough power after using all batteries, return False
    return False

def max_running_time(n: int, batteries: List[int]) -> int:

    # Initialize binary search range
    left = 0
    right = sum(batteries) // n  # Maximum possible running time

    while left < right:
        # Calculate the middle point, rounding up to avoid infinite loop
        mid = left + (right - left + 1) // 2
        
        if can_run_for_time(n, batteries, mid):
            # If we can run for this time, try a longer time
            left = mid
        else:
            # If we can't run for this time, try a shorter time
            right = mid - 1

    # Return the maximum time we can run all computers
    return left

# Example usage
if __name__ == "__main__":
    # Example 1
    n1 = 2
    batteries1 = [3, 3, 3]
    result1 = max_running_time(n1, batteries1)
    print(f"Example 1 - Input: n = {n1}, batteries = {batteries1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    n2 = 2
    batteries2 = [1, 1, 1, 1]
    result2 = max_running_time(n2, batteries2)
    print(f"Example 2 - Input: n = {n2}, batteries = {batteries2}")
    print(f"Output: {result2}")