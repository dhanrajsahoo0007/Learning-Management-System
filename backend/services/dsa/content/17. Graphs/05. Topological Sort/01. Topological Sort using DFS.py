"""
Problem: Topological Sort using DFS

Given a directed acyclic graph (DAG), perform a topological sort of its vertices using Depth-First Search (DFS).

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def topological_sort_dfs(V: int, adj: List[List[int]]) -> List[int]
    def dfs(v: int, adj: List[List[int]], visited: List[bool], stack: List[int]) -> None

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    A list representing the topological order of vertices

Constraints:    1 ≤ V, E ≤ 10^4
"""

from typing import List

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
    return adj

def dfs(u: int, adj: List[List[int]], visited: List[bool], stack: List[int]) -> None:
    visited[u] = True
    
    for v in adj[u]:
        if not visited[v]:
            dfs(v, adj, visited, stack)
    
    stack.append(u)

def topological_sort_dfs(V: int, adj: List[List[int]]) -> List[int]:
    visited = [False] * V
    stack = []
    
    for i in range(V):
        if not visited[i]:
            dfs(i, adj, visited, stack)
    
    return stack[::-1]  # Reverse the stack to get the topological order

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_topological_sort():
    print("Running Topological Sort tests using DFS:")
    print("----------------------------------------")

    # Test case 1: Simple DAG
    V1 = 6
    edges1 = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]
    adj1 = create_graph(V1, edges1)
    print("Test case 1 (Simple DAG):")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print_graph(adj1)
    result1 = topological_sort_dfs(V1, adj1)
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
    result2 = topological_sort_dfs(V2, adj2)
    print(f"Topological Order: {result2}")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_topological_sort()

"""
Explanation:

1. Graph Creation:
   - The create_graph function builds an adjacency list representation of the directed graph.

2. DFS Function:
   - The dfs function performs a depth-first search traversal.
   - It marks the current vertex as visited.
   - It recursively visits all unvisited neighbors.
   - After exploring all neighbors, it adds the current vertex to the stack.

3. Topological Sort Function:
   - The topological_sort_dfs function initializes the visited array and result stack.
   - It calls dfs for each unvisited vertex.
   - Finally, it returns the reversed stack, which gives the topological order.

Key points of the DFS-based topological sort algorithm:
    - We use DFS to explore the graph and build the topological order.
    - The order in which vertices are added to the stack ensures that a vertex is added only after all its dependencies are processed.
    - Reversing the stack at the end gives the correct topological order.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the visited array, recursion stack, and the result stack.

    This implementation correctly performs topological sorting on a DAG using DFS.
    It's important to note that this algorithm assumes the input graph is a DAG. 
    If the graph contains a cycle, the result may not be a valid topological order.
"""

"""
Properties of Topological Sort demonstrated in this implementation:
    1. It works on Directed Acyclic Graphs (DAGs).
    2. The result ensures that for every directed edge (u, v), u comes before v in the ordering.
    3. The algorithm can handle disconnected graphs.
    4. The first vertex in the output has no incoming edges in the original graph.
    5. The last vertex in the output has no outgoing edges in the original graph.


Difference between the normal DFS and the topological DFS is 
    1. We are taking an additional Stack to store the elements so that we can always return u then v .
    2. In stack u stays on top , then v
    
"""

