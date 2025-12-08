"""
Problem Statement: Is Graph Bipartite?

Description:
    There is an undirected graph with n nodes, where each node is numbered from 0 to n - 1. 
    You are given a 2D array graph, where graph[u] is an array of nodes that node u is adjacent to. 
    More formally, for each v in graph[u], there is an undirected edge between node u and node v. 
    The graph has the following properties:

    - There are no self-edges (graph[u] does not contain u).
    - There are no parallel edges (graph[u] does not contain duplicate values).
    - If v is in graph[u], then u is in graph[v] (the graph is undirected).
    - The graph may not be connected, meaning there may be two nodes u and v such that there is no path between them.

    A graph is bipartite if the nodes can be partitioned into two independent sets A and B 
    such that every edge in the graph connects a node in set A and a node in set B.

    Return true if and only if it is bipartite.

Example 1:
    Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
    Output: false
    Explanation: There is no way to partition the nodes into two independent sets such that every edge connects a node in one and a node in the other.

Example 2:
    Input: graph = [[1,3],[0,2],[1,3],[0,2]]
    Output: true
    Explanation: We can partition the nodes into two sets: {0, 2} and {1, 3}.

Constraints:
    - graph.length == n
    - 1 <= n <= 100
    - 0 <= graph[u].length < n
    - 0 <= graph[u][i] <= n - 1
    - graph[u] does not contain u.
    - All the values of graph[u] are unique.
    - If graph[u] contains v, then graph[v] contains u.
"""


from typing import List
from collections import deque

class Solution:
    def checkBipartiteBFS(self, adj: List[List[int]], curr: int, color: List[int], curr_color: int) -> bool:
        color[curr] = curr_color  # color the current node
        
        que = deque([curr])
        
        while que:
            u = que.popleft()
            
            for v in adj[u]:
                if color[v] == color[u]:
                    return False
                elif color[v] == -1:
                    color[v] = 1 - color[u]
                    que.append(v)
        
        return True

    def isBipartite(self, graph: List[List[int]]) -> bool:
        V = len(graph)
        color = [-1] * V  # no node colored in the start
        
        # red = 1
        # green = 0
        
        for i in range(V):
            if color[i] == -1:
                if not self.checkBipartiteBFS(graph, i, color, 1):
                    return False
        
        return True

# Test cases
solution = Solution()
print(solution.isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]]))  # Expected output: False
print(solution.isBipartite([[1,3],[0,2],[1,3],[0,2]]))  # Expected output: True