"""
Problem: Breadth First Traversal of Undirected Graph

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def bfsOfGraph(V: int, adj: List[List[int]]) -> List[int]
    def print_graph(adj: List[List[int]]) -> None

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    List[int]: BFS traversal of the graph starting from vertex 0

Constraints: 1 ≤ V, E ≤ 10^4
"""

from typing import List
from collections import deque

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)  # Since it's an undirected graph
    return adj

def BFS(adj: List[List[int]], u: int, visited: List[bool], result: List[int]):
    queue = deque([u])
    visited[u] = True

    while queue:
        u = queue.popleft()
        result.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                queue.append(v)

def bfsOfGraph(V: int, adj: List[List[int]]) -> List[int]:
    visited = [False] * V
    result = []
    BFS(adj, 0, visited, result)
    return result

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_bfs():
    print("Running BFS tests:")
    print("-----------------")

    # Test case 1
    V1 = 5
    edges1 = [[0,1], [0,2], [0,3], [2,4]]
    adj1 = create_graph(V1, edges1)
    print(f"Test case 1:")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = bfsOfGraph(V1, adj1)
    print(f"BFS traversal: {result1}")
    print()

    """
    Test case 1:
        Number of vertices: 5
        Edges: [[0, 1], [0, 2], [0, 3], [2, 4]]
        Graph structure (adjacency list):
        Vertex 0: [1, 2, 3]
        Vertex 1: [0]
        Vertex 2: [0, 4]
        Vertex 3: [0]
        Vertex 4: [2]

        BFS traversal: [0, 1, 2, 3, 4]
    """
    

if __name__ == "__main__":
    test_bfs()

"""
Explanation:

1. The BFS function has been updated to match the provided implementation:
   - It uses 'u' as the variable name for the current vertex being processed.
   - The visited marking and queue appending for neighbors are done in the same step.

2. All other functions (create_graph, bfsOfGraph, print_graph, and test_bfs) remain the same.

3. The overall logic of the BFS algorithm remains unchanged:
   - Start with the initial vertex, mark it as visited, and add it to the queue.
   - While the queue is not empty, process the next vertex:
     - Add it to the result list.
     - For each unvisited neighbor, mark it as visited and add it to the queue.

4. The output format remains the same, showing:
   - Number of vertices
   - List of edges
   - Graph structure (adjacency list)
   - BFS traversal result

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the queue, visited list, and result list.

This implementation maintains the correct BFS traversal while adhering to the
specific function structure provided.
"""