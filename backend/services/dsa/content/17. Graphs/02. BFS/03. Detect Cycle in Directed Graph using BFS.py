"""
Problem: Detect Cycle in Directed Graph using Kahn's Algorithm

Given a directed graph, detect if there is a cycle in the graph using Kahn's Algorithm.

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def has_cycle_kahns(V: int, adj: List[List[int]]) -> bool

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    True if a cycle is detected, False otherwise

Constraints:    1 ≤ V, E ≤ 10^4
"""

"""
    Topological sort can only be done in a Directed Acyclic graph 
    so if we can't have a topological sort for a graph then it is a cyclic graph 
    check the node count after the 

"""
from typing import List
from collections import deque

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
    return adj

def has_cycle_kahns(V: int, adj: List[List[int]]) -> bool:
    # Calculate in-degree for each vertex
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
    
    visited_count = 0
    
    while queue:
        u = queue.popleft()
        visited_count += 1
        
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    # If not all vertices are visited, there's a cycle
    return visited_count != V

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_cycle_detection():
    print("Running Cycle Detection tests using Kahn's Algorithm:")
    print("-----------------------------------------------------")

    # Test case 1: Directed Graph with a cycle
    V1 = 4
    edges1 = [[0,1], [1,2], [2,3], [3,1]]
    adj1 = create_graph(V1, edges1)
    print("Test case 1 (Directed Graph with a cycle):")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = has_cycle_kahns(V1, adj1)
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
    result2 = has_cycle_kahns(V2, adj2)
    print(f"Cycle detected: {result2}")
    print()

    # Test case 3: Directed Graph with a self-loop
    V3 = 3
    edges3 = [[0,1], [1,2], [2,2]]
    adj3 = create_graph(V3, edges3)
    print("Test case 3 (Directed Graph with a self-loop):")
    print(f"Number of vertices: {V3}")
    print(f"Edges: {edges3}")
    print_graph(adj3)
    result3 = has_cycle_kahns(V3, adj3)
    print(f"Cycle detected: {result3}")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_cycle_detection()

"""
Explanation:

1. Graph Creation:
   - The create_graph function builds an adjacency list representation of the directed graph.

2. Cycle Detection using Kahn's Algorithm:
   - Calculate in-degree for each vertex.
   - Initialize a queue with vertices having 0 in-degree.
   - Process vertices from the queue, reducing in-degrees of their neighbors.
   - If a neighbor's in-degree becomes 0, add it to the queue.
   - Keep track of the number of vertices processed.
   - If the number of processed vertices is less than the total number of vertices, a cycle exists.

Key points of Kahn's algorithm for cycle detection:
- It's based on the principle of topological sorting.
- A DAG (Directed Acyclic Graph) can be fully processed by this algorithm.
- If there's a cycle, some vertices will never have their in-degree reduced to 0.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the in-degree array and the queue.

This implementation correctly detects cycles in directed graphs using Kahn's algorithm.
It's efficient and can detect cycles of any length, including self-loops.
"""

"""
Advantages of Kahn's algorithm for cycle detection:
1. It can detect cycles of any length, including self-loops.
2. It's efficient, visiting each vertex and edge only once.
3. It provides a clear indication of the presence of a cycle without needing to trace the cycle itself.
4. The algorithm is relatively simple to implement and understand.

Considerations:
1. It modifies the graph structure (in-degrees), which might not be desirable in some cases.
2. It doesn't provide information about the specific vertices involved in the cycle.
3. For graphs without cycles, it effectively performs a topological sort as a side effect.
"""