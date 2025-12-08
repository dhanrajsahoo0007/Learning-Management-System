"""
Problem: Topological Sort using Kahn's Algorithm (BFS)

Given a directed acyclic graph (DAG), perform a topological sort of its vertices using Kahn's Algorithm.

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def topological_sort_kahn(V: int, adj: List[List[int]]) -> List[int]

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    A list representing the topological order of vertices, or an empty list if a cycle is detected

Constraints:    1 ≤ V, E ≤ 10^4
"""

from typing import List
from collections import deque

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
    return adj

def topological_sort_kahn(V: int, adj: List[List[int]]) -> List[int]:
    # Calculate in-degree for each vertex
    # for ex: in_degree = [1,0,3,2,1]
    print(f"Printing adjacency list {adj}")
    in_degree = [0] * V
    for u in range(V):
        for v in adj[u]:
            in_degree[v] += 1
    
    # Initialize queue with vertices having 0 in-degree
    # queue = deque([u for u in range(V) if in_degree[u] == 0])
    queue = deque()
    for u in range(V):
        if in_degree[u] == 0:
            queue.append(u)
        
    topological_order = []
    
    while queue:
        u = queue.popleft()
        topological_order.append(u)
        
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    # Check if topological sort is possible (no cycle)
    if len(topological_order) == V:
        return topological_order
    else:
        return []  # Graph has at least one cycle

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_topological_sort():
    print("Running Topological Sort tests using Kahn's Algorithm:")
    print("-----------------------------------------------------")

    # Test case 1: Simple DAG
    V1 = 6
    edges1 = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]
    adj1 = create_graph(V1, edges1)
    print("Test case 1 (Simple DAG):")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = topological_sort_kahn(V1, adj1)
    print(f"Topological Order: {result1}")
    print()

    # Test case 2: Larger DAG
    V2 = 8
    edges2 = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6], [5, 7]]
    adj2 = create_graph(V2, edges2)
    print("Test case 2 (Larger DAG):")
    print(f"Number of vertices: {V2}")
    print(f"Edges: {edges2}")
    print_graph(adj2)
    result2 = topological_sort_kahn(V2, adj2)
    print(f"Topological Order: {result2}")
    print()

    # Test case 3: Graph with a cycle
    V3 = 4
    edges3 = [[0, 1], [1, 2], [2, 3], [3, 1]]
    adj3 = create_graph(V3, edges3)
    print("Test case 3 (Graph with a cycle):")
    print(f"Number of vertices: {V3}")
    print(f"Edges: {edges3}")
    print_graph(adj3)
    result3 = topological_sort_kahn(V3, adj3)
    print(f"Topological Order: {result3}")
    print("Empty list indicates a cycle was detected.")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_topological_sort()

"""
Explanation:

1. Graph Creation:
   - The create_graph function builds an adjacency list representation of the directed graph.

2. Kahn's Algorithm Implementation:
   - Calculate in-degree for each vertex.
   - Initialize a queue with vertices having 0 in-degree.
   - While the queue is not empty:
     - Remove a vertex from the queue and add it to the result.
     - Reduce the in-degree of its neighbors.
     - If a neighbor's in-degree becomes 0, add it to the queue.
   - If the number of processed vertices equals V, return the topological order.
   - Otherwise, return an empty list (indicating a cycle).

Key points of Kahn's algorithm for topological sort:
- It uses BFS and in-degree information to build the topological order.
- Vertices with 0 in-degree are processed first, ensuring that prerequisites are handled before dependent vertices.
- It can detect cycles in the graph.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the in-degree array, queue, and the result list.

This implementation correctly performs topological sorting on a DAG using Kahn's algorithm.
It also detects cycles in the graph, returning an empty list if a cycle is found.
"""