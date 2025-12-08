"""
Number of Provinces

    There are `n` cities. Some of them are connected, while some are not. 
    If city `a` is connected directly with city `b`, and city `b` is connected directly with city `c`, then city `a` is connected indirectly with city `c`.
    A province is a group of directly or indirectly connected cities and no other cities outside of the group.
    You are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if the `ith` city and the `jth` city are directly connected,
    and `isConnected[i][j] = 0` otherwise.
    
    Return the total number of provinces*.
    
Example 1:

    Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
    Output: 2

Example 2:

    Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
    Output: 3

Detailed Explanation:

1. `create_graph` function:
   - Converts the `isConnected` matrix into an adjacency list representation.
   - Creates a list of lists `adj`, where `adj[i]` contains all cities directly connected to city `i`.
   - Iterates through the `isConnected` matrix and adds an edge (j) to `adj[i]` if `isConnected[i][j] == 1` and `i != j`.

2. `DFS` function:
   - Implements depth-first search.
   - Marks the current city `u` as visited.
   - Recursively visits all unvisited neighbors of `u`.

3. `findCircleNum` function:
   - Main function that solves the problem.
   - Creates the adjacency list using `create_graph`.
   - Initializes a `visited` array to keep track of visited cities.
   - Initializes a `provinces` counter to 0.
   - Iterates through all cities:
     - If a city hasn't been visited, starts a DFS from that city.
     - After each DFS, increments the `provinces` counter.
   - The number of times DFS is initiated is equal to the number of provinces.

The key insight is that each DFS traversal will visit all cities in a single province. So, the number of times we need to initiate DFS (on previously unvisited cities) is equal to the number of provinces.

Time Complexity: O(V^2), where V is the number of cities.
- Creating the adjacency list takes O(V^2) time.
- The DFS visits each city and each edge once, which takes O(V + E) time. In the worst case (when all cities are connected), E can be V^2.

Space Complexity: O(V)
- The adjacency list takes O(V + E) space, which in the worst case is O(V^2).
- The visited array takes O(V) space.
- The recursion stack in DFS can go up to O(V) in the worst case.
- However, we can optimize the space by not creating an explicit adjacency list and using the input matrix directly in DFS, which would reduce the space complexity to O(V).
"""

from typing import List

"""
Problem Statement:
There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and the jth city are directly connected, and isConnected[i][j] = 0 otherwise.

Return the total number of provinces.

Time Complexity: O(N^2), where N is the number of cities.
- Creating the adjacency list takes O(N^2) time as we iterate through the isConnected matrix.
- The DFS visits each node once, which takes O(N + E) time, where E is the number of edges.
  In the worst case, E can be O(N^2), so the overall complexity is O(N^2).

Space Complexity: O(N)
- The adjacency list uses O(N + E) space, which in the worst case is O(N^2).
- The visited array uses O(N) space.
- The recursion stack in the worst case can go up to O(N) depth.

Explanation:
This solution uses Depth-First Search (DFS) to count the number of connected components in the graph, 
which represents the number of provinces. Each DFS traversal explores an entire connected component (province).
"""

from typing import List

class Solution:
    def create_graph(self, V: int, isConnected: List[List[int]]) -> List[List[int]]:
        # Create an adjacency list representation of the graph
        adj = [[] for _ in range(V)]
        for i in range(V):
            for j in range(V):
                if isConnected[i][j] == 1 and i != j:
                    adj[i].append(j)
        print(f"Printing the adjacency list created {adj}")
        return adj

    def DFS(self, adj: List[List[int]], u: int, visited: List[bool]):
        # Mark the current node as visited
        if visited[u]:
            return
        visited[u] = True
        # Recur for all the vertices adjacent to this vertex
        for v in adj[u]:
            if not visited[v]:
                self.DFS(adj, v, visited)

    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        V = len(isConnected)  # Number of cities
        adj = self.create_graph(V, isConnected)  # Create adjacency list
        visited = [False] * V  # Initialize visited array
        provinces = 0  # Counter for number of provinces
        
        # Iterate through all cities
        for i in range(V):
            if not visited[i]:
                # If city is not visited, it's a new province
                self.DFS(adj, i, visited)
                provinces += 1
        
        return provinces

# Test cases
solution = Solution()
print(solution.findCircleNum([[1,1,0],[1,1,0],[0,0,1]]))  # Should return 2
print(solution.findCircleNum([[1,0,0],[0,1,0],[0,0,1]]))  # Should return 3