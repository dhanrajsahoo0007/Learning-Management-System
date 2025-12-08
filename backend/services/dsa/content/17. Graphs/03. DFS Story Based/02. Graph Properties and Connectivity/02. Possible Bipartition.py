"""
Problem Statement:
    We want to split a group of n people (labeled from 1 to n) into two groups of any size. Each person may dislike some other
    people, and they should not go into the same group.

    Given the integer n and the array dislikes where dislikes[i] = [ai, bi] indicates that the person labeled ai does not like
    the person labeled bi, return true if it is possible to split everyone into two groups in this way.

Time Complexity: O(N + E) for both BFS and DFS, where N is the number of people and E is the number of dislike relationships.
    - We iterate through each person once and explore each dislike relationship once.

Space Complexity: O(N + E) for both BFS and DFS
    - The adjacency list (adj) uses O(N + E) space.
    - The color array uses O(N) space.
    - The queue in BFS or the recursion stack in DFS can use up to O(N) space in the worst case.

Explanation:
    A graph is bipartite if we can color its nodes using two colors such that no two adjacent nodes have the same color.
    In this context, if we can color the graph with two colors, it means we can split the people into two groups
    where no two people who dislike each other are in the same group.
"""

from typing import List

class Solution:

    def isBipartiteDFS(self, adj: defaultdict(list), u: int, color: List[int]) -> bool:
        for v in adj[u]:
            if color[v] == -1:
                color[v] = 1 - color[u]
                if not self.isBipartiteDFS(adj, v, color):
                    return False
            elif color[v] == color[u]:
                return False
        return True

    def possibleBipartition(self, n: int, dislikes: List[List[int]]) -> bool:
        adj = defaultdict(list)
        
        for vec in dislikes:
            u, v = vec
            adj[u].append(v)
            adj[v].append(u)
        
        color = [-1] * (n + 1)
        
        for i in range(1, n + 1):
            if color[i] == -1:
                color[i] = 1
                # Use either BFS or DFS
                if not self.isBipartiteDFS(adj, i, color):
                    return False
        
        return True

# Test cases
solution = Solution()
print(solution.possibleBipartition(4, [[1,2],[1,3],[2,4]]))  # Should return true
print(solution.possibleBipartition(3, [[1,2],[1,3],[2,3]]))  # Should return false
print(solution.possibleBipartition(5, [[1,2],[2,3],[3,4],[4,5],[1,5]]))  # Should return false