"""
Problem: Course Schedule

    There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
    You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you
    must take course bi first if you want to take course ai.

    For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

    Return true if you can finish all courses. Otherwise, return false.

Solution Approach:
    This solution uses Kahn's algorithm for topological sorting to check for cycles in the course
    dependencies. If a cycle exists, it's impossible to finish all courses.

Time Complexity: O(V + E), where V is the number of courses and E is the number of prerequisites.
Space Complexity: O(V + E) for the adjacency list and queue.
"""

from typing import List
from collections import defaultdict, deque

class Solution:
    def topologicalSortCheck(self, adj, n: int, indegree: List[int]) -> bool:
        que = deque()
        count = 0
        
        for i in range(n):
            if indegree[i] == 0:
                count += 1
                que.append(i)
        
        while que:
            u = que.popleft()
            
            for v in adj[u]:
                indegree[v] -= 1
                
                if indegree[v] == 0:
                    count += 1
                    que.append(v)
        
        return count == n  # True if all courses can be completed, False if there's a cycle

    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = defaultdict(list)
        indegree = [0] * numCourses
        
        for a, b in prerequisites:
            # b ---> a
            adj[b].append(a)
            indegree[a] += 1
        
        return self.topologicalSortCheck(adj, numCourses, indegree)

# Test cases
solution = Solution()
print(solution.canFinish(2, [[1,0]]))  # Expected output: True
print(solution.canFinish(2, [[1,0],[0,1]]))  # Expected output: False
print(solution.canFinish(5, [[1,4],[2,4],[3,1],[3,2]]))  # Expected output: True