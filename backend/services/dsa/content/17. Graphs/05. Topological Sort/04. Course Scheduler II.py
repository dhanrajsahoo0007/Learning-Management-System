"""
Problem: Course Schedule II

    There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
    You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you
    must take course bi first if you want to take course ai.

    Return the ordering of courses you should take to finish all courses. If there are many valid
    answers, return any of them. If it is impossible to finish all courses, return an empty array.

Solution Approach:
    This solution uses Kahn's algorithm for topological sorting. It builds an adjacency list
    and an indegree array from the prerequisites, then performs a BFS-based topological sort.

Time Complexity: O(V + E), where V is the number of courses and E is the number of prerequisites.
Space Complexity: O(V + E) for the adjacency list and queue.
"""

from typing import List
from collections import defaultdict, deque

class Solution:
    def topologicalSortCheck(self, adj, n: int, indegree: List[int]) -> List[int]:
        que = deque()
        count = 0
        result = []
        
        for i in range(n):
            if indegree[i] == 0:
                result.append(i)
                count += 1
                que.append(i)
        
        while que:
            u = que.popleft()
            
            for v in adj[u]:
                indegree[v] -= 1
                
                if indegree[v] == 0:
                    result.append(v)
                    count += 1
                    que.append(v)
        
        return result if count == n else []

    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        adj = defaultdict(list)
        indegree = [0] * numCourses
        
        for a, b in prerequisites:
            # b ---> a
            adj[b].append(a)
            indegree[a] += 1
        
        return self.topologicalSortCheck(adj, numCourses, indegree)

# Test cases
solution = Solution()
print(solution.findOrder(2, [[1,0]]))  # Expected output: [0,1]
print(solution.findOrder(4, [[1,0],[2,0],[3,1],[3,2]]))  # Expected output: [0,1,2,3] or [0,2,1,3]
print(solution.findOrder(1, []))  # Expected output: [0]