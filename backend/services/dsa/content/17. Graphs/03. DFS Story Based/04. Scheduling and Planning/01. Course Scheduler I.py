"""
Problem Statement:
    There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. 
    
    You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

    For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

    Return true if you can finish all courses. Otherwise, return false.

Time Complexity: O(V + E), where V is the number of courses (vertices) and E is the number of prerequisites (edges).
    - We visit each course once in the worst case.
    - For each course, we explore all its prerequisites (adjacent vertices).

Space Complexity: O(V)
    - The adjacency list (adj) uses O(V + E) space.
    - The visited and inRecursion arrays each use O(V) space.
    - The recursion stack in the worst case can go up to O(V) depth.

Explanation:
    This solution uses a Depth-First Search (DFS) approach to detect cycles in the course dependency graph. 
    The presence of a cycle indicates that it's impossible to complete all courses, as it would create a circular dependency.

Key points of the algorithm:
    1. We represent the course dependencies as a directed graph using an adjacency list.
    2. We use DFS to traverse the graph and detect cycles.
    3. We use two arrays: 'visited' to keep track of visited nodes, and 'inRecursion' to track nodes in the current DFS path.
    4. If we encounter a node that's already in the current path (inRecursion[v] is True), we've found a cycle.
    5. If we complete DFS for all nodes without finding a cycle, it's possible to complete all courses.

The isCycleDFS function:
    - Marks the current node as visited and adds it to the current path.
    - Recursively visits all adjacent nodes (prerequisites).
    - If it finds a node already in the current path, it has detected a cycle.
    - After exploring all adjacent nodes, it removes the current node from the path.

The canFinish function:
- Builds the adjacency list from the prerequisites.
- Calls isCycleDFS for each unvisited node.
- Returns False if a cycle is detected, True otherwise.
"""

from typing import List
from collections import defaultdict

class Solution:
    def isCycleDFS(self, adj: dict, u: int, visited: List[bool], inRecursion: List[bool]) -> bool:
        visited[u] = True
        inRecursion[u] = True
        
        for v in adj[u]:
            # if not visited, then we check for cycle in DFS
            if not visited[v] and self.isCycleDFS(adj, v, visited, inRecursion):
                return True
            # If an adjacent is visited and in recursion stack then graph is cyclic
            elif inRecursion[v]:
                return True
        
        inRecursion[u] = False
        return False
    
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = defaultdict(list)
        visited = [False] * numCourses
        inRecursion = [False] * numCourses
        
        # Build the graph
        for a, b in prerequisites:
            # b ---> a (course b must be taken before course a)
            adj[b].append(a)
        
        for i in range(numCourses):
            if not visited[i] and self.isCycleDFS(adj, i, visited, inRecursion):
                # If there is a cycle that means we can't complete all the courses 
                # so return False 
                return False
        
        return True

# Test cases
solution = Solution()
print(solution.canFinish(2, [[1,0]]))  # Should return True
print(solution.canFinish(2, [[1,0],[0,1]]))  # Should return False