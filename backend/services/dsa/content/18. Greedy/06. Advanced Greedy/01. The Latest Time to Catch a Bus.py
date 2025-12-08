from typing import List

class Solution:
    def latestTimeCatchTheBus(self, buses: List[int], passengers: List[int], capacity: int) -> int:
        # Sort buses and passengers in ascending order
        buses.sort()
        passengers.sort()
        
        # Initialize variables
        n, m = len(buses), len(passengers)
        j = 0  # Pointer for passengers
        count = 0  # Count of passengers on current bus
        
        # Process each bus
        for i in range(n):
            count = 0
            # Load passengers onto the current bus
            while j < m and passengers[j] <= buses[i] and count < capacity:
                j += 1
                count += 1
        
        # Find the latest time to arrive
        latest_time = buses[-1] if count < capacity else passengers[j-1]
        
        # Check if we can arrive at any time before the last passenger
        j -= 1
        while j >= 0 and latest_time == passengers[j]:
            latest_time -= 1
            j -= 1
        
        return latest_time


class Solution:
    def latestTimeCatchTheBus(self, buses: List[int], passengers: List[int], capacity: int) -> int:
        """
        Find the last time you can come but also get onto the bus
        Sort the buses array and passengers array.

        Now consider a bus departing at time t1 so as passengers array is also sorted just iterate over passengers array and look which all passengers can travel by this bus. Suppose a passenger arriving at time t2 can travel by this bus , then t2-1 can be a possible answer , if and only if there is not any passenger arriving at t2-1.

        Now , there can be a condition that there are less passengers than the capacity which can travel by the bus departing at t1.
        For ex - bus departs at t=10 and has capacity 2
        but there is only 1 passenger to travel. So departure time of the bus can be a possible answer.
        But what if that 1 passenger has arrival time equal to departure time of the bus then departure time cannot be our answer.
        """
        buses.sort()
        passengers.sort()

        num_buses = len(buses)
        num_passengers = len(passengers)
        b,p = 0,0
        prev = -1
        ans = 0

        for current_bus_departure in buses:
            current_bus_capacity = 0
            while p < num_passengers and passengers[p] <= current_bus_departure and current_bus_capacity < capacity:
                if passengers[p]-1 != prev:
                    ans = passengers[p]-1
                prev = passengers[p]
                p += 1
                current_bus_capacity += 1
            if (current_bus_capacity < capacity and prev != current_bus_departure):
                ans = current_bus_departure
        return ans



# Test the solution
if __name__ == "__main__":
    sol = Solution()
    
    # Test case 1
    buses1 = [10, 20]
    passengers1 = [2, 17, 18, 19]
    capacity1 = 2
    print(f"Test case 1 result: {sol.latestTimeCatchTheBus(buses1, passengers1, capacity1)}")
    
    # Test case 2
    buses2 = [20, 30, 10]
    passengers2 = [19, 13, 26, 4, 25, 11, 21]
    capacity2 = 2
    print(f"Test case 2 result: {sol.latestTimeCatchTheBus(buses2, passengers2, capacity2)}")