"""
857. Minimum Cost to Hire K Workers
Hard
Topics
Companies
There are n workers. You are given two integer arrays quality and wage where quality[i] is the quality of the ith worker and wage[i] is the minimum wage expectation for the ith worker.

We want to hire exactly k workers to form a paid group. To hire a group of k workers, we must pay them according to the following rules:

Every worker in the paid group must be paid at least their minimum wage expectation.
In the group, each worker's pay must be directly proportional to their quality. This means if a worker’s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.
Given the integer k, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within 10-5 of the actual answer will be accepted.

 

Example 1:

Input: quality = [10,20,5], wage = [70,50,30], k = 2
Output: 105.00000
Explanation: We pay 70 to 0th worker and 35 to 2nd worker.
Example 2:

Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
Output: 30.66667
Explanation: We pay 4 to 0th worker, 13.33333 to 2nd and 3rd workers separately.

"""

class Solution:
    """
    Intuition:
      - First, understand what makes a valid hiring group:  
        pythonCopy# Example
        quality = [10,20,5]
        wage = [70,50,30]
        k = 2

        Key Rule: If we hire worker A and B, they must be paid proportionally to quality
        If we pay worker A $100 for quality 10
        Then worker B with quality 20 must be paid $200

        Critical Insights (explain these to interviewer):

        a) One worker's wage/quality ratio will determine payment for everyone
           - If we pick ratio 7 (worker with wage 70, quality 10)
           - Everyone must be paid at least 7 × their quality
           
        b) For any chosen ratio r:
           - Worker with wage w and quality q must be paid max(r×q, w)
           - Some workers might be too expensive at this ratio!

        Why sort by ratio? (Draw this)

        wage/quality ratios:
        Worker 1: 50/20 = 2.5
        Worker 2: 30/5  = 6.0
        Worker 0: 70/10 = 7.0

        If we choose worker 0 (ratio 7):
        - Must pay everyone at ratio 7
        - Earlier workers are happy (7 > their minimum ratio)

        Why heap for quality?

        For each ratio r:
        - We must pay r × quality for each worker
        - Total cost = r × (sum of qualities)
        - Want smallest possible total quality for k workers
        - Need to efficiently maintain k smallest qualities
        → Perfect use case for heap!
        Drawing heap usage example
        CopyAt ratio 6.0:
        qualities: [20, 5]
        heap maintains smallest qualities
        total cost = 6.0 × (20 + 5) = 150

        At ratio 7.0:
        qualities: [10, 5]  # 20 removed as it's largest
        total cost = 7.0 × (10 + 5) = 105
        When to use heap in general:

        Need to maintain "top k" elements
        Elements can be added/removed dynamically
        Need quick access to largest/smallest

        In this problem:

        Sorting handles ratio order
        Heap handles dynamic quality selection
    """
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> float:
        """
        quality and wage given 
        k workers to form a paid group.
         - all should be given the minimum wage
         - if the worker's quality is x times the other workers quality then they should be given x times more
        return the least amount of money needed to form a paid group
        """
        import heapq
        # create array of workers with wage quality ratio
        workers_wqr = sorted([(w/q, q, w) for q, w in zip(quality, wage)])
        
        # track k workers with smallest quality  
        quality_heap = []
        quality_sum = 0
        min_cost = float('inf')

        for ratio, q, w in workers_wqr:
            heapq.heappush(quality_heap, -q)
            quality_sum += q

            if len(quality_heap) > k:
                quality_sum += heapq.heappop(quality_heap)
            
            if len(quality_heap) == k:
                min_cost = min(min_cost, ratio*quality_sum)
        return min_cost