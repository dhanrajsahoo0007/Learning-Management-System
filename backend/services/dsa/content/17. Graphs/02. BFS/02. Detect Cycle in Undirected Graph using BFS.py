"""
Problem: Detect Cycle in Undirected Graph using BFS

    Given an undirected graph, detect if there is a cycle in the graph using Breadth-First Search (BFS).
    This implementation uses a queue of pairs to keep track of both the current node and its parent.

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def isCycleBFS(adj: List[List[int]], u: int, visited: List[bool]) -> bool
    def isCycle(V: int, adj: List[List[int]]) -> bool

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    bool: True if a cycle is detected, False otherwise

Constraints:
    1 ≤ V, E ≤ 10^4
"""

from typing import List
from collections import deque

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)  # Since it's an undirected graph
    return adj

def isCycleBFS(adj: List[List[int]], u: int, visited: List[bool]) -> bool:
    # for the first node parent is -1 
    que = deque([(u, -1)])  # (node, parent) pairs
    visited[u] = True

    while que:
        source, parent = que.popleft()
        
        # source is the source node
        for v in adj[source]:
            if not visited[v]:
                visited[v] = True
                que.append((v, source))
            elif v != parent:
                return True

    return False

def isCycle(V: int, adj: List[List[int]]) -> bool:
    visited = [False] * V
    
    for i in range(V):
        if not visited[i]:
            if isCycleBFS(adj, i, visited):
                return True
    
    return False

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_cycle_detection():
    print("Running Cycle Detection tests using BFS:")
    print("----------------------------------------")

    # Test case 1: Graph with a cycle
    V1 = 5
    edges1 = [[0,1], [1,2], [2,3], [3,4], [4,1]]
    adj1 = create_graph(V1, edges1)
    print("Test case 1 (Graph with a cycle):")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = isCycle(V1, adj1)
    print(f"Cycle detected: {result1}")
    print()

    # Test case 2: Graph without a cycle
    V2 = 4
    edges2 = [[0,1], [1,2], [2,3]]
    adj2 = create_graph(V2, edges2)
    print("Test case 2 (Graph without a cycle):")
    print(f"Number of vertices: {V2}")
    print(f"Edges: {edges2}")
    print_graph(adj2)
    result2 = isCycle(V2, adj2)
    print(f"Cycle detected: {result2}")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_cycle_detection()

"""
Explanation:

1. create_graph function remains the same as before.

2. isCycleBFS function implements the BFS-based cycle detection:
   - It uses a queue of (node, parent) pairs.
   - It marks the starting node as visited and adds it to the queue with a parent of -1.
   - For each node, it checks all its neighbors:
     - If a neighbor is not visited, it's marked as visited and added to the queue.
     - If a neighbor is visited and not the parent, a cycle is detected.

3. isCycle function:
   - Initializes the visited array.
   - Calls isCycleBFS for each unvisited vertex (to handle disconnected components).
   - Returns True if a cycle is detected in any component, False otherwise.

4. print_graph and test_cycle_detection functions remain similar to before.

Key points of this BFS-based cycle detection:
- We use a queue of (node, parent) pairs to keep track of the BFS traversal and parent information.
- A cycle is detected if we encounter an already visited vertex that is not the parent of the current vertex.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the queue and visited array.

This implementation closely follows the structure of the C++ code provided in the image,
adapted to Python syntax and conventions.
"""