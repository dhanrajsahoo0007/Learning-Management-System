"""
Problem Statement: Bipartite Graph

    A Graph is bipartite if the nodes can be partitioned into two independent sets A and B such that 
    every edge in the graph connects a node in set A and a node in set B.

    There is an undirected graph with n nodes, where each node is numbered between 0 and n - 1. 
    You are given a 2D array graph, where graph[u] is an array of nodes that node u is adjacent to. 
    More formally, for each v in graph[u], there is an undirected edge between node u and node v. 

    The graph has the following properties:
        - There are no self-edges (graph[u] does not contain u).
        - There are no parallel edges (graph[u] does not contain duplicate values).
        - If v is in graph[u], then u is in graph[v] (the graph is undirected).
        - The graph may not be connected, meaning there may be two nodes u and v such that there is no path between them.

    Return true if and only if it is bipartite.

Solution Explanation:
    This solution uses a depth-first search (DFS) approach to color the nodes of the graph.
    We use two colors (0 and 1) to partition the nodes. If we can color all nodes without any conflicts
    (i.e., no two adjacent nodes have the same color), then the graph is bipartite.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
                 We visit each node once and explore all edges.

Space Complexity: O(V) for the color array and the recursion stack in the worst case.

"""

from typing import List

class Solution:

    def isBipartite(self, graph: List[List[int]]) -> bool:
        n = len(graph)
        color = [-1] * n  # no node colored in the start
        
        # red = 1
        # green = 0
        
        for i in range(n):
            if color[i] == -1:
                if not self.checkBipartiteDFS(graph, i, color, 1):
                    return False
        
        return True
    
    def checkBipartiteDFS(self, graph: List[List[int]], curr: int, color: List[int], curr_color: int) -> bool:
        color[curr] = curr_color
        
        for v in graph[curr]:
            if color[v] == color[curr]:
                return False
            
            if color[v] == -1:  # never colored (never visited)
                color_of_v = 1 - curr_color
                if not self.checkBipartiteDFS(graph, v, color, color_of_v):
                    return False
        
        return True

# Test cases
solution = Solution()
print(solution.isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]]))  # Expected output: False
print(solution.isBipartite([[1,3],[0,2],[1,3],[0,2]]))  # Expected output: True