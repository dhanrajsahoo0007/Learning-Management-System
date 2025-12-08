"""
Problem Statement: Capacity To Ship Packages Within D Days

    A conveyor belt has packages that must be shipped from one port to another within 'days' days.
    The ith package on the conveyor belt has a weight of weights[i]. 
    Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.

    Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within 'days' days.

Time Complexity: O(n * log(sum(weights))), where n is the length of the weights array.
        - The binary search takes O(log(sum(weights))) iterations.
        - In each iteration, we call the can_ship_within_days function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

Constraints:

    1 <= days <= weights.length <= 5 * 104
    1 <= weights[i] <= 500
"""

from typing import List

def can_ship_within_days(weights: List[int], days: int, capacity: int) -> bool:
    """
    Helper function to check if all packages can be shipped within the given days using the specified capacity.
    """
    current_load = 0
    days_needed = 1
    for weight in weights:
        if current_load + weight > capacity:
            # If adding this package exceeds the capacity, start a new day
            days_needed += 1
            current_load = weight
        else:
            # Add the package to the current day's load
            current_load += weight
        if days_needed > days:
            # If we need more days than allowed, return False
            return False
    return True

def ship_within_days(weights: List[int], days: int) -> int:
    """
    Main function to find the minimum ship capacity required to ship all packages within the given days.
    """
    # Initialize the binary search range
    left = max(weights)  # Minimum capacity is the weight of the heaviest package
    right = sum(weights)  # Maximum capacity is the sum of all weights

    while left < right:
        # Calculate the middle capacity
        mid = left + (right - left) // 2
        
        if can_ship_within_days(weights, days, mid):
            # If we can ship with this capacity, try a lower capacity
            right = mid
        else:
            # If we can't ship with this capacity, try a higher capacity
            left = mid + 1

    # Return the minimum capacity that allows shipping within the given days
    return left

# Example usage
if __name__ == "__main__":
    # Example 1
    weights1 = [1,2,3,4,5,6,7,8,9,10]
    days1 = 5
    result1 = ship_within_days(weights1, days1)
    print(f"Example 1 - Input: weights = {weights1}, days = {days1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    weights2 = [3,2,2,4,1,4]
    days2 = 3
    result2 = ship_within_days(weights2, days2)
    print(f"Example 2 - Input: weights = {weights2}, days = {days2}")
    print(f"Output: {result2}")
    print()

    # Example 3
    weights3 = [1,2,3,1,1]
    days3 = 4
    result3 = ship_within_days(weights3, days3)
    print(f"Example 3 - Input: weights = {weights3}, days = {days3}")
    print(f"Output: {result3}")