"""
Problem: Minimum Cost to Hire K Workers

    There are n workers. You are given two integer arrays quality and wage where quality[i] is the quality of the ith worker and wage[i] is the minimum wage expectation for the ith worker.

    We want to hire exactly k workers to form a paid group. To hire a group of k workers, we must pay them according to the following rules:

    Every worker in the paid group must be paid at least their minimum wage expectation.
    In the group, each worker's pay must be directly proportional to their quality.
    This means if a worker’s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.
    
    Given the integer k, return the least amount of money needed to form a paid group satisfying the above conditions. 

Example 1:

    Input: quality = [10,20,5], wage = [70,50,30], k = 2
    Output: 105.00000
    Explanation: We pay 70 to 0th worker and 35 to 2nd worker.

Example 2:

    Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
    Output: 30.66667
    Explanation: We pay 4 to 0th worker, 13.33333 to 2nd and 3rd workers separately.


Time Complexity: O(N * logN)
    - Sorting takes O(N * logN)
    - Heap operations in the loop take O(logN)
    - Total loop iterations are N

Space Complexity: O(N)
    - O(N) for creating ratios array
    - O(K) for the heap
    - O(N) for sorting

Key Insight:
    1. For each worker, calculate their wage/quality ratio
    2. Sort workers by this ratio (ascending)
    3. Use a max heap to track k workers with lowest quality
    4. For each worker (in sorted order), try them as the ratio-determining worker

Example 1:
    Input: quality = [10,20,5], wage = [70,50,30], k = 2
    Output: 105.00000
    
    Detailed steps:
    1. Calculate ratios (wage/quality) for each worker:
        Worker 0: 70/10 = 7.0
        Worker 1: 50/20 = 2.5
        Worker 2: 30/5  = 6.0
    
    2. Sort by ratio:
        [(2.5, 20), (6.0, 5), (7.0, 10)]
        
    3. Process workers:
        a) First worker (ratio=2.5):
           - Add quality 20
           - heap = [-20], sum = 20
        
        b) Second worker (ratio=6.0):
           - Add quality 5
           - heap = [-20, -5], sum = 25
           - Calculate cost: 6.0 * 25 = 150
        
        c) Third worker (ratio=7.0):
           - Add quality 10
           - heap = [-10, -5], sum = 15 (removed 20)
           - Calculate cost: 7.0 * 15 = 105
           
        Final result = min(150, 105) = 105
"""

import heapq
from typing import List

def mincostToHireWorkers(quality: List[int], wage: List[int], k: int) -> float:
    # Create array of (wage/quality ratio, quality) pairs
    workers = sorted((w/q, q) for w, q in zip(wage, quality))

    """
    # Above one liner or 
    n = len(quality)
    
    # Create list to store worker information
    workers = []
    
    # Calculate ratio and store (ratio, quality) for each worker
    for i in range(n):
        ratio = wage[i] / quality[i]
        workers.append((ratio, quality[i]))
    
    # Sort workers by ratio (ascending)
    workers.sort()
    
    """
    
    # Initialize max heap for qualities (use negative for max heap)
    qual_heap = []
    qual_sum = 0
    min_cost = float('inf')
    
    # Try each worker as the ratio-determining worker
    for ratio, q in workers:
        # Add current worker's quality to heap and sum
        heapq.heappush(qual_heap, -q)
        qual_sum += q
        
        # If we have more than k workers, remove the highest quality one
        if len(qual_heap) > k:
            # Remove highest quality (most negative) from sum and heap
            qual_sum += heapq.heappop(qual_heap)
        
        # If we have exactly k workers, calculate total cost
        if len(qual_heap) == k:
            # Total cost = ratio * sum of qualities
            cost = ratio * qual_sum
            min_cost = min(min_cost, cost)
    
    return min_cost

# Example 1 with detailed steps
def run_example1():
    quality = [10, 20, 5]
    wage = [70, 50, 30]
    k = 2
    
    print("\nExample 1:")
    print(f"Quality: {quality}")
    print(f"Wage: {wage}")
    print(f"k: {k}")
    
    # Calculate and sort ratios
    workers = sorted((w/q, q) for w, q in zip(wage, quality))
    print("\nWorkers sorted by wage/quality ratio:")
    for ratio, q in workers:
        print(f"Ratio: {ratio:.2f}, Quality: {q}")
    
    result = mincostToHireWorkers(quality, wage, k)
    print(f"\nMinimum cost: {result:.5f}")

# Example 2 with detailed steps
def run_example2():
    quality = [3, 1, 10, 10, 1]
    wage = [4, 8, 2, 2, 7]
    k = 3
    
    print("\nExample 2:")
    print(f"Quality: {quality}")
    print(f"Wage: {wage}")
    print(f"k: {k}")
    
    # Calculate and sort ratios
    workers = sorted((w/q, q) for w, q in zip(wage, quality))
    print("\nWorkers sorted by wage/quality ratio:")
    for ratio, q in workers:
        print(f"Ratio: {ratio:.2f}, Quality: {q}")
    
    result = mincostToHireWorkers(quality, wage, k)
    print(f"\nMinimum cost: {result:.5f}")

# Run examples
run_example1()
run_example2()