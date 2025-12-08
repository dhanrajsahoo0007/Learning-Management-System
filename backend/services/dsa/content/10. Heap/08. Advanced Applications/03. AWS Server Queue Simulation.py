"""
Problem Statement: AWS Server Queue Simulation

    AWS is a cloud computing platform with multiple servers. One of the servers is assigned to serve customer requests.
    There are n customer requests placed sequentially in a queue, where the ith request has a maximum waiting time,
    denoted by wait[i]. If the ith request is not served within wait[i] seconds, then the request expires and is
    removed from the queue. The server processes the requests following FIFO (First In, First Out).

    At each second, the first request in the queue is processed. At the next second, the processed request and
    any expired requests are removed from the queue.

    Given the maximum waiting time of each request denoted by the array wait, find the number of requests
    present in the queue at every second until it is empty.

Note:
    - If a request is served at time instant t, it will be counted for that instant and removed at the next instant.
    - The first request is processed at time = 0.
    - The initial queue represents the requests at time = 0.

Constraints:
    1 <= n <= 10^5
    1 <= wait[i] <= 10^5

Examples:
1. Input: wait = [2, 2, 3, 1]
   Output: [4, 2, 1, 0]
   Explanation:
   - At t=0, queue: [2,2,3,1], size: 4
   - At t=1, process first 2, remove 1, queue: [2,3], size: 2
   - At t=2, process second 2, queue: [3], size: 1
   - At t=3, process 3, queue: [], size: 0

2. Input: wait = [3, 1, 2, 1]
   Output: [4, 1, 0]
   Explanation:
   - At t=0, queue: [3,1,2,1], size: 4
   - At t=1, process 3, remove 1,1, queue: [2], size: 1
   - At t=2, process 2, queue: [], size: 0

3. Input: wait = [4, 4, 4]
   Output: [3, 2, 1, 0]
   Explanation:
   - At t=0, queue: [4,4,4], size: 3
   - At t=1, process first 4, queue: [4,4], size: 2
   - At t=2, process second 4, queue: [4], size: 1
   - At t=3, process third 4, queue: [], size: 0

Time Complexity: O(n), where n is the number of requests
    - Sorting the expirations list takes O(n log n), but for the given constraint (1 <= wait[i] <= 10^5),
    we can use counting sort to achieve O(n).
    - We process each request exactly once.
    - We check each expiration exactly once.

Space Complexity: O(n)
- We use additional arrays (result and expirations) of at most size n+1.
"""

from typing import List

class Solution:
    def simulateQueue(self, wait: List[int]) -> List[int]:
        n = len(wait)
        result = [n]  # Initial queue size
        time = 0
        
        # Create a list of (expiration_time, index) pairs
        expirations = [(wait[i], i) for i in range(n)]
        expirations.sort()  # Sort by expiration time
        
        next_to_expire = 0
        queue_size = n
        
        while queue_size > 0:
            time += 1
            queue_size -= 1  # Process the front request
            
            # Remove expired requests
            while next_to_expire < n and expirations[next_to_expire][0] <= time:
                if expirations[next_to_expire][1] > time - 1:
                    queue_size = max(0, queue_size - 1)
                next_to_expire += 1
            
            if queue_size > 0:
                result.append(queue_size)
            else:
                result.append(0)
                break
        
        return result

# Test cases
solution = Solution()
test_cases = [
    [2, 2, 3, 1],
    [3, 1, 2, 1],
    [4, 4, 4],
    [4 ,3, 1, 2, 1]
]
for i, case in enumerate(test_cases, 1):
    result = solution.simulateQueue(case)
    print(f"Test Case {i}:")
    print(f"Input: {case}")
    print(f"Output: {result}")
    print()