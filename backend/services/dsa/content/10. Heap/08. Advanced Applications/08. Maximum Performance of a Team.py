"""
1383. Maximum Performance of a Team
Hard
Topics
Companies
Hint
You are given two integers n and k and two integer arrays speed and efficiency both of length n. There are n engineers numbered from 1 to n. speed[i] and efficiency[i] represent the speed and efficiency of the ith engineer respectively.

Choose at most k different engineers out of the n engineers to form a team with the maximum performance.

The performance of a team is the sum of its engineers' speeds multiplied by the minimum efficiency among its engineers.

Return the maximum performance of this team. Since the answer can be a huge number, return it modulo 109 + 7.

 

Example 1:

Input: n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2
Output: 60
Explanation: 
We have the maximum performance of the team by selecting engineer 2 (with speed=10 and efficiency=4) and engineer 5 (with speed=5 and efficiency=7). That is, performance = (10 + 5) * min(4, 7) = 60.
Example 2:

Input: n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3
Output: 68
Explanation:
This is the same example as the first but k = 3. We can select engineer 1, engineer 2 and engineer 5 to get the maximum performance of the team. That is, performance = (2 + 10 + 5) * min(5, 4, 7) = 68.
Example 3:

Input: n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 4
Output: 72
 

Constraints:

1 <= k <= n <= 105
speed.length == n
efficiency.length == n
1 <= speed[i] <= 105
1 <= efficiency[i] <= 108

Complexity Analysis

Let N be the total number of candidates, and K be the size of the team.

Time Complexity: O(N⋅(logN+logK))

First of all, we build a list of candidates from the inputs, which takes O(N) time.

We then sort the candidates, which takes O(NlogN) time.

We iterate through the sorted candidates. At each iteration, we will perform at most two operations on the priority queue: one push and one pop.
Each operation takes O(log(K−1)) time, where K−1 is the capacity of the queue.
To sum up, the time complexity of this iteration will be O(N⋅log(K−1))=O(N⋅logK).

Thus, the overall time complexity of the algorithm will be O(N⋅(logN+logK)).

Space Complexity: O(N+K)

We build a list of candidates from the inputs, which takes O(N) space.

We also use the priority queue data structure whose space capacity is O(K−1).

Note that we use sorting in the algorithm, and the space complexity of the sorting algorithm depends on the implementation of each programming language.
For instance, the sorted() function in Python is implemented with the Timsort algorithm whose space complexity is O(N).
While in Java, the Collections.sort() is implemented as a variant of the quicksort algorithm whose space complexity is O(logN).

To sum up, the overall space complexity of the entire algorithm is O(N+K).
"""
class Solution:
    def maxPerformance(self, n: int, speed: List[int], efficiency: List[int], k: int) -> int:
        """
        given two arrays speed and efficiency
        engineers 1 to n
        select at most k different engineers out of n that will perform the best
         perf = sum(speeds)* min(efficiency) 
         return the answer mod 10^9 
        """
        import heapq
        
        performance = 0
        selected_engineers_speed = [] # heap ( containing k speeds to be selected )

        eff_speed_array = list(zip(efficiency, speed))
        eff_speed_array.sort(key = lambda x: x[0], reverse=True)

        speed_sum = 0
        for eng_eff, eng_speed in eff_speed_array:
            if len(selected_engineers_speed) == k:
                speed_sum -= heapq.heappop(selected_engineers_speed)
            heapq.heappush(selected_engineers_speed, eng_speed)
            speed_sum += eng_speed
            curr_perf = eng_eff * speed_sum
            performance = max(performance, curr_perf)

        return performance % (10**9 + 7)