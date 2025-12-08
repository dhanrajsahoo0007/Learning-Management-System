"""
Problem Statement: Course Scheduler II

    There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
    You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you
    must take course bi first if you want to take course ai.

    For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

    Return the ordering of courses you should take to finish all courses.
    
    If there are many valid answers, return any of them.
    If it is impossible to finish all courses, return an empty array.

Example 1:
    Input: numCourses = 2, prerequisites = [[1,0]]
    Output: [0,1]
    Explanation:    There are a total of 2 courses to take. To take course 1 you should have finished course 0.
                    So the correct course order is [0,1].

Example 2:
    Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
    Output: [0,2,1,3]
    Explanation:    There are a total of 4 courses to take. To take course 3 you should have finished both
                    courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.
                    So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].

Example 3:
    Input: numCourses = 1, prerequisites = []
    Output: [0]

Solution Explanation:
    This solution uses Depth-First Search (DFS) to detect cycles and perform topological sorting.
    
    1. We create an adjacency list representation of the graph where each course points to its prerequisites.
    2. We use DFS to visit all nodes, keeping track of visited nodes and nodes in the current recursion stack.
    3. If we encounter a node that's already in the recursion stack, we've found a cycle, and it's impossible to complete all courses.
    4. As we finish exploring a node's prerequisites, we add it to the result stack.
    5. Finally, we reverse the stack to get the correct order of courses.

Time Complexity: O(V + E), where V is the number of courses and E is the number of prerequisites.
    We visit each node once and explore each edge once.

Space Complexity: O(V), where V is the number of courses.
    We use space for the adjacency list, visited array, recursion stack, and the result stack.
    In the worst case, these can all be of size V.
"""


from typing import List
from collections import defaultdict

class Solution:
    """
    This Problem is a combination of
        1. cycle detection in a undirected graph using DFS
        2. Topological sort using DFS 
    """
    def __init__(self):
        self.hasCycle = False

    def DFS(self, adj, u: int, visited: List[bool], st: List[int], inRecursion: List[bool]):
        visited[u] = True
        inRecursion[u] = True

        # Explore all adjacent vertices
        for v in adj[u]:
            if inRecursion[v] == True:
                # If the vertex is in the current recursion stack, we've found a cycle
                self.hasCycle = True
                return

            if not visited[v]:
                self.DFS(adj, v, visited, st, inRecursion)

        # Add the current vertex to the stack after exploring all its prerequisites
        st.append(u)
        inRecursion[u] = False

    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        adj = defaultdict(list)
        visited = [False] * numCourses
        inRecursion = [False] * numCourses
        self.hasCycle = False

        st = []

        # Build the adjacency list
        for a , b in prerequisites:
            # a, b = vec[0], vec[1]
            # b -> a: To take course 'a', you need to complete course 'b' first
            adj[b].append(a)

        # Perform DFS on all unvisited vertices
        for i in range(numCourses):
            if not visited[i]:
                self.DFS(adj, i, visited, st, inRecursion)

        # If a cycle is detected, it's impossible to finish all courses
        if self.hasCycle:
            return []

        # Reverse the stack to get the correct order
        return st[::-1] 

# Test cases
solution = Solution()

# Example 1
print(solution.findOrder(2, [[1,0]]))  # Expected output: [0,1]

# Example 2
print(solution.findOrder(4, [[1,0],[2,0],[3,1],[3,2]]))  # Expected output: [0,2,1,3] or [0,1,2,3]

# Example 3
print(solution.findOrder(1, []))  # Expected output: [0]