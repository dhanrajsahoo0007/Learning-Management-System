"""
Problem Statement:
    You are given n ropes of different lengths. The task is to connect these ropes into one rope. 
    The cost of connecting two ropes is equal to the sum of their lengths. The goal is to connect all the ropes with the minimum total cost.

    Example:
        Let's say we have four ropes with the following lengths: [4, 3, 2, 6]
        We need to connect these ropes in a way that minimizes the total cost. Here's how it might work:

First connection:
    Choose the two shortest ropes: 2 and 3
    Cost of connecting: 2 + 3 = 5
    Remaining ropes: [4, 5, 6]

Second connection:
    Choose the two shortest ropes: 4 and 5
    Cost of connecting: 4 + 5 = 9
    Remaining ropes: [6, 9]

Final connection:
    Connect the remaining ropes: 6 and 9
    Cost of connecting: 6 + 9 = 15

Total cost: 5 + 9 + 15 = 29

This approach of always choosing the two shortest ropes to connect next results in the minimum total cost.
If we had chosen a different order, say connecting 6 and 4 first, then 3 and 2, and finally these two results, the cost would be:
(6 + 4) + (3 + 2) + (10 + 5) = 10 + 5 + 15 = 30 ,Which is higher than our optimal solution.

"""
import heapq
def minimum_cost_to_connect_ropes(ropes):
    # Create a min heap from the list of rope lengths
    heapq.heapify(ropes)
    
    total_cost = 0
    
    # Continue until we have only one rope left
    while len(ropes) > 1:
        # Extract the two shortest ropes
        first = heapq.heappop(ropes)
        second = heapq.heappop(ropes)
        
        # Connect these ropes and calculate cost
        current_cost = first + second
        total_cost += current_cost
        
        # Add the new rope back to the heap
        heapq.heappush(ropes, current_cost)
    
    return total_cost

# Example usage
ropes = [1,5,4, 3, 2, 6]
result = minimum_cost_to_connect_ropes(ropes)
print(f"The minimum cost to connect the ropes is: {result}")