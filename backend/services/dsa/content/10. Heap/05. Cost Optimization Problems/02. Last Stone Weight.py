"""
    Problem Statement: Last Stone Weight

    You are given an array of integers stones where stones[i] is the weight of the ith stone.
    We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together.
    Suppose the heaviest two stones have weights x and y with x <= y. The result of this smash is:
        * If x == y, both stones are destroyed, and
        * If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.
    At the end of the game, there is at most one stone left.
    Return the weight of the last remaining stone. If there are no stones left, return 0.
 
Example 1:
    Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation: 
    We combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,
    we combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,
    we combine 2 and 1 to get 1 so the array converts to [1,1,1] then,
    we combine 1 and 1 to get 0 so the array converts to [1] then that's the value o

Solution:
    Step- 1: We create a max heap by negating all values in the stones list. Python's heapq module implements a min heap, so we use negative values to simulate a max heap.
    Step- 2: We enter a loop that continues while there are at least two stones in the heap:
    Step- 3: We pop the two heaviest stones (remembering to negate them back to positive values).
              If the stones have different weights, we calculate the difference and push it back onto the heap (as a negative value).
    Step- 4: After the loop ends, we check if there's a stone left in the heap:    
    Step- 5: If there is, we return its weight (negating it back to positive).
             If the heap is empty, we return 0.    


Time complexity of O(n log n), where n is the number of stones. 
    Each heap operation (push or pop) takes O(log n) time, and in the worst case, we might need to do this for all n stones.

Space complexity is O(n) for the heap.

"""

import heapq

def lastStoneWeight(stones):
    # Convert to max heap by negating values
    max_heap = [-s for s in stones]
    heapq.heapify(max_heap)
    
    while len(max_heap) > 1:
        # Get the two heaviest stones
        y = -heapq.heappop(max_heap)
        x = -heapq.heappop(max_heap)
        
        # Smash the stones
        if x != y:
            heapq.heappush(max_heap, -(y - x))
    
    # Return the last stone weight or 0 if no stones left
    return -max_heap[0] if max_heap else 0

# Example usage
stones = [2,7,4,1,8,1]
result = lastStoneWeight(stones)
print(f"Weight of the last remaining stone: {result}")


