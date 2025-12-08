"""
Problem Statement:
    We have a car with a certain capacity of empty seats. The car only drives east.
    We're given an array 'trips' where each trip is [numPassengers, start, end].
    We need to determine if it's possible to pick up and drop off all passengers
    for all given trips without exceeding the car's capacity at any point.

Approach:
    We use a min heap to keep track of trip end times and their corresponding
    number of passengers. This allows us to efficiently manage passenger
    pickups and dropoffs as we move along the route.

Explanation of the algorithm:
    1. Sort trips by start location to process them in chronological order.
    2. Iterate through each trip:
        a. Remove passengers from any trips that have ended before or at the current start time.
        b. Add the current trip's passengers to the car.
        c. Check if the current number of passengers exceeds the car's capacity.
        d. Add the current trip's end time and passenger count to the min heap.
    3. If we process all trips without exceeding capacity, return True.

Time Complexity Analysis:
    - Sorting trips: O(n log n)
    - Processing trips: O(n log n) due to heap operations
    Overall: O(n log n)

Space Complexity Analysis:
    - Sorted trips: O(n)
    - Heap: O(n) in the worst case
    Overall: O(n)

where n is the number of trips
"""
import heapq
from typing import List

class Solution:
    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:
        # Sort trips by start location for chronological processing
        trips.sort(key=lambda x: x[1])
        
        heap = []  # Min heap to store (end_time, num_passengers)
        passengers = 0  # Current number of passengers in the car
        
        for num_passengers, start, end in trips:
            # Remove passengers from trips that have ended
            while heap and heap[0][0] <= start:
                _, drop_passengers = heapq.heappop(heap)
                passengers -= drop_passengers
            
            # Add current trip's passengers
            passengers += num_passengers
            
            # Check if capacity is exceeded
            if passengers > capacity:
                return False
            
            # Add end time and number of passengers to the heap
            heapq.heappush(heap, (end, num_passengers))
        
        # If we've processed all trips without exceeding capacity, it's possible
        return True

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    trips1 = [[2,1,5],[3,3,7]]
    capacity1 = 4
    print(f"Example 1: {solution.carPooling(trips1, capacity1)}")  # Expected: False

    # Example 2
    trips2 = [[2,1,5],[3,3,7]]
    capacity2 = 5
    print(f"Example 2: {solution.carPooling(trips2, capacity2)}")  # Expected: True

    # Example 3
    trips3 = [[2,1,5],[3,5,7]]
    capacity3 = 3
    print(f"Example 3: {solution.carPooling(trips3, capacity3)}")  # Expected: True

    # Example 4
    trips4 = [[3,2,7],[3,7,9],[8,3,9]]
    capacity4 = 11
    print(f"Example 4: {solution.carPooling(trips4, capacity4)}")  # Expected: True

    # Example 5
    trips5 = [[2,1,5],[3,3,7],[4,4,8],[2,4,7]]
    capacity5 = 12
    print(f"Example 5: {solution.carPooling(trips5, capacity5)}")  # Expected: True

    # Example 6
    trips6 = [[2,1,5],[3,3,7],[4,4,8],[2,4,7]]
    capacity6 = 11
    print(f"Example 6: {solution.carPooling(trips6, capacity6)}")  # Expected: False