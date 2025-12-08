"""
Problem: Detect Cycle in Directed Graph using DFS

Given a directed graph, detect if there is a cycle in the graph using Depth-First Search (DFS).

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def isCycle(V: int, adj: List[List[int]]) -> bool
    def DFS(adj: List[List[int]], u: int, visited: List[bool], in_recursion: List[bool]) -> bool

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    True if a cycle is detected, False otherwise

Constraints:    1 ≤ V, E ≤ 10^4

Explanation:

1. The create_graph function has been modified:
   - It only adds edges in one direction since it's a directed graph.

2. The DFS function has been updated to detect cycles in a directed graph:
   - It uses both visited and in_recursion (recursion stack) arrays.
   - It marks the current vertex as visited and adds it to the recursion stack.
   - For each adjacent vertex v:
     - If v is not visited, we recursively call DFS on v.
     - If v is already in the recursion stack, we've found a cycle.
   - After exploring all adjacent vertices, we remove the current vertex from the recursion stack.

3. The isCycle function has been slightly modified:
   - It initializes both visited and in_recursion arrays.
   - It calls DFS for each unvisited vertex.
   - It returns True if DFS detects a cycle in any component, False otherwise.

Key points of the cycle detection algorithm for directed graphs:
    - We use DFS to traverse the graph.
    - We keep track of vertices in the current recursion stack.
    - A cycle is detected if we encounter a vertex that is already in the recursion stack.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the visited array, recursion stack array, and the recursion call stack.

Key differences from undirected graph cycle detection:
    1. In directed graphs, we don't need to keep track of the parent vertex.
    2. We use an additional array (in_recursion) to keep track of vertices in the current DFS path.
    3. A cycle is detected when we encounter a vertex that is already in the recursion stack, not just visited.
"""

from typing import List

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)  # Only add edge in one direction for directed graph
    return adj

def DFS(adj: List[List[int]], u: int, visited: List[bool], in_recursion: List[bool]) -> bool:
    visited[u] = True
    in_recursion[u] = True
    
    for v in adj[u]:
        # If not visited then we check the cycle in DFS
        if not visited[v]:
            if DFS(adj, v, visited, in_recursion):
                return True
        ## if visited and also present in the current recursion stack then the graph has a cycle 
        elif in_recursion[v]:
            return True
    # as the DFS completed the rewind the current recursion 
    in_recursion[u] = False
    return False

def isCycle(V: int, adj: List[List[int]]) -> bool:
    visited = [False] * V
    in_recursion = [False] * V
    
    for i in range(V):
        if not visited[i]:
            if DFS(adj, i, visited, in_recursion):
                return True
    
    return False

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_cycle_detection():
    print("Running Cycle Detection tests for Directed Graph:")
    print("------------------------------------------------")

    # Test case 1: Directed Graph with a cycle
    V1 = 4
    edges1 = [[0,1], [1,2], [2,3], [3,1]]
    adj1 = create_graph(V1, edges1)
    print("Test case 1 (Directed Graph with a cycle):")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = isCycle(V1, adj1)
    print(f"Cycle detected: {result1}")
    print()

    # Test case 2: Directed Graph without a cycle
    V2 = 4
    edges2 = [[0,1], [1,2], [2,3]]
    adj2 = create_graph(V2, edges2)
    print("Test case 2 (Directed Graph without a cycle):")
    print(f"Number of vertices: {V2}")
    print(f"Edges: {edges2}")
    print_graph(adj2)
    result2 = isCycle(V2, adj2)
    print(f"Cycle detected: {result2}")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_cycle_detection()
