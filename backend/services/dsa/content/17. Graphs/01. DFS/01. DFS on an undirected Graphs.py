"""
Problem: Depth First Traversal of Undirected Graph
    Given the number of vertices V and a list of edges, create an undirected graph
    and perform a Depth First Traversal starting from the 0th vertex.
    Return the DFS traversal as a list.

Function Signatures:
    def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]
    def dfsOfGraph(V: int, adj: List[List[int]]) -> List[int]

Where:
    V: number of vertices
    edges: list of edges, where each edge is represented as [u, v]
    adj: adjacency list representation of the graph

Returns:
    List[int]: DFS traversal of the graph starting from vertex 0

Constraints:
    1 ≤ V, E ≤ 10^4
"""

from typing import List

def create_graph(V: int, edges: List[List[int]]) -> List[List[int]]:
    adj = [[] for _ in range(V)]
    print(adj)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)  # Since it's an undirected graph
        print(adj)
    return adj

def DFS(adj, u, visited, result):
    if visited[u] == True:
        return
    visited[u] = True
    result.append(u)  # Add visited vertex to result list
    for v in adj[u]:
        if not visited[v]:
            DFS(adj, v, visited, result)

def dfsOfGraph(V: int, adj: List[List[int]]) -> List[int]:
    visited = [False] * V
    result = []
    DFS(adj, 0, visited, result)
    return result

# def dfsOfGraph(V: int, adj: List[List[int]]) -> List[int]:
#     def dfs_internal(u: int):
#         if visited[u]:
#             return
#         visited[u] = True
#         result.append(u)
#         for v in adj[u]:
#             if not visited[v]:
#                 dfs_internal(v)

#     visited = [False] * V
#     result = []
#     dfs_internal(0)  # Start DFS from vertex 0
#     return result

# Example usage and testing
def test_dfs():
    print("Running DFS tests:")
    print("-----------------")

    # Test case 1
    V1 = 5
    edges1 = [[0,2], [0,3], [0,1], [2,4]]
    adj1 = create_graph(V1, edges1)
    result1 = dfsOfGraph(V1, adj1)
    print(f"Test case 1:")
    print(f"Number of vertices: {V1}")
    print(f"Edges: {edges1}")
    print(f"DFS traversal: {result1}")
    print()

    # Test case 2
    V2 = 4
    edges2 = [[0,1], [0,3], [1,2]]
    adj2 = create_graph(V2, edges2)
    result2 = dfsOfGraph(V2, adj2)
    print(f"Test case 2:")
    print(f"Number of vertices: {V2}")
    print(f"Edges: {edges2}")
    print(f"DFS traversal: {result2}")
    print()

    print("All test cases completed.")

if __name__ == "__main__":
    test_dfs()

"""
Explanation:

1. The create_graph, DFS, and dfsOfGraph functions remain the same as in the previous version.

2. The test_dfs function has been modified to print detailed information about each test case:
   - It prints the number of vertices.
   - It prints the list of edges.
   - It prints the resulting DFS traversal.

3. The assertions have been removed, and instead, we're simply printing the results.
   This allows us to see the output for each test case without stopping the execution if a test fails.

4. We've added some formatting (like headers and spacing) to make the output more readable.

Usage remains the same:
- Create a graph using create_graph.
- Perform DFS using dfsOfGraph.
- The test_dfs function demonstrates this usage with two test cases.

This modification allows for easier visualization of the input and output for each test case,
which can be helpful for understanding how the DFS traversal works on different graph structures.
"""