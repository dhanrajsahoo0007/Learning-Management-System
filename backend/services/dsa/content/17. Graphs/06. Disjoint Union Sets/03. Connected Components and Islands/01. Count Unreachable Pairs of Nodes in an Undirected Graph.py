"""
Problem Statement:
    You are given an integer n and a 2D integer array edges, where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in a graph.
    Return the number of pairs of different nodes that are unreachable from each other.

Time Complexity: O(V + E), where V is the number of nodes and E is the number of edges.
    - Initializing the DSU structure takes O(V) time.
    - Processing all edges takes O(E) time.
    - The final counting step takes O(V) time.

Space Complexity: O(V)
    - The parent and rank arrays each take O(V) space.
    - The component_sizes dictionary can store at most V entries.

Explanation:
    1. We use a Disjoint Set Union (DSU) data structure to efficiently group connected nodes.
    2. We process all edges, unioning the nodes they connect.
    3. After processing all edges, nodes in the same group are reachable from each other.
    4. We count the size of each group (connected component).
    5. For each group, we calculate how many pairs it forms with nodes outside the group.
    6. The sum of all these pairs gives us the total number of unreachable pairs.

This approach is efficient because:
    - DSU operations (find and union) have near-constant time complexity with path compression and union by rank.
    - We only need to iterate through the nodes and edges once each.
"""

class Solution:
    def __init__(self):
        self.parent = []  # Store the parent of each node
        self.rank = []    # Store the rank of each node for union by rank
    
    def find(self, x):
        # Find the parent of a node with path compression
        if x == self.parent[x]:
            return x
        self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        # Union two sets by rank
        x_parent = self.find(x)
        y_parent = self.find(y)
        if x_parent == y_parent:
            return
        if self.rank[x_parent] > self.rank[y_parent]:
            self.parent[y_parent] = x_parent
        elif self.rank[x_parent] < self.rank[y_parent]:
            self.parent[x_parent] = y_parent
        else:
            self.parent[x_parent] = y_parent
            self.rank[y_parent] += 1
    
    def countPairs(self, n: int, edges: list[list[int]]) -> int:
        # Initialize DSU
        self.parent = list(range(n))
        self.rank = [0] * n
        
        # Process all edges
        for u, v in edges:
            self.union(u, v)
        
        # Count the size of each connected component
        component_sizes = {}
        for i in range(n):
            parent = self.find(i)
            component_sizes[parent] = component_sizes.get(parent, 0) + 1
        
        result = 0
        remaining_nodes = n
        
        # Calculate the number of unreachable pairs
        for size in component_sizes.values():
            result += size * (remaining_nodes - size)
            remaining_nodes -= size
        
        return result

# Example usage
solution = Solution()
n = 7
edges = [[0,2],[0,5],[2,4],[1,6],[5,4]]
result = solution.countPairs(n, edges)
print(f"Number of unreachable pairs: {result}")