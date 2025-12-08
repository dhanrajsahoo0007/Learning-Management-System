"""
Bellman-Ford Algorithm Implementation

    This algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph.
    It can handle graphs with negative edge weights and can detect negative cycles.

Time Complexity: O(V * E), where V is the number of vertices and E is the number of edges.
Space Complexity: O(V) for the result array.

Parameters:
    - V: Number of vertices in the graph
    - edges: List of edges, where each edge is [u, v, w] (u: source, v: destination, w: weight)
    - S: Source vertex

Returns:
- List of shortest distances from source to all vertices, or [-1] if a negative cycle is detected.

Note: Vertex indexing starts from 0.
"""

from typing import List

class Solution:
    def bellman_ford(self, V: int, edges: List[List[int]], S: int) -> List[int]:
        # Initialize distances
        result = [float('inf')] * V
        result[S] = 0
        
        # Relax all edges V-1 times
        for _ in range(V - 1):
            for u, v, w in edges:
                if result[u] != float('inf') and result[u] + w < result[v]:
                    result[v] = result[u] + w
        
        # Check for negative-weight cycles
        for u, v, w in edges:
            if result[u] != float('inf') and result[u] + w < result[v]:
                return [-1]  # Negative cycle detected
        
        # Replace infinity with -1 for unreachable nodes
        return [-1 if x == float('inf') else x for x in result]

# Example usage
if __name__ == "__main__":
    solution = Solution()
    
    # Example 1: Graph without negative cycle
    V1 = 5
    edges1 = [[0,1,5], [1,2,3], [2,3,1], [0,3,10], [1,3,2], [2,4,2], [3,4,6]]
    S1 = 0
    print("Example 1 output:", solution.bellman_ford(V1, edges1, S1))
    
    # Example 2: Graph with negative cycle
    V2 = 3
    edges2 = [[0,1,5], [1,2,-3], [2,0,-4]]
    S2 = 0
    print("Example 2 output:", solution.bellman_ford(V2, edges2, S2))
    
    # Example 3: Graph with unreachable nodes
    V3 = 4
    edges3 = [[0,1,1], [1,2,2], [2,3,3]]
    S3 = 0
    print("Example 3 output:", solution.bellman_ford(V3, edges3, S3))