"""
Problem: Detect Cycle in Undirected Graph using DFS

    Given an undirected graph, detect if there is a cycle in the graph using Depth-First Search (DFS).

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
     cycle is detected, False otherwise

Constraints:    1 ≤ V, E ≤ 10^4

Explanation:

1. The DFS function has been corrected to properly detect cycles:
   - It marks the current vertex as visited at the beginning.
   - For each adjacent vertex v:
     - If v is the parent, we skip it to avoid false positives.
     - If v is already visited (and not the parent), we've found a cycle.
     - If v is not visited, we recursively call DFS on v.
   - It returns True if a cycle is found, False otherwise.

2. The isCycle function remains the same as in your provided code:
   - It initializes the visited array.
   - It calls DFS for each unvisited vertex.
   - It returns True if DFS detects a cycle in any component, False otherwise.

Key points of the cycle detection algorithm:
    - We use DFS to traverse the graph.
    - We keep track of the parent vertex to avoid false positives.
    - A cycle is detected if we encounter an already visited vertex that is not the parent.

Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the visited array and the recursion stack.

own comments 
    1. here for cycle detection we need to keep track of who is parent in an un directed graph as 0 -> 1 and 1-> is also a posibility
    2. There can be dis joint graphs so we need to add a loop to go through all the elements of the graphs before calling BFS or DFS

"""

from typing import List

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)  # Since it's an undirected graph
    return adj

def DFS(adj: List[List[int]], u: int, parent: int, visited: List[bool]) -> bool:
    visited[u] = True
    
    for v in adj[u]:
        if v == parent:
            continue
        
        if visited[v]:
            return True
        
        if DFS(adj, v, u, visited):
            return True
    
    return False

def isCycle(V: int, adj: List[List[int]]) -> bool:
    visited = [False] * V
    
    ## Here use are using for loop for the case where there are more than 1 graphs that are not connected.
    for i in range(V):
        if not visited[i]:
            if DFS(adj, i, -1, visited):
                return True
    
    return False

def print_graph(adj: List[List[int]]) -> None:
    print("Graph structure (adjacency list):")
    for i, neighbors in enumerate(adj):
        print(f"  Vertex {i}: {neighbors}")
    print()

# Example usage and testing
def test_cycle_detection():
    print("Running Cycle Detection tests:")
    print("------------------------------")

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
